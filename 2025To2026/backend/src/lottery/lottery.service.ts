import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { drawPrize, LOTTERY_COST, PRIZE_CONFIGS } from './utils/prize-data'
import { LotteryResponseDto, LotteryHistoryQueryDto, LotteryStatisticsDto } from './dto/lottery.dto'

/**
 * 抽奖服务
 * 
 * @description 处理抽奖相关的业务逻辑：
 * - 抽奖算法实现
 * - 奖品发放
 * - 积分扣除
 * - 抽奖记录管理
 */
@Injectable()
export class LotteryService {
  constructor(private prisma: PrismaService) {}

  /**
   * 执行抽奖
   * 
   * @description 执行一次抽奖，扣除积分，发放奖品
   * 
   * @param userId 用户 ID
   * @returns 抽奖结果
   * @throws BadRequestException 如果积分不足
   */
  async draw(userId: string): Promise<LotteryResponseDto> {
    // 检查用户是否存在
    const userProfile = await this.prisma.userProfile.findUnique({
      where: { userId },
    })

    if (!userProfile) {
      throw new NotFoundException('用户不存在')
    }

    // 检查积分是否足够
    if (userProfile.totalPoints < LOTTERY_COST) {
      throw new BadRequestException(`积分不足，抽奖需要 ${LOTTERY_COST} 积分`)
    }

    // 使用事务处理抽奖流程
    const result = await this.prisma.$transaction(async (tx) => {
      // 扣除积分
      const newTotalPoints = userProfile.totalPoints - LOTTERY_COST
      await tx.userProfile.update({
        where: { userId },
        data: { totalPoints: newTotalPoints },
      })

      // 记录积分消费
      await tx.point.create({
        data: {
          userId,
          amount: -LOTTERY_COST,
          type: 'CONSUME',
          description: `抽奖消耗 ${LOTTERY_COST} 积分`,
        },
      })

      // 抽取奖品
      const prize = drawPrize()

      // 处理不同类型的奖品
      let prizeId: string | undefined
      let prizeValue: number | undefined = prize.value

      if (prize.type === 'RED_PACKET') {
        // 红包：直接发放积分
        const redPacketValue = prize.value || 0
        await tx.userProfile.update({
          where: { userId },
          data: { totalPoints: newTotalPoints + redPacketValue },
        })

        // 记录积分获得
        await tx.point.create({
          data: {
            userId,
            amount: redPacketValue,
            type: 'LOTTERY',
            description: `抽奖获得红包：${prize.name}`,
          },
        })

        prizeValue = redPacketValue
      } else if (prize.type === 'ITEM') {
        // 道具：需要查找或创建道具
        let item = await tx.item.findUnique({
          where: { name: prize.name },
        })

        if (!item) {
          // 如果道具不存在，创建它
          // 根据奖品 ID 判断道具类型
          let itemType: 'EXP_BOOST' | 'POINTS_BOOST' | 'RANK_BOOST' = 'EXP_BOOST'
          if (prize.id.includes('exp-boost')) {
            itemType = 'EXP_BOOST'
          } else if (prize.id.includes('points-boost')) {
            itemType = 'POINTS_BOOST'
          } else if (prize.id.includes('rank-boost')) {
            itemType = 'RANK_BOOST'
          }

          item = await tx.item.create({
            data: {
              name: prize.name,
              description: prize.description || '',
              type: itemType,
              effect: {
                type: itemType,
                value: prize.value || 0,
                duration: prize.id.includes('3d') ? 3 : 1, // 天数
              },
              icon: prize.icon,
              rarity: 'COMMON',
            },
          })
        }

        prizeId = item.id

        // 发放道具到用户背包
        const existingUserItem = await tx.userItem.findFirst({
          where: {
            userId,
            itemId: item.id,
            isUsed: false,
          },
        })

        if (existingUserItem) {
          // 如果已有未使用的道具，增加数量
          await tx.userItem.update({
            where: { id: existingUserItem.id },
            data: { quantity: existingUserItem.quantity + 1 },
          })
        } else {
          // 创建新的用户道具记录
          const expiresAt = new Date()
          expiresAt.setDate(expiresAt.getDate() + (prize.id.includes('3d') ? 3 : 1))
          
          await tx.userItem.create({
            data: {
              userId,
              itemId: item.id,
              quantity: 1,
              expiresAt,
            },
          })
        }
      } else if (prize.type === 'LIMITED_REWARD') {
        // 限定奖励：记录到用户资料或特殊表
        // 这里简化处理，只记录抽奖记录
        prizeId = prize.id
      }

      // 创建抽奖记录
      const lottery = await tx.lottery.create({
        data: {
          userId,
          prizeType: prize.type,
          prizeId,
          prizeName: prize.name,
          prizeValue,
          cost: LOTTERY_COST,
        },
      })

      return lottery
    })

    return {
      id: result.id,
      prizeType: result.prizeType,
      prizeId: result.prizeId || undefined,
      prizeName: result.prizeName,
      prizeValue: result.prizeValue || undefined,
      cost: result.cost,
      createdAt: result.createdAt,
    }
  }

