import { ApiProperty } from '@nestjs/swagger'

/**
 * 打卡响应 DTO
 * 
 * @description 打卡成功后返回的数据结构
 */
export class CheckInResponseDto {
  @ApiProperty({
    description: '打卡记录 ID',
  })
  id: string

  @ApiProperty({
    description: '获得的积分',
    example: 10,
  })
  pointsEarned: number

  @ApiProperty({
    description: '获得的经验值',
    example: 15,
  })
  expEarned: number

  @ApiProperty({
    description: '连续打卡天数',
    example: 5,
  })
  consecutiveDays: number

  @ApiProperty({
    description: '打卡日期',
    example: '2026-01-01T00:00:00.000Z',
  })
  checkInDate: Date

  @ApiProperty({
    description: '是否触发段位晋升',
    example: false,
  })
  rankUp?: boolean

  @ApiProperty({
    description: '是否触发等级提升',
    example: false,
  })
  levelUp?: boolean
}

