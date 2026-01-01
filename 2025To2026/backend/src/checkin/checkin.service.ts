import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { RanksService } from '../ranks/ranks.service'
import { BadgesService } from '../badges/badges.service'
import { calculateCheckInPoints } from './utils/points-calculator'
import { calculateExperience } from './utils/experience-calculator'
import { calculateCurrentSeason } from '../ranks/utils/season-calculator'
import { CheckInResponseDto } from './dto/checkin-response.dto'

/**
 * 打卡服务
 * 
 * @description 处理用户打卡、积分计算、经验计算、段位晋升等业务逻辑
 */
@Injectable()
export class CheckInService {
  constructor(
    private prisma: PrismaService,
    private ranksService: RanksService,
    private badgesService: BadgesService
  ) {}

  /**
   * 用户打卡
   * 
   * @description 处理用户打卡逻辑：
   * 1. 检查今日是否已打卡
   * 2. 计算连续打卡天数
   * 3. 计算积分和经验值
   * 4. 更新用户资料
   * 5. 检查段位晋升和等级提升
   * 
   * @param userId 用户 ID
   * @returns 打卡响应数据
   * @throws BadRequestException 如果今日已打卡
   */
  async checkIn(userId: string): Promise<CheckInResponseDto> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // 检查今日是否已打卡
    const todayCheckIn = await this.prisma.checkIn.findFirst({
      where: {
        userId,
        checkInDate: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
    })

    if (todayCheckIn) {
      throw new BadRequestException('今日已打卡')
    }

    // 获取用户资料
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: {
        user: true,
        currentRank: true,
      },
    })

    if (!userProfile) {
      throw new NotFoundException('用户资料不存在')
    }

    // 计算连续打卡天数
    const consecutiveDays = await this.calculateConsecutiveDays(userId)

    // 计算积分和经验值
    const pointsEarned = calculateCheckInPoints(consecutiveDays)
    const expEarned = calculateExperience(
      userProfile.consecutiveLoginDays,
      consecutiveDays
    )

    // 使用事务处理打卡相关数据更新
    const result = await this.prisma.$transaction(async (tx) => {
      // 创建打卡记录
      const checkIn = await tx.checkIn.create({
        data: {
          userId,
          checkInDate: today,
          pointsEarned,
          expEarned,
          consecutiveDays,
        },
      })

      // 更新用户资料
      const newTotalPoints = userProfile.totalPoints + pointsEarned
      const newTotalExp = userProfile.currentExp + expEarned
      const newConsecutiveCheckInDays = consecutiveDays
      const newTotalCheckInDays = userProfile.totalCheckInDays + 1

      // 检查等级提升
      const { level: newLevel, nextLevelExp } = await this.checkLevelUp(
        tx,
        userId,
        newTotalExp,
        userProfile.currentLevel
      )

      // 更新用户资料
      await tx.userProfile.update({
        where: { userId },
        data: {
          totalPoints: newTotalPoints,
          currentExp: newTotalExp,
          nextLevelExp,
          currentLevel: newLevel,
          consecutiveCheckInDays: newConsecutiveCheckInDays,
          totalCheckInDays: newTotalCheckInDays,
        },
      })

      // 创建积分记录
      await tx.point.create({
        data: {
          userId,
          amount: pointsEarned,
          type: 'CHECK_IN',
          description: `连续打卡 ${consecutiveDays} 天`,
        },
      })

      // 创建经验记录
      await tx.experience.create({
        data: {
          userId,
          amount: expEarned,
          type: 'CHECK_IN',
          description: `打卡获得经验值`,
        },
      })

      // 更新用户段位记录的打卡次数
      if (userProfile.currentRankId) {
        const currentSeason = calculateCurrentSeason()
        const userRank = await tx.userRank.findFirst({
          where: {
            userId,
            rankId: userProfile.currentRankId,
            season: currentSeason,
          },
        })

        if (userRank) {
          // 更新打卡次数
          await tx.userRank.update({
            where: { id: userRank.id },
            data: { checkInCount: userRank.checkInCount + 1 },
          })
        }
      }

      return {
        checkIn,
        levelUp: newLevel > userProfile.currentLevel,
        rankUp: false, // 段位晋升在事务外处理
      }
    })

    // 在事务外检查段位晋升（避免事务嵌套）
    let rankUp = false
    if (userProfile.currentRankId) {
      const currentSeason = calculateCurrentSeason()
      const userRank = await this.prisma.userRank.findFirst({
        where: {
          userId,
          rankId: userProfile.currentRankId,
          season: currentSeason,
        },
      })

      if (userRank) {
        const rankUpResult = await this.ranksService.checkAndUpgradeRank(
          userId,
          userRank.checkInCount
        )
        rankUp = rankUpResult.upgraded
      }
    }

    // 检查并授予符合条件的勋章（打卡相关）
    // 注意：这里不等待结果，避免影响打卡响应速度
    // 勋章检查在后台异步执行
    this.badgesService.checkAndAwardBadges(userId, 'CHECK_IN').catch((error) => {
      // 记录错误但不影响打卡流程
      console.error('勋章检查失败:', error)
    })

    // 如果等级提升，也检查等级相关勋章
    if (result.levelUp) {
      this.badgesService.checkAndAwardBadges(userId, 'LEVEL').catch((error) => {
        console.error('等级勋章检查失败:', error)
      })
    }

    // 如果段位提升，也检查段位相关勋章
    if (rankUp) {
      this.badgesService.checkAndAwardBadges(userId, 'RANK').catch((error) => {
        console.error('段位勋章检查失败:', error)
      })
    }

    return {
      id: result.checkIn.id,
      pointsEarned,
      expEarned: expEarned,
      consecutiveDays,
      checkInDate: result.checkIn.checkInDate,
      rankUp,
      levelUp: result.levelUp,
    }
  }


  /**
   * 计算连续打卡天数
   * 
   * @description 计算用户连续打卡的天数
   * 
   * @param userId 用户 ID
   * @returns 连续打卡天数
   */
  private async calculateConsecutiveDays(userId: string): Promise<number> {
    // 获取最近的打卡记录
    const recentCheckIns = await this.prisma.checkIn.findMany({
      where: { userId },
      orderBy: { checkInDate: 'desc' },
      take: 30, // 最多检查最近 30 天的记录
    })

    if (recentCheckIns.length === 0) {
      return 1 // 首次打卡
    }

    // 计算连续天数
    let consecutiveDays = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < recentCheckIns.length; i++) {
      const checkInDate = new Date(recentCheckIns[i].checkInDate)
      checkInDate.setHours(0, 0, 0, 0)

      const expectedDate = new Date(today)
      expectedDate.setDate(expectedDate.getDate() - i - 1)

      if (
        checkInDate.getTime() === expectedDate.getTime()
      ) {
        consecutiveDays++
      } else {
        break
      }
    }

    return consecutiveDays
  }

  /**
   * 检查等级提升
   * 
   * @description 检查经验值是否达到升级条件，如果达到则升级
   * 
   * @param tx Prisma 事务
   * @param userId 用户 ID
   * @param totalExp 总经验值
   * @param currentLevel 当前等级
   * @returns 新等级和下一级所需经验值
   */
  private async checkLevelUp(
    tx: any,
    userId: string,
    totalExp: number,
    currentLevel: number
  ): Promise<{ level: number; nextLevelExp: number }> {
    // 动态计算等级（经验值累加不清空）
    let level = currentLevel
    let requiredExp = this.calculateNextLevelExp(level)

    // 如果总经验值达到下一级要求，继续升级
    while (totalExp >= requiredExp) {
      level++
      requiredExp = this.calculateNextLevelExp(level)
    }

    // 如果等级提升，创建经验记录
    if (level > currentLevel) {
      await tx.experience.create({
        data: {
          userId,
          amount: 0, // 升级本身不增加经验值
          type: 'LEVEL_BONUS',
          description: `升级到 ${level} 级`,
        },
      })
    }

    return {
      level,
      nextLevelExp: requiredExp,
    }
  }

  /**
   * 计算下一级所需经验值
   * 
   * @description 根据当前等级计算升到下一级所需的总经验值
   * 
   * @param level 当前等级
   * @returns 下一级所需经验值
   */
  private calculateNextLevelExp(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5))
  }

  /**
   * 获取用户打卡记录
   * 
   * @description 获取用户的打卡历史记录
   * 
   * @param userId 用户 ID
   * @param page 页码（从 1 开始）
   * @param limit 每页数量
   * @returns 打卡记录列表和总数
   */
  async getCheckInHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit

    const [checkIns, total] = await Promise.all([
      this.prisma.checkIn.findMany({
        where: { userId },
        orderBy: { checkInDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.checkIn.count({
        where: { userId },
      }),
    ])

    return {
      data: checkIns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }
}

