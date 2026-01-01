import { Controller, Get, UseGuards, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { RanksService } from './ranks.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'

/**
 * 段位控制器
 * 
 * @description 处理段位相关的 API 接口
 */
@ApiTags('ranks')
@Controller('ranks')
export class RanksController {
  constructor(private readonly ranksService: RanksService) {}

  /**
   * 获取用户当前段位信息
   * 
   * @description 获取当前登录用户的段位信息
   * @param user 当前登录用户
   * @returns 用户段位信息
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的段位信息' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  async getMyRank(@CurrentUser() user: any) {
    return this.ranksService.getUserRank(user.userId)
  }

  /**
   * 获取段位排行榜
   * 
   * @description 获取当前赛季的段位排行榜
   * @param limit 返回数量限制
   * @returns 段位排行榜
   */
  @Get('leaderboard')
  @ApiOperation({ summary: '获取段位排行榜' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  async getLeaderboard(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100
    return this.ranksService.getRankLeaderboard(limitNum)
  }
}

