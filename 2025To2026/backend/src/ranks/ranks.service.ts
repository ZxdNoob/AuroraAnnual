import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { RANK_DATA } from './utils/rank-data'
import {
  calculateCurrentSeason,
  getSeasonDateRange,
} from './utils/season-calculator'
import {
  canUpgradeStar,
  canUpgradeRank,
  calculateSeasonInheritance,
  calculateRankDowngrade,
  getRankDataByLevel,
  getNextRankData,
} from './utils/rank-calculator'

/**
 * 段位服务
 * 
 * @description 处理段位相关的业务逻辑：
 * - 段位数据初始化
 * - 段位晋升和降级
 * - 赛季管理
 * - 段位继承
 */
@Injectable()
export class RanksService {
  constructor(private prisma: PrismaService) {}

  /**
   * 初始化段位数据
   * 
   * @description 在数据库初始化时创建所有段位数据
   * 如果段位数据已存在，则跳过
   * 
   * @param season 赛季数（默认当前赛季）
   */
  async initializeRanks(season?: number): Promise<void> {
    const currentSeason = season || calculateCurrentSeason()

    // 检查段位数据是否已存在
    const existingRanks = await this.prisma.rank.findMany({
      where: { season: currentSeason },
    })

    if (existingRanks.length > 0) {
      // 段位数据已存在，跳过初始化
      return
    }

    // 创建所有段位数据
    await Promise.all(
      RANK_DATA.map((rankData) =>
        this.prisma.rank.create({
          data: {
            name: rankData.name,
            level: rankData.level,
            minStars: rankData.minStars,
            maxStars: rankData.maxStars,
            requiredCheckIns: rankData.requiredCheckIns,
            season: currentSeason,
          },
        })
      )
    )
  }

