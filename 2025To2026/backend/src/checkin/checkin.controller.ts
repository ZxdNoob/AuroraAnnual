import {
  Controller,
  Post,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CheckInService } from './checkin.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { CheckInResponseDto } from './dto/checkin-response.dto'

/**
 * 打卡控制器
 * 
 * @description 处理用户打卡相关接口
 */
@ApiTags('checkin')
@Controller('checkin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckInController {
  constructor(private readonly checkInService: CheckInService) {}

  /**
   * 用户打卡
   * 
   * @description 用户进行打卡操作
   * @param user 当前登录用户（从 JWT Token 中提取）
   * @returns 打卡响应数据
   */
  @Post()
  @ApiOperation({ summary: '用户打卡' })
  @ApiResponse({
    status: 201,
    description: '打卡成功',
    type: CheckInResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '今日已打卡',
  })
  async checkIn(@CurrentUser() user: any): Promise<CheckInResponseDto> {
    return this.checkInService.checkIn(user.userId)
  }

  /**
   * 获取打卡记录
   * 
   * @description 获取用户的打卡历史记录
   * @param user 当前登录用户
   * @param page 页码
   * @param limit 每页数量
   * @returns 打卡记录列表
   */
  @Get('history')
  @ApiOperation({ summary: '获取打卡记录' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
  })
  async getCheckInHistory(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1
    const limitNum = limit ? parseInt(limit, 10) : 20

    return this.checkInService.getCheckInHistory(user.userId, pageNum, limitNum)
  }
}

