import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AppService } from './app.service'

/**
 * 应用控制器
 * 
 * @description 提供应用基础信息接口
 */
@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 健康检查接口
   * 
   * @description 用于检查服务是否正常运行
   * @returns 健康状态信息
   */
  @Get()
  @ApiOperation({ summary: '健康检查' })
  getHello(): string {
    return this.appService.getHello()
  }

  /**
   * 应用信息接口
   * 
   * @description 返回应用基本信息
   * @returns 应用信息
   */
  @Get('info')
  @ApiOperation({ summary: '获取应用信息' })
  getInfo() {
    return this.appService.getInfo()
  }
}

