import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { LotteryService } from './lottery.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { LotteryResponseDto, LotteryHistoryQueryDto, LotteryStatisticsDto } from './dto/lottery.dto'

/**
 * 抽奖控制器
 * 
 * @description 提供抽奖相关的 API 接口
 */
@ApiTags('抽奖相关')
@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  /**
   * 执行抽奖
   * 
   * @description 执行一次抽奖，扣除积分，发放奖品
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @returns 抽奖结果
   */
  @Post('draw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '执行抽奖' })
  @ApiResponse({
    status: 200,
    description: '抽奖成功',
    type: LotteryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '积分不足',
  })
  async draw(@CurrentUser('id') userId: string) {
    return this.lotteryService.draw(userId)
  }

  /**
   * 获取我的抽奖历史记录
   * 
   * @description 获取当前用户的抽奖历史记录
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param query 查询参数
   * @returns 抽奖历史记录
   */
  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的抽奖历史记录' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [LotteryResponseDto],
  })
  async getHistory(
    @CurrentUser('id') userId: string,
    @Query() query: LotteryHistoryQueryDto
  ) {
    return this.lotteryService.getHistory(userId, query)
  }

  /**
   * 获取我的抽奖统计
   * 
   * @description 获取当前用户的抽奖统计信息
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @returns 抽奖统计信息
   */
  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的抽奖统计' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: LotteryStatisticsDto,
  })
  async getStatistics(@CurrentUser('id') userId: string) {
    return this.lotteryService.getStatistics(userId)
  }

  /**
   * 获取所有奖品配置
   * 
   * @description 获取所有可抽取的奖品及其概率信息
   * 
   * @returns 奖品配置列表
   */
  @Get('prizes')
  @ApiOperation({ summary: '获取所有奖品配置' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string' },
          value: { type: 'number' },
          probability: { type: 'number' },
          icon: { type: 'string' },
          description: { type: 'string' },
        },
      },
    },
  })
  async getPrizeConfigs() {
    return this.lotteryService.getPrizeConfigs()
  }
}

