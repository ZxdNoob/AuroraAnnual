import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { BadgesService } from './badges.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { BadgeDto, UserBadgeDto, BadgeListQueryDto } from './dto/badge.dto'

/**
 * 勋章控制器
 * 
 * @description 提供勋章相关的 API 接口
 */
@ApiTags('勋章相关')
@Controller('badges')
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}

  /**
   * 初始化勋章数据（管理员）
   * 
   * @description 将预定义的勋章数据写入数据库
   * 
   * @returns 创建的勋章数量
   */
  @Get('initialize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '初始化勋章数据（仅管理员）' })
  @ApiResponse({
    status: 200,
    description: '初始化成功',
    schema: {
      type: 'object',
      properties: {
        createdCount: { type: 'number', description: '创建的勋章数量' },
      },
    },
  })
  async initializeBadges() {
    const createdCount = await this.badgesService.initializeBadges()
    return { createdCount }
  }

  /**
   * 获取所有勋章列表
   * 
   * @description 获取所有可获得的勋章列表，如果提供了用户 ID，会标记已获得的勋章
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取，可选）
   * @param query 查询参数
   * @returns 勋章列表
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有勋章列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [BadgeDto],
  })
  async getAllBadges(
    @CurrentUser('id') userId: string,
    @Query() query: BadgeListQueryDto
  ) {
    return this.badgesService.getAllBadges(userId, query)
  }

  /**
   * 获取我的勋章列表
   * 
   * @description 获取当前用户已获得的勋章列表
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param query 查询参数
   * @returns 用户勋章列表
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的勋章列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [UserBadgeDto],
  })
  async getUserBadges(
    @CurrentUser('id') userId: string,
    @Query() query: BadgeListQueryDto
  ) {
    return this.badgesService.getUserBadges(userId, query)
  }

  /**
   * 获取我的勋章统计
   * 
   * @description 获取当前用户的勋章统计信息
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @returns 勋章统计信息
   */
  @Get('my/statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的勋章统计' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', description: '总勋章数' },
        achieved: { type: 'number', description: '已获得勋章数' },
        byType: { type: 'object', description: '按类型统计' },
        byRarity: { type: 'object', description: '按稀有度统计' },
      },
    },
  })
  async getUserBadgeStatistics(@CurrentUser('id') userId: string) {
    return this.badgesService.getUserBadgeStatistics(userId)
  }

  /**
   * 检查并授予符合条件的勋章
   * 
   * @description 手动触发勋章检查，检查用户是否满足某些勋章的获取条件
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param badgeType 要检查的勋章类型（可选）
   * @returns 新获得的勋章列表
   */
  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '检查并授予符合条件的勋章' })
  @ApiResponse({
    status: 200,
    description: '检查完成',
    type: [BadgeDto],
  })
  async checkAndAwardBadges(
    @CurrentUser('id') userId: string,
    @Query('type') badgeType?: string
  ) {
    return this.badgesService.checkAndAwardBadges(userId, badgeType)
  }
}

