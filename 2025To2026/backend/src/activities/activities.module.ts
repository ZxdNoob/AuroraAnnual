import { Module } from '@nestjs/common'
import { ActivitiesController } from './activities.controller'
import { ActivitiesService } from './activities.service'
import { PrismaModule } from '../common/prisma/prisma.module'

/**
 * 活动模块
 * 
 * @description 提供活动相关的功能：
 * - 活动创建和管理（管理员）
 * - 活动时间范围管理
 * - 活动奖励配置
 * - 活动参与记录
 */
@Module({
  imports: [PrismaModule],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}