  /**
   * 检查并处理段位晋升
   * 
   * @description 检查用户是否满足段位晋升条件，如果满足则晋升
   * 
   * @param userId 用户 ID
   * @param checkInCount 当前段位打卡次数
   * @returns 是否发生段位晋升，以及新的段位信息
   */
  async checkAndUpgradeRank(
    userId: string,
    checkInCount: number
  ): Promise<{ upgraded: boolean; newRank?: any; newStars?: number }> {
    // 获取用户资料和当前段位
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { currentRank: true },
    })

    if (!userProfile || !userProfile.currentRank) {
      return { upgraded: false }
    }

    const currentRank = userProfile.currentRank
    const currentSeason = calculateCurrentSeason()

    // 获取用户当前段位记录
    const userRank = await this.prisma.userRank.findFirst({
      where: {
        userId,
        rankId: currentRank.id,
        season: currentSeason,
      },
    })

    if (!userRank) {
      return { upgraded: false }
    }

    // 检查是否可以升星
    const canUpgradeStarResult = canUpgradeStar(
      currentRank.level,
      userRank.stars,
      currentRank.maxStars
    )

    if (canUpgradeStarResult) {
      // 检查是否达到升星条件（每星需要 10 次打卡）
      const checkInsForNextStar = (userRank.stars + 1) * 10
      if (checkInCount >= checkInsForNextStar) {
        // 升星
        await this.prisma.userRank.update({
          where: { id: userRank.id },
          data: { stars: userRank.stars + 1 },
        })

        return {
          upgraded: true,
          newRank: currentRank,
          newStars: userRank.stars + 1,
        }
      }
    }

    // 检查是否可以晋升到下一段位
    const canUpgradeRankResult = canUpgradeRank(
      currentRank.level,
      userRank.stars,
      currentRank.maxStars,
      checkInCount,
      currentRank.requiredCheckIns
    )

    if (canUpgradeRankResult) {
      // 获取下一段位数据
      const nextRankData = getNextRankData(currentRank.level)

      if (!nextRankData) {
        return { upgraded: false }
      }

      // 查找下一段位
      const nextRank = await this.prisma.rank.findFirst({
        where: {
          level: nextRankData.level,
          season: currentSeason,
        },
      })

      if (!nextRank) {
        // 如果下一段位不存在，初始化段位数据
        await this.initializeRanks(currentSeason)
        const newNextRank = await this.prisma.rank.findFirst({
          where: {
            level: nextRankData.level,
            season: currentSeason,
          },
        })

        if (!newNextRank) {
          return { upgraded: false }
        }

        // 创建新的用户段位记录
        await this.prisma.userRank.create({
          data: {
            userId,
            rankId: newNextRank.id,
            stars: 1, // 新段位从 1 星开始
            checkInCount: 0,
            season: currentSeason,
          },
        })

        // 更新用户资料中的当前段位
        await this.prisma.userProfile.update({
          where: { userId },
          data: { currentRankId: newNextRank.id },
        })

        return {
          upgraded: true,
          newRank: newNextRank,
          newStars: 1,
        }
      }

      // 创建新的用户段位记录
      await this.prisma.userRank.create({
        data: {
          userId,
          rankId: nextRank.id,
          stars: 1, // 新段位从 1 星开始
          checkInCount: 0,
          season: currentSeason,
        },
      })

      // 更新用户资料中的当前段位
      await this.prisma.userProfile.update({
        where: { userId },
        data: { currentRankId: nextRank.id },
      })

      return {
        upgraded: true,
        newRank: nextRank,
        newStars: 1,
      }
    }

    return { upgraded: false }
  }

  /**
   * 处理赛季继承
   * 
   * @description 赛季结束时，处理所有用户的段位继承
   * 应该在赛季切换时调用
   * 
   * @param fromSeason 上赛季数
   * @param toSeason 新赛季数
   */
  async handleSeasonInheritance(
    fromSeason: number,
    toSeason: number
  ): Promise<void> {
    // 获取所有用户的上赛季段位记录
    const userRanks = await this.prisma.userRank.findMany({
      where: { season: fromSeason },
      include: { rank: true, user: { include: { profile: true } } },
    })

    // 确保新赛季的段位数据已初始化
    await this.initializeRanks(toSeason)

    // 处理每个用户的段位继承
    for (const userRank of userRanks) {
      const { rankLevel, stars } = calculateSeasonInheritance(
        userRank.rank.level,
        userRank.stars
      )

      // 查找新赛季的段位
      const newRank = await this.prisma.rank.findFirst({
        where: {
          level: rankLevel,
          season: toSeason,
        },
      })

      if (!newRank) {
        continue
      }

      // 创建新赛季的段位记录
      await this.prisma.userRank.create({
        data: {
          userId: userRank.userId,
          rankId: newRank.id,
          stars,
          checkInCount: 0,
          season: toSeason,
        },
      })

      // 更新用户资料中的当前段位
      if (userRank.user.profile) {
        await this.prisma.userProfile.update({
          where: { userId: userRank.userId },
          data: { currentRankId: newRank.id },
        })
      }
    }
  }

  /**
   * 处理长期不打卡的段位降级
   * 
   * @description 检查用户是否长期不打卡，如果是则降段
   * 
   * @param userId 用户 ID
   */
  async handleRankDowngrade(userId: string): Promise<void> {
    // 获取用户资料
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { currentRank: true },
    })

    if (!userProfile || !userProfile.currentRank) {
      return
    }

    // 获取用户最近的打卡记录
    const lastCheckIn = await this.prisma.checkIn.findFirst({
      where: { userId },
      orderBy: { checkInDate: 'desc' },
    })

    if (!lastCheckIn) {
      // 如果从未打卡，降为最低段位
      const lowestRank = await this.prisma.rank.findFirst({
        where: {
          level: 1,
          season: calculateCurrentSeason(),
        },
      })

      if (lowestRank) {
        await this.prisma.userProfile.update({
          where: { userId },
          data: { currentRankId: lowestRank.id },
        })
      }
      return
    }

    // 计算降级后的段位等级
    const newRankLevel = calculateRankDowngrade(
      lastCheckIn.checkInDate,
      userProfile.currentRank.level
    )

    if (newRankLevel < userProfile.currentRank.level) {
      // 查找新段位
      const newRank = await this.prisma.rank.findFirst({
        where: {
          level: newRankLevel,
          season: calculateCurrentSeason(),
        },
      })

      if (newRank) {
        // 更新用户资料中的当前段位
        await this.prisma.userProfile.update({
          where: { userId },
          data: { currentRankId: newRank.id },
        })
      }
    }
  }

  /**
   * 获取用户当前段位信息
   * 
   * @description 获取用户在当前赛季的段位信息
   * 
   * @param userId 用户 ID
   * @returns 用户段位信息
   */
  async getUserRank(userId: string) {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        currentRank: true,
      },
    })

    if (!userProfile || !userProfile.currentRank) {
      throw new NotFoundException('用户段位信息不存在')
    }

    const currentSeason = calculateCurrentSeason()

    const userRank = await this.prisma.userRank.findFirst({
      where: {
        userId,
        rankId: userProfile.currentRank.id,
        season: currentSeason,
      },
      include: {
        rank: true,
      },
    })

    return {
      rank: userProfile.currentRank,
      stars: userRank?.stars || 1,
      checkInCount: userRank?.checkInCount || 0,
      season: currentSeason,
    }
  }

  /**
   * 获取段位排行榜
   * 
   * @description 获取当前赛季的段位排行榜
   * 
   * @param limit 返回数量限制
   * @returns 段位排行榜
   */
  async getRankLeaderboard(limit: number = 100) {
    const currentSeason = calculateCurrentSeason()

    // 获取所有用户的段位记录，按段位等级和星级排序
    const userRanks = await this.prisma.userRank.findMany({
      where: { season: currentSeason },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        rank: true,
      },
      orderBy: [
        { rank: { level: 'desc' } }, // 先按段位等级降序
        { stars: 'desc' }, // 再按星级降序
      ],
      take: limit,
    })

    return userRanks.map((userRank) => ({
      userId: userRank.user.id,
      username: userRank.user.username,
      nickname: userRank.user.nickname,
      avatar: userRank.user.avatar,
      rank: userRank.rank.name,
      rankLevel: userRank.rank.level,
      stars: userRank.stars,
      checkInCount: userRank.checkInCount,
    }))
  }
}

