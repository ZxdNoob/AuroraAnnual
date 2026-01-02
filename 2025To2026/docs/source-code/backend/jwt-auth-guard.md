# 源码解读：后端 JWT 认证守卫（JwtAuthGuard）

## 文件概述

`jwt-auth.guard.ts` 是后端 JWT 认证守卫，用于保护需要认证的路由。它使用 Passport.js 的 JWT 策略进行认证。

**文件位置**：`backend/src/auth/guards/jwt-auth.guard.ts`

**重要性**：路由保护的核心，所有需要认证的路由都使用此守卫。

## 导入语句解读

```typescript
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
```

**逐行解读**：

- **`import { Injectable } from '@nestjs/common'`**
  - **作用**：导入 NestJS 核心装饰器
  - **为什么需要**：`@Injectable()` 标记类为可注入的服务

- **`import { AuthGuard } from '@nestjs/passport'`**
  - **作用**：导入 NestJS Passport 认证守卫基类
  - **为什么需要**：NestJS 的 Passport 集成需要此基类
  - **工作原理**：封装了 Passport.js 的认证守卫实现

## 类定义解读

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**逐行解读**：

- **`@Injectable()`**
  - **作用**：标记类为可注入的服务
  - **为什么需要**：NestJS 依赖注入系统需要此装饰器

- **`export class JwtAuthGuard extends AuthGuard('jwt')`**
  - **作用**：继承 Passport JWT 认证守卫
  - **为什么需要**：NestJS 的 Passport 集成需要继承 `AuthGuard`
  - **参数**：`'jwt'` 表示使用名为 `'jwt'` 的策略（对应 `JwtStrategy`）
  - **工作原理**：
    1. 当路由使用 `@UseGuards(JwtAuthGuard)` 时，此守卫会被执行
    2. 守卫调用 `JwtStrategy` 验证 Token
    3. 如果验证成功，用户信息会被附加到 `request.user`
    4. 如果验证失败，返回 401 未授权错误

## 设计模式分析

### 1. 守卫模式（Guard Pattern）

**应用场景**：路由保护

**优点**：
- 声明式保护，使用装饰器即可保护路由
- 集中管理认证逻辑
- 易于测试和维护

### 2. 策略模式（Strategy Pattern）

**应用场景**：认证策略（JWT 策略）

**优点**：
- 可以轻松切换认证策略
- 策略独立，易于测试和维护

## 使用方式

### 在控制器中使用

```typescript
@Controller('users')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.getUserById(user.userId)
  }
}
```

**逐行解读**：

- **`@UseGuards(JwtAuthGuard)`**
  - **作用**：使用 JWT 认证守卫保护路由
  - **为什么需要**：只有登录用户才能访问此路由
  - **工作原理**：
    1. 从请求头中提取 JWT Token
    2. 验证 Token 签名和过期时间
    3. 从数据库查询用户信息
    4. 如果验证成功，用户信息被附加到 `request.user`
    5. 如果验证失败，返回 401 未授权错误

- **`@CurrentUser() user: any`**
  - **作用**：从 `request.user` 中提取当前用户信息
  - **为什么需要**：控制器需要用户信息执行业务逻辑
  - **自定义装饰器**：`@CurrentUser()` 是自定义装饰器，从 `request.user` 中提取用户信息

## 工作流程

1. **请求到达**：客户端发送请求，携带 `Authorization: Bearer <token>` 头
2. **守卫执行**：`JwtAuthGuard` 拦截请求
3. **策略验证**：调用 `JwtStrategy` 验证 Token
4. **Token 提取**：从请求头中提取 Token
5. **Token 验证**：验证 Token 签名和过期时间
6. **用户查询**：从数据库查询用户信息
7. **用户信息附加**：将用户信息附加到 `request.user`
8. **路由处理**：控制器处理请求，可以使用 `@CurrentUser()` 获取用户信息

## 最佳实践

### 1. 路由保护

- **使用守卫**：需要认证的路由使用 `@UseGuards(JwtAuthGuard)`
- **全局守卫**：可以在模块级别设置全局守卫

### 2. 错误处理

- **自动处理**：守卫自动处理认证失败，返回 401 错误
- **错误消息**：可以在策略中自定义错误消息

## 总结

`jwt-auth.guard.ts` 是后端 JWT 认证守卫，使用 Passport.js 的 JWT 策略保护需要认证的路由。它通过继承 `AuthGuard('jwt')` 实现，当路由使用 `@UseGuards(JwtAuthGuard)` 时，会自动验证 JWT Token 并将用户信息附加到 `request.user`。通过逐行解读，我们可以深入理解其实现原理和设计思想。

