import { Module } from '@nestjs/common'
import { CodeController } from './code.controller'
import { CodeService } from './code.service'
import { PrismaModule } from '../common/prisma/prisma.module'

/**
 * 在线编码模块
 * 
 * @description 提供在线编码相关的功能：
 * - 文件/文件夹管理（创建、删除、重命名、移动）
 * - 代码保存
 * - 文件树结构
 * - 多语言支持
 */
@Module({
  imports: [PrismaModule],
  controllers: [CodeController],
  providers: [CodeService],
  exports: [CodeService],
})
export class CodeModule {}

