import { ApiProperty } from '@nestjs/swagger'

/**
 * 勋章响应 DTO
 */
export class BadgeDto {
  @ApiProperty({ description: '勋章 ID' })
  id: string

  @ApiProperty({ description: '勋章名称' })
  name: string

  @ApiProperty({ description: '勋章描述', required: false })
  description?: string

  @ApiProperty({ description: '勋章图标' })
  icon: string

  @ApiProperty({ description: '勋章类型' })
  type: string

  @ApiProperty({ description: '勋章稀有度' })
  rarity: string

  @ApiProperty({ description: '是否已获得', required: false })
  achieved?: boolean

  @ApiProperty({ description: '获得时间', required: false })
  achievedAt?: Date
}

/**
 * 用户勋章响应 DTO
 */
export class UserBadgeDto {
  @ApiProperty({ description: '用户勋章 ID' })
  id: string

  @ApiProperty({ description: '勋章信息' })
  badge: BadgeDto

  @ApiProperty({ description: '获得时间' })
  achievedAt: Date
}

/**
 * 勋章列表查询参数 DTO
 */
export class BadgeListQueryDto {
  @ApiProperty({ description: '勋章类型', required: false })
  type?: string

  @ApiProperty({ description: '勋章稀有度', required: false })
  rarity?: string

  @ApiProperty({ description: '是否只显示已获得的勋章', required: false, default: false })
  achievedOnly?: boolean
}

