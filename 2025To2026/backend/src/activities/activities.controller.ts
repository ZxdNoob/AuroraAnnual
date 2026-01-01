import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger'
import { ActivitiesService } from './activities.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../common/guards/roles.guard'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import {
  CreateActivityDto,
  UpdateActivityDto,
  ParticipateActivityDto,
  ActivityDto,
  ActivityParticipantDto,
} from './dto/activity.dto'

/**
 * 活动控制器
 * 
 * @description 提供活动相关的 API 接口
 */
@ApiTags('活动相关')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  /**
   * 创建活动（仅管理员）
   * 
   * @param createDto 创建活动 DTO
   * @returns 创建的活动信息
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建活动（仅管理员）' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    type: ActivityDto,
  })
  async createActivity(@Body() createDto: CreateActivityDto) {
    return this.activitiesService.createActivity(createDto)
  }

  /**
   * 获取所有活动
   * 
   * @param includeInactive 是否包含未激活的活动
   * @returns 活动列表
   */
  @Get()
  @ApiOperation({ summary: '获取所有活动' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [ActivityDto],
  })
  async getAllActivities(@Query('includeInactive') includeInactive?: string) {
    return this.activitiesService.getAllActivities(includeInactive === 'true')
  }

  /**
   * 获取当前进行中的活动
   * 
   * @returns 进行中的活动列表
   */
  @Get('active')
  @ApiOperation({ summary: '获取当前进行中的活动' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [ActivityDto],
  })
  async getActiveActivities() {
    return this.activitiesService.getActiveActivities()
  }

  /**
   * 获取活动详情
   * 
   * @param activityId 活动 ID
   * @returns 活动信息
   */
  @Get(':activityId')
  @ApiOperation({ summary: '获取活动详情' })
  @ApiParam({ name: 'activityId', description: '活动 ID' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: ActivityDto,
  })
  @ApiResponse({
    status: 404,
    description: '活动不存在',
  })
  async getActivity(@Param('activityId') activityId: string) {
    return this.activitiesService.getActivity(activityId)
  }

  /**
   * 更新活动（仅管理员）
   * 
   * @param activityId 活动 ID
   * @param updateDto 更新活动 DTO
   * @returns 更新后的活动信息
   */
  @Put(':activityId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新活动（仅管理员）' })
  @ApiParam({ name: 'activityId', description: '活动 ID' })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: ActivityDto,
  })
  async updateActivity(
    @Param('activityId') activityId: string,
    @Body() updateDto: UpdateActivityDto
  ) {
    return this.activitiesService.updateActivity(activityId, updateDto)
  }

  /**
   * 删除活动（仅管理员）
   * 
   * @param activityId 活动 ID
   */
  @Delete(':activityId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除活动（仅管理员）' })
  @ApiParam({ name: 'activityId', description: '活动 ID' })
  @ApiResponse({
    status: 204,
    description: '删除成功',
  })
  async deleteActivity(@Param('activityId') activityId: string) {
    await this.activitiesService.deleteActivity(activityId)
  }

  /**
   * 参与活动
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param participateDto 参与活动 DTO
   * @returns 参与记录和奖励信息
   */
  @Post('participate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '参与活动' })
  @ApiResponse({
    status: 201,
    description: '参与成功',
    type: ActivityParticipantDto,
  })
  @ApiResponse({
    status: 400,
    description: '活动未开始、已结束或已参与',
  })
  async participateActivity(
    @CurrentUser('id') userId: string,
    @Body() participateDto: ParticipateActivityDto
  ) {
    return this.activitiesService.participateActivity(userId, participateDto)
  }

  /**
   * 获取我的参与记录
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @returns 参与记录列表
   */
  @Get('my/participations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的参与记录' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [ActivityParticipantDto],
  })
  async getUserParticipations(@CurrentUser('id') userId: string) {
    return this.activitiesService.getUserParticipations(userId)
  }
}

