import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

/**
 * 用户注册 DTO
 * 
 * @description 用户注册时提交的数据结构
 */
export class RegisterDto {
  @ApiProperty({
    description: '用户邮箱',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string

  @ApiProperty({
    description: '用户名',
    example: 'username',
    minLength: 3,
    maxLength: 20,
  })
  @IsString({ message: '用户名必须是字符串' })
  @MinLength(3, { message: '用户名至少 3 个字符' })
  @MaxLength(20, { message: '用户名最多 20 个字符' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: '用户名只能包含字母、数字和下划线',
  })
  username: string

  @ApiProperty({
    description: '用户密码',
    example: 'password123',
    minLength: 6,
    maxLength: 50,
  })
  @IsString({ message: '密码必须是字符串' })
  @MinLength(6, { message: '密码至少 6 个字符' })
  @MaxLength(50, { message: '密码最多 50 个字符' })
  password: string

  @ApiProperty({
    description: '用户昵称（可选）',
    example: '昵称',
    required: false,
  })
  @IsString({ message: '昵称必须是字符串' })
  @MaxLength(50, { message: '昵称最多 50 个字符' })
  nickname?: string
}

