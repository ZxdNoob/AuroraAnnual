import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import { UserItemDto, ItemDto, UseItemDto, ItemEffectDto } from './dto/item.dto'

/**
 * 道具服务
 * 
 * @description 处理道具相关的业务逻辑：
 * - 道具数据初始化
 * - 道具使用逻辑
 * - 道具效果应用（经验加成、积分加成、段位加成）
 */
@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 获取所有道具
   * 
   * @returns 道具列表
   */
  async getAllItems(): Promise<ItemDto[]> {
    const items = await this.prisma.item.findMany({
      orderBy: [
        { rarity: 'asc' },
        { name: 'asc' },
      ],
    })

    return items.map((item) => this.mapItemToDto(item))
  }

  /**
   * 获取用户的道具列表
   * 
   * @param userId 用户 ID
   * @param includeUsed 是否包含已使用的道具
   * @returns 用户道具列表
   */
  async getUserItems(userId: string, includeUsed: boolean = false): Promise<UserItemDto[]> {
    const where: any = {
      userId,
    }

    if (!includeUsed) {
      where.isUsed = false
    }

    const userItems = await this.prisma.userItem.findMany({
      where,
      include: {
        item: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return userItems.map((userItem) => this.mapUserItemToDto(userItem))
  }

  /**
   * 使用道具
   * 
   * @param userId 用户 ID
   * @param useDto 使用道具 DTO
   * @returns 道具效果信息
   */
  async useItem(userId: string, useDto: UseItemDto): Promise<ItemEffectDto> {
    // 检查用户道具是否存在
    const userItem = await this.prisma.userItem.findFirst({
      where: {
        id: useDto.userItemId,
        userId,
        isUsed: false,
      },
      include: {
        item: true,
      },
    })

    if (!userItem) {
      throw new NotFoundException('道具不存在或已使用')
    }

    // 检查是否过期
    if (userItem.expiresAt && new Date() > userItem.expiresAt) {
      throw new BadRequestException('道具已过期')
    }

    // 检查数量
    if (userItem.quantity <= 0) {
      throw new BadRequestException('道具数量不足')
    }

    const effect = userItem.item.effect as any
    const now = new Date()

    // 根据道具类型应用效果
    if (userItem.item.type === 'EXP_BOOST') {
      // 经验加成：在用户资料中记录加成效果
      // 这里简化处理，实际应该创建一个效果记录表
      // 暂时在用户资料中记录（可以通过扩展 UserProfile 表或创建新表实现）
    } else if (userItem.item.type === 'POINTS_BOOST') {
      // 积分加成：在用户资料中记录加成效果
    } else if (userItem.item.type === 'RANK_BOOST') {
      // 段位加成：在下次打卡时应用
      // 这里简化处理，实际应该创建一个效果记录表
    }

    // 计算过期时间
    const duration = effect.duration || 1 // 默认 1 天
    const expiresAt = new Date(now)
    expiresAt.setDate(expiresAt.getDate() + duration)

    // 更新用户道具（减少数量或标记为已使用）
    if (userItem.quantity === 1) {
      // 如果只有 1 个，标记为已使用
      await this.prisma.userItem.update({
        where: { id: userItem.id },
        data: {
          isUsed: true,
          usedAt: now,
        },
      })
    } else {
      // 如果多个，减少数量
      await this.prisma.userItem.update({
        where: { id: userItem.id },
        data: {
          quantity: userItem.quantity - 1,
        },
      })
    }

    // 创建效果记录（这里简化处理，实际应该创建效果记录表）
    // 暂时返回效果信息，前端可以根据效果信息在打卡时应用加成

    return {
      type: effect.type || userItem.item.type,
      value: effect.value || 0,
      duration: effect.duration || 1,
      effectiveAt: now,
      expiresAt,
    }
  }

  /**
   * 获取用户的生效道具效果
   * 
   * @param userId 用户 ID
   * @returns 生效的道具效果列表
   */
  async getActiveEffects(userId: string): Promise<ItemEffectDto[]> {
    // 这里简化处理，实际应该从效果记录表中查询
    // 暂时返回空数组，实际实现时需要创建效果记录表
    // 效果记录表应该包含：userId, itemId, effectType, effectValue, effectiveAt, expiresAt
    return []
  }

  /**
   * 将 Prisma Item 模型转换为 DTO
   * 
   * @param item Prisma 模型
   * @returns DTO
   */
  private mapItemToDto(item: any): ItemDto {
    return {
      id: item.id,
      name: item.name,
      description: item.description || undefined,
      type: item.type,
      effect: item.effect,
      icon: item.icon,
      rarity: item.rarity,
    }
  }

  /**
   * 将 Prisma UserItem 模型转换为 DTO
   * 
   * @param userItem Prisma 模型
   * @returns DTO
   */
  private mapUserItemToDto(userItem: any): UserItemDto {
    return {
      id: userItem.id,
      item: this.mapItemToDto(userItem.item),
      quantity: userItem.quantity,
      isUsed: userItem.isUsed,
      usedAt: userItem.usedAt || undefined,
      expiresAt: userItem.expiresAt || undefined,
      createdAt: userItem.createdAt,
    }
  }
}

