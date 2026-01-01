import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 当前用户装饰器
 * 
 * @description 用于从请求中提取当前登录用户信息
 * 使用方式：@CurrentUser() user
 * 
 * @example
 * ```typescript
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  }
)

