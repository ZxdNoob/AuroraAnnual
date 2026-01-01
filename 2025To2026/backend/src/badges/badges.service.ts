import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { BadgeChecker } from './utils/badge-checker'
import { BADGE_DATA } from './utils/badge-data'
import { BadgeDto, UserBadgeDto, BadgeListQueryDto } from './dto/badge.dto'

/**
 * 勋章服务
 * 
 * @description 处理勋章相关的业务逻辑：
 * - 勋章数据初始化
 * - 勋章获取条件检查
 * - 用户勋章展示
 * - 自动授予勋章
 */
@Injectable()
export class BadgesService {
  private badgeChecker: BadgeChecker

  constructor(private prisma: PrismaService) {
    this.badgeChecker = new BadgeChecker(prisma)
  }

  /**
   * 初始化勋章数据
   * 
   * @description 将预定义的勋章数据写入数据库
   * 
   * @returns 创建的勋章数量
   */
  async initializeBadges(): Promise<number> {
    let createdCount = 0

    for (const badgeData of BADGE_DATA) {
      // 检查勋章是否已存在
      const existing = await this.prisma.badge.findUnique({
        where: { name: badgeData.name },
      })

      if (!existing) {
        // 创建新勋章
        await this.prisma.badge.create({
          data: {
            name: badgeData.name,
            description: badgeData.description,
            icon: badgeData.icon,
            type: badgeData.type,
            condition: badgeData.condition as any,
            rarity: badgeData.rarity,
          },
        })
        createdCount++
      }
    }

    return createdCount
  }

  /**
   * 获取所有勋章列表
   * 
   * @param userId 用户 ID（可选，用于标记已获得的勋章）
   * @param query 查询参数
   * @returns 勋章列表
   */
  async getAllBadges(userId?: string, query?: BadgeListQueryDto): Promise<BadgeDto[]> {
    const where: any = {}

    // 类型筛选
    if (query?.type) {
      where.type = query.type
    }

    // 稀有度筛选
    if (query?.rarity) {
      where.rarity = query.rarity
    }

    // 获取所有勋章
    const badges = await this.prisma.badge.findMany({
      where,
      orderBy: [
        { rarity: 'asc' }, // 按稀有度排序
        { type: 'asc' }, // 按类型排序
        { name: 'asc' }, // 按名称排序
      ],
    })

    // 如果提供了用户 ID，标记已获得的勋章
    if (userId) {
      const userBadges = await this.prisma.userBadge.findMany({
        where: { userId },
        select: { badgeId: true, achievedAt: true },
      })

      const userBadgeMap = new Map(
        userBadges.map((ub) => [ub.badgeId, ub.achievedAt])
      )

      return badges.map((badge) => ({
        id: badge.id,
        name: badge.name,
        description: badge.description || undefined,
        icon: badge.icon,
        type: badge.type,
        rarity: badge.rarity,
        achieved: userBadgeMap.has(badge.id),
        achievedAt: userBadgeMap.get(badge.id),
      }))
    }

    return badges.map((badge) => ({
      id: badge.id,
      name: badge.name,
      description: badge.description || undefined,
      icon: badge.icon,
      type: badge.type,
      rarity: badge.rarity,
    }))
  }

  /**
   * 获取用户的勋章列表
   * 
   * @param userId 用户 ID
   * @param query 查询参数
   * @returns 用户勋章列表
   */
  async getUserBadges(userId: string, query?: BadgeListQueryDto): Promise<UserBadgeDto[]> {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const where: any = {
      userId,
    }

    // 如果指定了类型或稀有度，需要通过 badge 关联查询
    if (query?.type || query?.rarity) {
      where.badge = {}
      if (query.type) {
        where.badge.type = query.type
      }
      if (query.rarity) {
        where.badge.rarity = query.rarity
      }
    }

    // 获取用户勋章
    const userBadges = await this.prisma.userBadge.findMany({
      where,
      include: {
        badge: true,
      },
      orderBy: {
        achievedAt: 'desc',
      },
    })

    return userBadges.map((userBadge) => ({
      id: userBadge.id,
      badge: {
        id: userBadge.badge.id,
        name: userBadge.badge.name,
        description: userBadge.badge.description || undefined,
        icon: userBadge.badge.icon,
        type: userBadge.badge.type,
        rarity: userBadge.badge.rarity,
        achieved: true,
        achievedAt: userBadge.achievedAt,
      },
      achievedAt: userBadge.achievedAt,
    }))
  }

  /**
   * 检查并授予符合条件的勋章
   * 
   * @description 检查用户是否满足某些勋章的获取条件，如果满足则自动授予
   * 
   * @param userId 用户 ID
   * @param badgeType 要检查的勋章类型（可选，如果提供则只检查该类型的勋章）
   * @returns 新获得的勋章列表
   */
  async checkAndAwardBadges(userId: string, badgeType?: string): Promise<BadgeDto[]> {
    const newlyAwarded: BadgeDto[] = []

    // 获取所有勋章（如果指定了类型，则只获取该类型的勋章）
    const where: any = {}
    if (badgeType) {
      where.type = badgeType
    }

    const badges = await this.prisma.badge.findMany({
      where,
    })

    // 检查每个勋章
    for (const badge of badges) {
      // 检查是否已获得
      const hasBadge = await this.badgeChecker.hasBadge(userId, badge.id)
      if (hasBadge) {
        continue
      }

      // 检查是否满足条件
      const condition = badge.condition as any
      const meetsCondition = await this.badgeChecker.checkCondition(userId, condition)

      // 检查首次达成条件
      const meetsFirstTime = await this.badgeChecker.checkFirstTime(
        userId,
        badge.type,
        condition
      )

      if (meetsCondition && meetsFirstTime) {
        // 授予勋章
        await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        })

        newlyAwarded.push({
          id: badge.id,
          name: badge.name,
          description: badge.description || undefined,
          icon: badge.icon,
          type: badge.type,
          rarity: badge.rarity,
          achieved: true,
          achievedAt: new Date(),
        })
      }
    }

    return newlyAwarded
  }

  /**
   * 获取用户的勋章统计
   * 
   * @param userId 用户 ID
   * @returns 勋章统计信息
   */
  async getUserBadgeStatistics(userId: string): Promise<{
    total: number
    achieved: number
    byType: Record<string, number>
    byRarity: Record<string, number>
  }> {
    // 获取所有勋章数量
    const total = await this.prisma.badge.count()

    // 获取用户已获得的勋章数量
    const achieved = await this.prisma.userBadge.count({
      where: { userId },
    })

    // 按类型统计
    const byTypeData = await this.prisma.userBadge.groupBy({
      by: ['badgeId'],
      where: { userId },
      _count: true,
    })

    // 获取勋章类型信息
    const badgeIds = byTypeData.map((item) => item.badgeId)
    const badges = await this.prisma.badge.findMany({
      where: { id: { in: badgeIds } },
      select: { id: true, type: true, rarity: true },
    })

    const badgeMap = new Map(badges.map((b) => [b.id, b]))

    const byType: Record<string, number> = {}
    const byRarity: Record<string, number> = {}

    byTypeData.forEach((item) => {
      const badge = badgeMap.get(item.badgeId)
      if (badge) {
        byType[badge.type] = (byType[badge.type] || 0) + 1
        byRarity[badge.rarity] = (byRarity[badge.rarity] || 0) + 1
      }
    })

    return {
      total,
      achieved,
      byType,
      byRarity,
    }
  }
}

