import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { ItemsService } from './items.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { ItemDto, UserItemDto, UseItemDto, ItemEffectDto } from './dto/item.dto'

/**
 * 道具控制器
 * 
 * @description 提供道具相关的 API 接口
 */
@ApiTags('道具相关')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  /**
   * 获取所有道具
   * 
   * @description 获取系统中所有可用的道具列表
   * 
   * @returns 道具列表
   */
  @Get()
  @ApiOperation({ summary: '获取所有道具' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [ItemDto],
  })
  async getAllItems() {
    return this.itemsService.getAllItems()
  }

  /**
   * 获取我的道具列表
   * 
   * @description 获取当前用户拥有的道具列表
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param includeUsed 是否包含已使用的道具
   * @returns 用户道具列表
   */
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的道具列表' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [UserItemDto],
  })
  @ApiQuery({ name: 'includeUsed', required: false, type: Boolean })
  async getUserItems(
    @CurrentUser('id') userId: string,
    @Query('includeUsed') includeUsed?: string
  ) {
    return this.itemsService.getUserItems(userId, includeUsed === 'true')
  }

  /**
   * 使用道具
   * 
   * @description 使用一个道具，应用道具效果
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @param useDto 使用道具 DTO
   * @returns 道具效果信息
   */
  @Post('use')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '使用道具' })
  @ApiResponse({
    status: 200,
    description: '使用成功',
    type: ItemEffectDto,
  })
  @ApiResponse({
    status: 404,
    description: '道具不存在或已使用',
  })
  @ApiResponse({
    status: 400,
    description: '道具已过期或数量不足',
  })
  async useItem(
    @CurrentUser('id') userId: string,
    @Body() useDto: UseItemDto
  ) {
    return this.itemsService.useItem(userId, useDto)
  }

  /**
   * 获取我的生效道具效果
   * 
   * @description 获取当前用户所有生效的道具效果
   * 
   * @param userId 当前用户 ID（从 JWT token 中获取）
   * @returns 生效的道具效果列表
   */
  @Get('my/effects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取我的生效道具效果' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: [ItemEffectDto],
  })
  async getActiveEffects(@CurrentUser('id') userId: string) {
    return this.itemsService.getActiveEffects(userId)
  }
}