  /**
   * 获取用户的抽奖历史记录
   * 
   * @param userId 用户 ID
   * @param query 查询参数
   * @returns 抽奖历史记录
   */
  async getHistory(
    userId: string,
    query: LotteryHistoryQueryDto
  ): Promise<{
    data: LotteryResponseDto[]
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
    if (query.prizeType) {
      where.prizeType = query.prizeType
    }

    // 获取总数
    const total = await this.prisma.lottery.count({ where })

    // 获取数据
    const lotteries = await this.prisma.lottery.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const data: LotteryResponseDto[] = lotteries.map((lottery) => ({
      id: lottery.id,
      prizeType: lottery.prizeType,
      prizeId: lottery.prizeId || undefined,
      prizeName: lottery.prizeName,
      prizeValue: lottery.prizeValue || undefined,
      cost: lottery.cost,
      createdAt: lottery.createdAt,
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
   * 获取用户的抽奖统计
   * 
   * @param userId 用户 ID
   * @returns 抽奖统计信息
   */
  async getStatistics(userId: string): Promise<LotteryStatisticsDto> {
    // 检查用户是否存在
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException('用户不存在')
    }

    // 获取所有抽奖记录
    const lotteries = await this.prisma.lottery.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    // 计算统计数据
    const totalDraws = lotteries.length
    const totalCost = lotteries.reduce((sum, l) => sum + l.cost, 0)
    const totalValue = lotteries.reduce((sum, l) => sum + (l.prizeValue || 0), 0)

    // 按类型统计
    const byType: Record<string, number> = {}
    lotteries.forEach((lottery) => {
      byType[lottery.prizeType] = (byType[lottery.prizeType] || 0) + 1
    })

    // 最近 10 次抽奖记录
    const recentDraws = lotteries.slice(0, 10).map((lottery) => ({
      prizeName: lottery.prizeName,
      prizeType: lottery.prizeType,
      prizeValue: lottery.prizeValue || undefined,
      createdAt: lottery.createdAt,
    }))

    return {
      totalDraws,
      totalCost,
      totalValue,
      byType,
      recentDraws,
    }
  }

  /**
   * 获取所有奖品配置
   * 
   * @description 获取所有可抽取的奖品及其概率信息
   * 
   * @returns 奖品配置列表（包含概率信息）
   */
  async getPrizeConfigs(): Promise<Array<{
    id: string
    name: string
    type: string
    value?: number
    probability: number // 概率（百分比）
    icon: string
    description?: string
  }>> {
    const totalWeight = PRIZE_CONFIGS.reduce((sum, p) => sum + p.weight, 0)

    return PRIZE_CONFIGS.map((prize) => ({
      id: prize.id,
      name: prize.name,
      type: prize.type,
      value: prize.value,
      probability: Number(((prize.weight / totalWeight) * 100).toFixed(2)),
      icon: prize.icon,
      description: prize.description,
    }))
  }
}

