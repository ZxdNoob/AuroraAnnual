import { Module } from '@nestjs/common'
import { RanksController } from './ranks.controller'
import { RanksService } from './ranks.service'
import { PrismaModule } from '../common/prisma/prisma.module'

/**
 * 段位模块
 * 
 * @description 提供段位管理、晋升、降级、赛季管理等功能
 */
@Module({
  imports: [PrismaModule],
  controllers: [RanksController],
  providers: [RanksService],
  exports: [RanksService],
})
export class RanksModule {}

