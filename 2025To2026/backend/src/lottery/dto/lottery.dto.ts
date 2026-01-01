import { ApiProperty } from '@nestjs/swagger'

/**
 * 抽奖响应 DTO
 */
export class LotteryResponseDto {
  @ApiProperty({ description: '抽奖记录 ID' })
  id: string

  @ApiProperty({ description: '奖品类型' })
  prizeType: string

  @ApiProperty({ description: '奖品 ID', required: false })
  prizeId?: string

  @ApiProperty({ description: '奖品名称' })
  prizeName: string

  @ApiProperty({ description: '奖品价值', required: false })
  prizeValue?: number

  @ApiProperty({ description: '消耗的积分' })
  cost: number

  @ApiProperty({ description: '抽奖时间' })
  createdAt: Date
}

/**
 * 抽奖历史查询参数 DTO
 */
export class LotteryHistoryQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1, minimum: 1 })
  page?: number = 1

  @ApiProperty({ description: '每页数量', required: false, default: 20, minimum: 1, maximum: 100 })
  limit?: number = 20

  @ApiProperty({ description: '奖品类型', required: false })
  prizeType?: string
}

/**
 * 抽奖统计响应 DTO
 */
export class LotteryStatisticsDto {
  @ApiProperty({ description: '总抽奖次数' })
  totalDraws: number

  @ApiProperty({ description: '总消耗积分' })
  totalCost: number

  @ApiProperty({ description: '总获得价值' })
  totalValue: number

  @ApiProperty({ description: '按类型统计', type: 'object' })
  byType: Record<string, number>

  @ApiProperty({ description: '最近抽奖记录', type: 'array', items: { type: 'object' } })
  recentDraws: Array<{
    prizeName: string
    prizeType: string
    prizeValue?: number
    createdAt: Date
  }>
}

