import { SetMetadata } from '@nestjs/common'

/**
 * 角色装饰器
 * 
 * @description 用于标记路由所需的角色
 * 使用方式：@Roles('SUPER_ADMIN')
 * 
 * @example
 * ```typescript
 * @Get('admin')
 * @Roles('SUPER_ADMIN')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * adminOnly() {
 *   return 'Admin only';
 * }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

