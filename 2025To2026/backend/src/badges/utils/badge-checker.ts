import { PrismaService } from '../../common/prisma/prisma.service'
import { BadgeCondition } from './badge-data'

/**
 * 勋章检查器
 * 
 * @description 检查用户是否满足勋章获取条件
 */
export class BadgeChecker {
  constructor(private prisma: PrismaService) {}

  /**
   * 检查用户是否满足勋章条件
   * 
   * @param userId 用户 ID
   * @param condition 勋章条件
   * @returns 是否满足条件
   */
  async checkCondition(userId: string, condition: BadgeCondition): Promise<boolean> {
    // 获取用户资料
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        currentRank: true,
      },
    })

    if (!userProfile) {
      return false
    }

    // 检查首次达成条件
    if (condition.firstTime !== undefined) {
      // 首次达成需要特殊处理，这里简化处理
      // 实际应该检查是否已经获得过相关勋章
    }

    // 检查连续打卡天数
    if (condition.consecutiveCheckInDays !== undefined) {
      if (userProfile.consecutiveCheckInDays < condition.consecutiveCheckInDays) {
        return false
      }
    }

    // 检查累计打卡天数
    if (condition.totalCheckInDays !== undefined) {
      if (userProfile.totalCheckInDays < condition.totalCheckInDays) {
        return false
      }
    }

    // 检查连续登录天数
    if (condition.consecutiveLoginDays !== undefined) {
      if (userProfile.consecutiveLoginDays < condition.consecutiveLoginDays) {
        return false
      }
    }

    // 检查累计登录天数（需要从登录记录中统计）
    if (condition.totalLoginDays !== undefined) {
      // 这里简化处理，实际应该统计登录记录
      // 暂时使用连续登录天数作为近似值
      if (userProfile.consecutiveLoginDays < condition.totalLoginDays) {
        return false
      }
    }

    // 检查等级
    if (condition.level !== undefined) {
      if (userProfile.currentLevel < condition.level) {
        return false
      }
    }

    // 检查段位等级
    if (condition.rankLevel !== undefined) {
      if (!userProfile.currentRank || userProfile.currentRank.level < condition.rankLevel) {
        return false
      }
    }

    // 检查段位名称
    if (condition.rankName !== undefined) {
      if (!userProfile.currentRank || userProfile.currentRank.name !== condition.rankName) {
        return false
      }
    }

    return true
  }

  /**
   * 检查用户是否已获得指定勋章
   * 
   * @param userId 用户 ID
   * @param badgeId 勋章 ID
   * @returns 是否已获得
   */
  async hasBadge(userId: string, badgeId: string): Promise<boolean> {
    const userBadge = await this.prisma.userBadge.findUnique({
      where: {
        userId_badgeId: {
          userId,
          badgeId,
        },
      },
    })

    return !!userBadge
  }

  /**
   * 检查用户是否满足首次达成条件
   * 
   * @param userId 用户 ID
   * @param badgeType 勋章类型
   * @param condition 勋章条件
   * @returns 是否满足首次达成条件
   */
  async checkFirstTime(userId: string, badgeType: string, condition: BadgeCondition): Promise<boolean> {
    if (!condition.firstTime) {
      return true // 不是首次达成条件，直接返回 true
    }

    // 检查是否已经获得过同类型的勋章
    const existingBadges = await this.prisma.userBadge.findMany({
      where: {
        userId,
        badge: {
          type: badgeType as any,
        },
      },
    })

    // 如果是首次达成条件，且已经获得过同类型勋章，则不满足条件
    if (existingBadges.length > 0) {
      return false
    }

    return true
  }
}

