import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../common/prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { AuthResponseDto } from './dto/auth-response.dto'

/**
 * 认证服务
 * 
 * @description 处理用户注册、登录、JWT Token 生成等认证相关业务
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  /**
   * 用户注册
   * 
   * @description 创建新用户，密码使用 bcrypt 加密
   * @param registerDto 注册数据
   * @returns 认证响应（包含 Token 和用户信息）
   * @throws ConflictException 如果邮箱或用户名已存在
   */
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const { email, username, password, nickname } = registerDto

    // 检查邮箱是否已存在
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email },
    })
    if (existingUserByEmail) {
      throw new ConflictException('邮箱已被注册')
    }

    // 检查用户名是否已存在
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username },
    })
    if (existingUserByUsername) {
      throw new ConflictException('用户名已被使用')
    }

    // 加密密码（成本因子 10）
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        nickname,
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        username: true,
        nickname: true,
        avatar: true,
        role: true,
      },
    })

    // 创建用户资料
    await this.prisma.userProfile.create({
      data: {
        userId: user.id,
        currentLevel: 1,
        currentExp: 0,
        nextLevelExp: 100,
      },
    })

    // 生成 JWT Token
    const accessToken = this.generateToken(user.id, user.email)

    return {
      accessToken,
      user: {
        ...user,
        nickname: user.nickname ?? undefined,
        avatar: user.avatar ?? undefined,
      },
    }
  }

  /**
   * 用户登录
   * 
   * @description 验证用户凭据，生成 JWT Token
   * @param loginDto 登录数据
   * @returns 认证响应（包含 Token 和用户信息）
   * @throws UnauthorizedException 如果凭据无效
   */
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { usernameOrEmail, password } = loginDto

    // 查找用户（支持用户名或邮箱登录）
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: usernameOrEmail },
          { username: usernameOrEmail },
        ],
      },
    })

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    // 检查用户是否激活
    if (!user.isActive) {
      throw new UnauthorizedException('账户已被禁用')
    }

    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // 生成 JWT Token
    const accessToken = this.generateToken(user.id, user.email)

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        nickname: user.nickname || undefined,
        avatar: user.avatar || undefined,
        role: user.role,
      },
    }
  }

  /**
   * 生成 JWT Token
   * 
   * @description 生成包含用户 ID 和邮箱的 JWT Token
   * @param userId 用户 ID
   * @param email 用户邮箱
   * @returns JWT Token
   */
  private generateToken(userId: string, email: string): string {
    const payload = { userId, email }
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') || '7d'

    return this.jwtService.sign(payload, { expiresIn })
  }
}

