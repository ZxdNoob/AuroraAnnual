import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsObject } from 'class-validator'

/**
 * 创建活动 DTO
 */
export class CreateActivityDto {
  @ApiProperty({ description: '活动名称' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: '活动描述', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: '活动开始时间' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ description: '活动结束时间' })
  @IsDateString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ description: '活动奖励配置', type: 'object' })
  @IsObject()
  @IsNotEmpty()
  rewards: {
    levels?: Array<{
      level: string // 一等奖、二等奖、三等奖等
      count: number // 该等级奖励数量
      prize: {
        type: 'RED_PACKET' | 'ITEM' | 'LIMITED_REWARD'
        value?: number
        itemId?: string
        name: string
      }
    }>
  }
}

/**
 * 更新活动 DTO
 */
export class UpdateActivityDto {
  @ApiProperty({ description: '活动名称', required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ description: '活动描述', required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: '活动开始时间', required: false })
  @IsDateString()
  @IsOptional()
  startTime?: string

  @ApiProperty({ description: '活动结束时间', required: false })
  @IsDateString()
  @IsOptional()
  endTime?: string

  @ApiProperty({ description: '是否激活', required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @ApiProperty({ description: '活动奖励配置', type: 'object', required: false })
  @IsObject()
  @IsOptional()
  rewards?: any
}

/**
 * 参与活动 DTO
 */
export class ParticipateActivityDto {
  @ApiProperty({ description: '活动 ID' })
  @IsString()
  @IsNotEmpty()
  activityId: string
}

/**
 * 活动响应 DTO
 */
export class ActivityDto {
  @ApiProperty({ description: '活动 ID' })
  id: string

  @ApiProperty({ description: '活动名称' })
  name: string

  @ApiProperty({ description: '活动描述', required: false })
  description?: string

  @ApiProperty({ description: '活动开始时间' })
  startTime: Date

  @ApiProperty({ description: '活动结束时间' })
  endTime: Date

  @ApiProperty({ description: '是否激活' })
  isActive: boolean

  @ApiProperty({ description: '活动奖励配置', type: 'object' })
  rewards: any

  @ApiProperty({ description: '创建时间' })
  createdAt: Date

  @ApiProperty({ description: '更新时间' })
  updatedAt: Date
}

/**
 * 活动参与记录响应 DTO
 */
export class ActivityParticipantDto {
  @ApiProperty({ description: '参与记录 ID' })
  id: string

  @ApiProperty({ description: '活动信息' })
  activity: ActivityDto

  @ApiProperty({ description: '奖励等级', required: false })
  rewardLevel?: string

  @ApiProperty({ description: '奖励价值', required: false })
  rewardValue?: number

  @ApiProperty({ description: '参与时间' })
  participatedAt: Date
}

