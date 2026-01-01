import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './common/prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { CheckInModule } from './checkin/checkin.module'
import { RanksModule } from './ranks/ranks.module'
import { PointsModule } from './points/points.module'
import { BadgesModule } from './badges/badges.module'
import { LotteryModule } from './lottery/lottery.module'
import { CodeModule } from './code/code.module'
import { ActivitiesModule } from './activities/activities.module'
import { ItemsModule } from './items/items.module'

/**
 * 应用根模块
 * 
 * @description 配置全局模块、导入功能模块、配置全局守卫等
 */
@Module({
  imports: [
    // 配置模块（全局）
    ConfigModule.forRoot({
      isGlobal: true, // 全局可用
      envFilePath: ['.env', '.env.local'],
    }),
    // Prisma 模块（全局）
    PrismaModule,
    // 认证模块
    AuthModule,
    // 打卡模块
    CheckInModule,
    // 段位模块
    RanksModule,
    // 积分模块
    PointsModule,
    // 勋章模块
    BadgesModule,
    // 抽奖模块
    LotteryModule,
    // 在线编码模块
    CodeModule,
    // 活动模块
    ActivitiesModule,
    // 道具模块
    ItemsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局守卫可以在这里配置
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class AppModule {}

