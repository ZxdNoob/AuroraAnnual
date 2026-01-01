import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * JWT 认证守卫
 * 
 * @description 用于保护需要认证的路由
 * 使用 @UseGuards(JwtAuthGuard) 装饰器保护路由
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

