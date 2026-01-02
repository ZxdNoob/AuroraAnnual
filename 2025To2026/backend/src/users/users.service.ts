import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'

/**
 * 用户服务
 * 
 * @description 处理用户相关的业务逻辑
 */
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 根据 ID 获取用户信息
   * 
   * @param userId 用户 ID
   * @returns 用户信息
   */
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        nickname: true,
        avatar: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    return user
  }

  /**
   * 获取用户资料
   * 
   * @param userId 用户 ID
   * @returns 用户资料
   */
  async getUserProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
    })

    if (!profile) {
      throw new NotFoundException('用户资料不存在')
    }

    return profile
  }
}

