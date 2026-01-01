import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

/**
 * 角色守卫
 * 
 * @description 用于检查用户是否具有访问路由所需的角色
 * 需要配合 @Roles() 装饰器和 JwtAuthGuard 使用
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 获取路由所需的角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ])

    // 如果没有角色要求，允许访问
    if (!requiredRoles) {
      return true
    }

    // 获取当前用户
    const request = context.switchToHttp().getRequest()
    const user = request.user

    // 检查用户是否具有所需角色
    return requiredRoles.some((role) => user?.role === role)
  }
}

