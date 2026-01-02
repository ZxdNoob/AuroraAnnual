import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

/**
 * 用户控制器
 * 
 * @description 处理用户相关的 API 接口
 */
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 获取当前用户信息
   * 
   * @description 获取当前登录用户的基本信息
   * @param user 当前登录用户（从 JWT Token 中提取）
   * @returns 用户信息
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.getUserById(user.userId)
  }

  /**
   * 获取当前用户资料
   * 
   * @description 获取当前登录用户的详细资料
   * @param user 当前登录用户（从 JWT Token 中提取）
   * @returns 用户资料
   */
  @Get('me/profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取当前用户资料' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  async getCurrentUserProfile(@CurrentUser() user: any) {
    return this.usersService.getUserProfile(user.userId)
  }
}

