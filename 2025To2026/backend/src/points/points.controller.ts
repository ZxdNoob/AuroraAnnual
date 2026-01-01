import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { PointsService } from './points.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { PointsLeaderboardQueryDto, PointsLeaderboardDto } from './dto/points-leaderboard.dto'
import { PointsStatisticsDto, PointsHistoryQueryDto, PointsHistoryDto } from './dto/points-statistics.dto'

/**
 * 积分控制器
 * 
 * @description 提供积分相关的 API 接口
 */
@ApiTags('积分相关')
@Controller('points')
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /**
   * 获取积分排行榜
   * 
   * @description 获取积分排行榜，按总积分降序排列
   * 
   * @param query 查询参数
   * @returns 积分排行榜数据
   */
  @Get('leaderboard')
  @ApiOperation({ summary: '获取积分排行榜' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [PointsLeaderboardDto],
  })
  async getLeaderboard(
    @Query() query: PointsLeaderboardQueryDto
  ) {
    return this.pointsService.getLeaderboard(query)
  }

  /**
   * 获取我的积分统计
   * 
   * @description 获取当前用户的积分统计信息
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @returns 积分统计数据
   */
  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的积分统计' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: PointsStatisticsDto,
  })
  async getStatistics(@CurrentUser('id') userId: string) {
    return this.pointsService.getStatistics(userId)
  }

  /**
   * 获取我的积分历史记录
   * 
   * @description 获取当前用户的积分获取历史记录
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param query 查询参数
   * @returns 积分历史记录
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的积分历史记录' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [PointsHistoryDto],
  })
  async getHistory(
    @CurrentUser('id') userId: string,
    @Query() query: PointsHistoryQueryDto
  ) {
    return this.pointsService.getHistory(userId, query)
  }

  /**
   * 获取我的积分排名
   * 
   * @description 获取当前用户在积分排行榜中的排名
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @returns 排名信息
   */
  @Get('my-rank')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的积分排名' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        rank: { type: 'number', description: '排名' },
        totalPoints: { type: 'number', description: '总积分' },
        totalUsers: { type: 'number', description: '总用户数' },
      },
    },
  })
  async getMyRank(@CurrentUser('id') userId: string) {
    return this.pointsService.getMyRank(userId)
  }
}

