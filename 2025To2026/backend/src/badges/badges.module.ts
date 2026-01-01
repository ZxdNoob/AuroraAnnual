import { Module } from '@nestjs/common'
import { BadgesController } from './badges.controller'
import { BadgesService } from './badges.service'
import { PrismaModule } from '../common/prisma/prisma.module'

/**
 * 勋章模块
 * 
 * @description 提供勋章相关的功能：
 * - 勋章数据初始化
 * - 勋章获取条件检查
 * - 用户勋章展示
 * - 自动授予勋章
 */
@Module({
  imports: [PrismaModule],
  controllers: [BadgesController],
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}

