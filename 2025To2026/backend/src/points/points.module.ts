import { Module } from '@nestjs/common'
import { PointsController } from './points.controller'
import { PointsService } from './points.service'
import { PrismaModule } from '../common/prisma/prisma.module'

/**
 * 积分模块
 * 
 * @description 提供积分相关的功能：
 * - 积分排行榜
 * - 积分统计
 * - 积分历史记录查询
 */
@Module({
  imports: [PrismaModule],
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}

