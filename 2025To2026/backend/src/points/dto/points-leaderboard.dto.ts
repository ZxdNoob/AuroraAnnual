import { ApiProperty } from '@nestjs/swagger'

/**
 * 积分排行榜响应 DTO
 */
export class PointsLeaderboardDto {
  @ApiProperty({ description: '用户 ID' })
  userId: string

  @ApiProperty({ description: '用户名' })
  username: string

  @ApiProperty({ description: '昵称', required: false })
  nickname?: string

  @ApiProperty({ description: '头像', required: false })
  avatar?: string

  @ApiProperty({ description: '总积分' })
  totalPoints: number

  @ApiProperty({ description: '排名' })
  rank: number

  @ApiProperty({ description: '当前等级' })
  currentLevel: number

  @ApiProperty({ description: '当前段位名称', required: false })
  currentRankName?: string
}

/**
 * 积分排行榜查询参数 DTO
 */
export class PointsLeaderboardQueryDto {
  @ApiProperty({ description: '页码', required: false, default: 1, minimum: 1 })
  page?: number = 1

  @ApiProperty({ description: '每页数量', required: false, default: 20, minimum: 1, maximum: 100 })
  limit?: number = 20
}

