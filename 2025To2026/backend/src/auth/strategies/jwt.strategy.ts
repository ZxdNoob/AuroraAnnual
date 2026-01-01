import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma/prisma.service'

/**
 * JWT 策略
 * 
 * @description 用于验证 JWT Token 的策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      // 从请求头中提取 JWT Token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 忽略过期时间（由 JWT 模块处理）
      ignoreExpiration: false,
      // JWT 密钥
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    })
  }

  /**
   * 验证 JWT Token
   * 
   * @description 验证 Token 后，从数据库查询用户信息
   * @param payload JWT Payload（包含用户 ID）
   * @returns 用户信息
   */
  async validate(payload: { userId: string; email: string }) {
    // 从数据库查询用户
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      include: { profile: true },
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException('用户不存在或已被禁用')
    }

    // 更新最后登录时间
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // 返回用户信息（会被附加到 request.user）
    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }
  }
}

