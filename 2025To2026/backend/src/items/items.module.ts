import { Module } from '@nestjs/common'
import { ItemsController } from './items.controller'
import { ItemsService } from './items.service'
import { PrismaModule } from '../common/prisma/prisma.module'

/**
 * 道具模块
 * 
 * @description 提供道具相关的功能：
 * - 道具数据管理
 * - 道具使用逻辑
 * - 道具效果应用（经验加成、积分加成、段位加成）
 */
@Module({
  imports: [PrismaModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}

