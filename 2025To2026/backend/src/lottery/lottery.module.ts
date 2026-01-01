import { Module } from '@nestjs/common'
import { LotteryController } from './lottery.controller'
import { LotteryService } from './lottery.service'
import { PrismaModule } from '../common/prisma/prisma.module'

/**
 * 抽奖模块
 * 
 * @description 提供抽奖相关的功能：
 * - 抽奖算法实现
 * - 奖品配置管理
 * - 抽奖记录管理
 * - 抽奖统计
 */
@Module({
  imports: [PrismaModule],
  controllers: [LotteryController],
  providers: [LotteryService],
  exports: [LotteryService],
})
export class LotteryModule {}

