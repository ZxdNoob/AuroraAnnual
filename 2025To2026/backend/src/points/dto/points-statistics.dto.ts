import { ApiProperty } from '@nestjs/swagger'

/**
 * 积分统计响应 DTO
 */
export class PointsStatisticsDto {
  @ApiProperty({ description: '总积分' })
  totalPoints: number

  @ApiProperty({ description: '今日获得积分' })
  todayPoints: number

  @ApiProperty({ description: '本周获得积分' })
  weekPoints: number

  @ApiProperty({ description: '本月获得积分' })
  monthPoints: number

  @ApiProperty({ description: '按类型统计的积分', type: 'object' })
  pointsByType: Record<string, number>

  @ApiProperty({ description: '积分获取趋势（最近 30 天）', type: 'array', items: { type: 'object' } })
  pointsTrend: Array<{
    date: string
    points: number
  }>
}

/**
 * 积分历史记录响应 DTO
 */
export class PointsHistoryDto {
  @ApiProperty({ description: '积分记录 ID' })
  id: string

  @ApiProperty({ description: '积分数量' })
  amount: number

  @ApiProperty({ description: '积分类型' })
  type: string

  @ApiProperty({ description: '描述', required: false })
  description?: string

  @ApiProperty({ description: '创建时间' })
  createdAt: Date
}

/**
 * 积分历史查询参数 DTO
 */
export class PointsHistoryQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1, minimum: 1 })
  page?: number = 1

  @ApiProperty({ description: '每页数量', required: false, default: 20, minimum: 1, maximum: 100 })
  limit?: number = 20

  @ApiProperty({ description: '积分类型', required: false })
  type?: string

  @ApiProperty({ description: '开始日期', required: false })
  startDate?: string

  @ApiProperty({ description: '结束日期', required: false })
  endDate?: string
}

