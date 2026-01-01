import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
import {
  CreateActivityDto,
  UpdateActivityDto,
  ParticipateActivityDto,
  ActivityDto,
  ActivityParticipantDto,
} from './dto/activity.dto'

/**
 * 活动服务
 * 
 * @description 处理活动相关的业务逻辑：
 * - 活动创建和管理
 * - 活动时间范围管理
 * - 活动奖励配置
 * - 活动参与记录
 */
@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 创建活动（仅管理员）
   * 
   * @param createDto 创建活动 DTO
   * @returns 创建的活动信息
   */
  async createActivity(createDto: CreateActivityDto): Promise<ActivityDto> {
    // 验证时间范围
    const startTime = new Date(createDto.startTime)
    const endTime = new Date(createDto.endTime)

    if (startTime >= endTime) {
      throw new BadRequestException('活动开始时间必须早于结束时间')
    }

    // 创建活动
    const activity = await this.prisma.activity.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        startTime,
        endTime,
        isActive: true,
        rewards: createDto.rewards as any,
      },
    })

    return this.mapToDto(activity)
  }

  /**
   * 获取所有活动
   * 
   * @param includeInactive 是否包含未激活的活动
   * @returns 活动列表
   */
  async getAllActivities(includeInactive: boolean = false): Promise<ActivityDto[]> {
    const where: any = {}
    if (!includeInactive) {
      where.isActive = true
    }

    const activities = await this.prisma.activity.findMany({
      where,
      orderBy: {
        startTime: 'desc',
      },
    })

    return activities.map((activity) => this.mapToDto(activity))
  }

  /**
   * 获取当前进行中的活动
   * 
   * @returns 进行中的活动列表
   */
  async getActiveActivities(): Promise<ActivityDto[]> {
    const now = new Date()

    const activities = await this.prisma.activity.findMany({
      where: {
        isActive: true,
        startTime: {
          lte: now,
        },
        endTime: {
          gte: now,
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    })

    return activities.map((activity) => this.mapToDto(activity))
  }

  /**
   * 获取活动详情
   * 
   * @param activityId 活动 ID
   * @returns 活动信息
   */
  async getActivity(activityId: string): Promise<ActivityDto> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity) {
      throw new NotFoundException('活动不存在')
    }

    return this.mapToDto(activity)
  }

  /**
   * 更新活动（仅管理员）
   * 
   * @param activityId 活动 ID
   * @param updateDto 更新活动 DTO
   * @returns 更新后的活动信息
   */
  async updateActivity(
    activityId: string,
    updateDto: UpdateActivityDto
  ): Promise<ActivityDto> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity) {
      throw new NotFoundException('活动不存在')
    }

    // 验证时间范围（如果更新了时间）
    if (updateDto.startTime || updateDto.endTime) {
      const startTime = updateDto.startTime ? new Date(updateDto.startTime) : activity.startTime
      const endTime = updateDto.endTime ? new Date(updateDto.endTime) : activity.endTime

      if (startTime >= endTime) {
        throw new BadRequestException('活动开始时间必须早于结束时间')
      }
    }

    // 更新活动
    const updated = await this.prisma.activity.update({
      where: { id: activityId },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        startTime: updateDto.startTime ? new Date(updateDto.startTime) : undefined,
        endTime: updateDto.endTime ? new Date(updateDto.endTime) : undefined,
        isActive: updateDto.isActive,
        rewards: updateDto.rewards as any,
      },
    })

    return this.mapToDto(updated)
  }

  /**
   * 删除活动（仅管理员）
   * 
   * @param activityId 活动 ID
   */
  async deleteActivity(activityId: string): Promise<void> {
    const activity = await this.prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity) {
      throw new NotFoundException('活动不存在')
    }

    await this.prisma.activity.delete({
      where: { id: activityId },
    })
  }

  /**
   * 参与活动
   * 
   * @param userId 用户 ID
   * @param participateDto 参与活动 DTO
   * @returns 参与记录和奖励信息
   */
  async participateActivity(
    userId: string,
    participateDto: ParticipateActivityDto
  ): Promise<ActivityParticipantDto> {
    // 检查活动是否存在
    const activity = await this.prisma.activity.findUnique({
      where: { id: participateDto.activityId },
    })

    if (!activity) {
      throw new NotFoundException('活动不存在')
    }

    // 检查活动是否激活
    if (!activity.isActive) {
      throw new BadRequestException('活动未激活')
    }

    // 检查活动时间
    const now = new Date()
    if (now < activity.startTime) {
      throw new BadRequestException('活动尚未开始')
    }

    if (now > activity.endTime) {
      throw new BadRequestException('活动已结束')
    }

    // 检查是否已参与
    const existing = await this.prisma.activityParticipant.findUnique({
      where: {
        userId_activityId: {
          userId,
          activityId: participateDto.activityId,
        },
      },
    })

    if (existing) {
      throw new BadRequestException('您已参与过此活动')
    }

    // 分配奖励（根据奖励配置）
    const rewards = activity.rewards as any
    let rewardLevel: string | undefined
    let rewardValue: number | undefined

    if (rewards?.levels && rewards.levels.length > 0) {
      // 简化处理：随机分配一个奖励等级
      // 实际应该根据活动规则分配（如抽奖、排名等）
      const randomLevel = rewards.levels[Math.floor(Math.random() * rewards.levels.length)]
      rewardLevel = randomLevel.level
      rewardValue = randomLevel.prize.value
    }

    // 创建参与记录
    const participant = await this.prisma.activityParticipant.create({
      data: {
        userId,
        activityId: participateDto.activityId,
        rewardLevel,
        rewardValue,
      },
      include: {
        activity: true,
      },
    })

    // 如果获得了奖励，发放奖励
    if (rewardLevel && rewards?.levels) {
      const levelConfig = rewards.levels.find((l: any) => l.level === rewardLevel)
      if (levelConfig) {
        await this.distributeReward(userId, levelConfig.prize)
      }
    }

    return {
      id: participant.id,
      activity: this.mapToDto(participant.activity),
      rewardLevel: participant.rewardLevel || undefined,
      rewardValue: participant.rewardValue || undefined,
      participatedAt: participant.participatedAt,
    }
  }

  /**
   * 获取用户的参与记录
   * 
   * @param userId 用户 ID
   * @returns 参与记录列表
   */
  async getUserParticipations(userId: string): Promise<ActivityParticipantDto[]> {
    const participants = await this.prisma.activityParticipant.findMany({
      where: { userId },
      include: {
        activity: true,
      },
      orderBy: {
        participatedAt: 'desc',
      },
    })

    return participants.map((participant) => ({
      id: participant.id,
      activity: this.mapToDto(participant.activity),
      rewardLevel: participant.rewardLevel || undefined,
      rewardValue: participant.rewardValue || undefined,
      participatedAt: participant.participatedAt,
    }))
  }

  /**
   * 发放奖励
   * 
   * @param userId 用户 ID
   * @param prize 奖品配置
   */
  private async distributeReward(userId: string, prize: any): Promise<void> {
    if (prize.type === 'RED_PACKET' && prize.value) {
      // 发放红包（积分）
      await this.prisma.userProfile.update({
        where: { userId },
        data: {
          totalPoints: {
            increment: prize.value,
          },
        },
      })

      await this.prisma.point.create({
        data: {
          userId,
          amount: prize.value,
          type: 'ACTIVITY',
          description: `活动奖励：${prize.name}`,
        },
      })
    } else if (prize.type === 'ITEM' && prize.itemId) {
      // 发放道具
      const existingItem = await this.prisma.userItem.findFirst({
        where: {
          userId,
          itemId: prize.itemId,
          isUsed: false,
        },
      })

      if (existingItem) {
        await this.prisma.userItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + 1 },
        })
      } else {
        await this.prisma.userItem.create({
          data: {
            userId,
            itemId: prize.itemId,
            quantity: 1,
          },
        })
      }
    }
    // LIMITED_REWARD 类型需要特殊处理，这里简化处理
  }

  /**
   * 将 Prisma 模型转换为 DTO
   * 
   * @param activity Prisma 模型
   * @returns DTO
   */
  private mapToDto(activity: any): ActivityDto {
    return {
      id: activity.id,
      name: activity.name,
      description: activity.description || undefined,
      startTime: activity.startTime,
      endTime: activity.endTime,
      isActive: activity.isActive,
      rewards: activity.rewards,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
    }
  }
}

