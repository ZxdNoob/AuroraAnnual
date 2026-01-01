import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

/**
 * Prisma 服务
 * 
 * @description 提供数据库连接和操作服务
 * 实现 OnModuleInit 和 OnModuleDestroy 生命周期钩子
 * 确保在应用启动时连接数据库，关闭时断开连接
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * 模块初始化时连接数据库
   * 
   * @description 应用启动时自动调用，建立数据库连接
   */
  async onModuleInit() {
    await this.$connect()
    console.log('✅ 数据库连接成功')
  }

  /**
   * 模块销毁时断开数据库连接
   * 
   * @description 应用关闭时自动调用，断开数据库连接
   */
  async onModuleDestroy() {
    await this.$disconnect()
    console.log('❌ 数据库连接已断开')
  }
}

