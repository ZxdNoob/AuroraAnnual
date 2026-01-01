import { IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 用户登录 DTO
 * 
 * @description 用户登录时提交的数据结构
 */
export class LoginDto {
  @ApiProperty({
    description: '用户名或邮箱',
    example: 'username',
  })
  @IsString({ message: '用户名或邮箱必须是字符串' })
  @IsNotEmpty({ message: '用户名或邮箱不能为空' })
  usernameOrEmail: string

  @ApiProperty({
    description: '用户密码',
    example: 'password123',
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}

