import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { RanksService } from './ranks/ranks.service'
import { BadgesService } from './badges/badges.service'

/**
 * 应用启动函数
 * 
 * @description 初始化 NestJS 应用，配置全局管道、CORS、Swagger 文档等
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局前缀
  app.setGlobalPrefix('api')

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动过滤掉没有装饰器的属性
      forbidNonWhitelisted: true, // 如果存在非白名单属性，抛出错误
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
    })
  )

  // CORS 配置
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })

  // Swagger 文档配置
  const config = new DocumentBuilder()
    .setTitle('全栈学习激励平台 API')
    .setDescription('全栈学习激励平台 API 文档')
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', '认证相关')
    .addTag('users', '用户相关')
    .addTag('checkin', '打卡相关')
    .addTag('points', '积分相关')
    .addTag('ranks', '段位相关')
    .addTag('experience', '经验相关')
    .addTag('badges', '勋章相关')
    .addTag('lottery', '抽奖相关')
    .addTag('code', '在线编码相关')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  // 初始化段位数据
  const ranksService = app.get(RanksService)
  await ranksService.initializeRanks()

  // 初始化勋章数据
  const badgesService = app.get(BadgesService)
  const badgeCount = await badgesService.initializeBadges()
  console.log(`🏅 初始化勋章数据: ${badgeCount} 个勋章`)

  const port = process.env.PORT || 4000
  await app.listen(port)

  console.log(`🚀 应用运行在: http://localhost:${port}`)
  console.log(`📚 API 文档: http://localhost:${port}/api`)
}

bootstrap()

