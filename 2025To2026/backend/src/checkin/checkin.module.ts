import { Module } from '@nestjs/common'
import { CheckInController } from './checkin.controller'
import { CheckInService } from './checkin.service'
import { PrismaModule } from '../common/prisma/prisma.module'
import { RanksModule } from '../ranks/ranks.module'
import { BadgesModule } from '../badges/badges.module'

/**
 * 打卡模块
 * 
 * @description 提供用户打卡、积分计算、经验计算等功能
 */
@Module({
  imports: [PrismaModule, RanksModule, BadgesModule],
  controllers: [CheckInController],
  providers: [CheckInService],
  exports: [CheckInService],
})
export class CheckInModule {}

