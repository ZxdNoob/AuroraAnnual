import { ApiProperty } from '@nestjs/swagger'

/**
 * 道具响应 DTO
 */
export class ItemDto {
  @ApiProperty({ description: '道具 ID' })
  id: string

  @ApiProperty({ description: '道具名称' })
  name: string

  @ApiProperty({ description: '道具描述', required: false })
  description?: string

  @ApiProperty({ description: '道具类型' })
  type: string

  @ApiProperty({ description: '道具效果', type: 'object' })
  effect: any

  @ApiProperty({ description: '道具图标' })
  icon: string

  @ApiProperty({ description: '道具稀有度' })
  rarity: string
}

/**
 * 用户道具响应 DTO
 */
export class UserItemDto {
  @ApiProperty({ description: '用户道具 ID' })
  id: string

  @ApiProperty({ description: '道具信息' })
  item: ItemDto

  @ApiProperty({ description: '数量' })
  quantity: number

  @ApiProperty({ description: '是否已使用' })
  isUsed: boolean

  @ApiProperty({ description: '使用时间', required: false })
  usedAt?: Date

  @ApiProperty({ description: '过期时间', required: false })
  expiresAt?: Date

  @ApiProperty({ description: '创建时间' })
  createdAt: Date
}

/**
 * 使用道具 DTO
 */
export class UseItemDto {
  @ApiProperty({ description: '用户道具 ID' })
  userItemId: string
}

/**
 * 道具效果响应 DTO
 */
export class ItemEffectDto {
  @ApiProperty({ description: '效果类型' })
  type: string

  @ApiProperty({ description: '效果值' })
  value: number

  @ApiProperty({ description: '持续时间（天）', required: false })
  duration?: number

  @ApiProperty({ description: '生效时间' })
  effectiveAt: Date

  @ApiProperty({ description: '过期时间', required: false })
  expiresAt?: Date
}

