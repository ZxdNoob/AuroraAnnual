import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { PointsLeaderboardDto, PointsLeaderboardQueryDto } from './dto/points-leaderboard.dto'
import { PointsStatisticsDto, PointsHistoryDto, PointsHistoryQueryDto } from './dto/points-statistics.dto'

/**
 * 积分服务
 * 
 * @description 处理积分相关的业务逻辑：
 * - 积分排行榜
 * - 积分统计
 * - 积分历史记录查询
 */
@Injectable()
export class PointsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取积分排行榜
   * 
   * @description 按总积分降序排列，返回用户排行榜
   * 
   * @param query 查询参数（页码、每页数量）
   * @returns 积分排行榜数据
   */
  async getLeaderboard(query: PointsLeaderboardQueryDto): Promise<{
    data: PointsLeaderboardDto[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    // 获取总用户数
    const total = await this.prisma.userProfile.count({
      where: {
        totalPoints: {
          gt: 0, // 只统计有积分的用户
        },
      },
    })

    // 获取排行榜数据（按总积分降序）
    const profiles = await this.prisma.userProfile.findMany({
      where: {
        totalPoints: {
          gt: 0,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        currentRank: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        totalPoints: 'desc',
      },
      skip,
      take: limit,
    })

    // 计算排名（考虑分页）
    const data: PointsLeaderboardDto[] = profiles.map((profile, index) => ({
      userId: profile.user.id,
      username: profile.user.username,
      nickname: profile.user.nickname || undefined,
      avatar: profile.user.avatar || undefined,
      totalPoints: profile.totalPoints,
      rank: skip + index + 1, // 排名 = 跳过的数量 + 当前索引 + 1
      currentLevel: profile.currentLevel,
      currentRankName: profile.currentRank?.name,
    }))

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 获取用户积分统计
   * 
   * @description 获取用户的积分统计信息，包括：
   * - 总积分
   * - 今日/本周/本月获得积分
   * - 按类型统计的积分
   * - 积分获取趋势（最近 30 天）
   * 
   * @param userId 用户 ID
   * @returns 积分统计数据
   */
  async getStatistics(userId: string): Promise<PointsStatisticsDto> {
    // 检查用户是否存在
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    })

    if (!userProfile) {
      throw new NotFoundException('用户不存在')
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay()) // 本周一
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // 获取今日积分
    const todayPoints = await this.prisma.point.aggregate({
      where: {
        userId,
        createdAt: {
          gte: today,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // 获取本周积分
    const weekPoints = await this.prisma.point.aggregate({
      where: {
        userId,
        createdAt: {
          gte: weekStart,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // 获取本月积分
    const monthPoints = await this.prisma.point.aggregate({
      where: {
        userId,
        createdAt: {
          gte: monthStart,
        },
      },
      _sum: {
        amount: true,
      },
    })

    // 按类型统计积分
    const pointsByTypeData = await this.prisma.point.groupBy({
      by: ['type'],
      where: {
        userId,
      },
      _sum: {
        amount: true,
      },
    })

    const pointsByType: Record<string, number> = {}
    pointsByTypeData.forEach((item) => {
      pointsByType[item.type] = item._sum.amount || 0
    })

    // 获取最近 30 天的积分趋势
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const pointsTrendData = await this.prisma.point.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    // 按日期聚合数据（每天的总积分）
    const dailyPoints: Record<string, number> = {}
    pointsTrendData.forEach((item) => {
      const date = new Date(item.createdAt)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      dailyPoints[dateStr] = (dailyPoints[dateStr] || 0) + (item._sum.amount || 0)
    })

    // 生成最近 30 天的趋势数据（包括没有积分的天数）
    const pointsTrend: Array<{ date: string; points: number }> = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(now.getDate() - i)
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      pointsTrend.push({
        date: dateStr,
        points: dailyPoints[dateStr] || 0,
      })
    }

    return {
      totalPoints: userProfile.totalPoints,
      todayPoints: todayPoints._sum.amount || 0,
      weekPoints: weekPoints._sum.amount || 0,
      monthPoints: monthPoints._sum.amount || 0,
      pointsByType,
      pointsTrend,
    }
  }

  /**
   * 获取用户积分历史记录
   * 
   * @description 获取用户的积分获取历史记录，支持分页和筛选
   * 
   * @param userId 用户 ID
   * @param query 查询参数（页码、每页数量、类型、日期范围）
   * @returns 积分历史记录
   */
  async getHistory(
    userId: string,
    query: PointsHistoryQueryDto
  ): Promise<{
    data: PointsHistoryDto[]
    total: number
    page: number
    limit: number
    totalPages: number
  }> {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    const page = query.page || 1
    const limit = query.limit || 20
    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      userId,
    }

    // 类型筛选
    if (query.type) {
      where.type = query.type
    }

    // 日期范围筛选
    if (query.startDate || query.endDate) {
      where.createdAt = {}
      if (query.startDate) {
        where.createdAt.gte = new Date(query.startDate)
      }
      if (query.endDate) {
        const endDate = new Date(query.endDate)
        endDate.setHours(23, 59, 59, 999) // 包含结束日期的整天
        where.createdAt.lte = endDate
      }
    }

    // 获取总数
    const total = await this.prisma.point.count({ where })

    // 获取数据
    const points = await this.prisma.point.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const data: PointsHistoryDto[] = points.map((point) => ({
      id: point.id,
      amount: point.amount,
      type: point.type,
      description: point.description || undefined,
      createdAt: point.createdAt,
    }))

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  /**
   * 获取我的积分排名
   * 
   * @description 获取当前用户在积分排行榜中的排名
   * 
   * @param userId 用户 ID
   * @returns 排名信息
   */
  async getMyRank(userId: string): Promise<{
    rank: number
    totalPoints: number
    totalUsers: number
  }> {
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    })

    if (!userProfile) {
      throw new NotFoundException('用户不存在')
    }

    // 计算排名：统计总积分大于当前用户的用户数量
    const rank = await this.prisma.userProfile.count({
      where: {
        totalPoints: {
          gt: userProfile.totalPoints,
        },
      },
    }) + 1

    // 获取总用户数（有积分的用户）
    const totalUsers = await this.prisma.userProfile.count({
      where: {
        totalPoints: {
          gt: 0,
        },
      },
    })

    return {
      rank,
      totalPoints: userProfile.totalPoints,
      totalUsers,
    }
  }
}

