import { Injectable } from '@nestjs/common'

/**
 * 应用服务
 * 
 * @description 提供应用基础服务方法
 */
@Injectable()
export class AppService {
  /**
   * 获取欢迎信息
   * 
   * @returns 欢迎信息
   */
  getHello(): string {
    return '全栈学习激励平台 API 服务运行正常！'
  }

  /**
   * 获取应用信息
   * 
   * @returns 应用信息对象
   */
  getInfo() {
    return {
      name: '全栈学习激励平台',
      version: '0.1.0',
      description: '全栈学习 + 笔记 + 练习 + 打卡 + 积分 + 段位 + 勋章 + 抽奖激励机制平台',
      status: 'running',
    }
  }
}

