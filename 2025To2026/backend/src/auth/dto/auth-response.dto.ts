import { ApiProperty } from '@nestjs/swagger'

/**
 * 认证响应 DTO
 * 
 * @description 登录成功后返回的数据结构
 */
export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT Token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: '用户信息',
  })
  user: {
    id: string
    email: string
    username: string
    nickname?: string
    avatar?: string
    role: string
  }
}

