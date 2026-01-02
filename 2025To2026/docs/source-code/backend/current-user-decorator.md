# 源码解读：后端当前用户装饰器（CurrentUser）

## 文件概述

`current-user.decorator.ts` 是后端自定义参数装饰器，用于从请求中提取当前登录用户信息。它简化了控制器中获取用户信息的代码。

**文件位置**：`backend/src/common/decorators/current-user.decorator.ts`

**重要性**：简化控制器代码，提供统一的用户信息获取方式。

## 导入语句解读

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
```

**逐行解读**：

- **`import { createParamDecorator, ExecutionContext } from '@nestjs/common'`**
  - **作用**：导入 NestJS 核心装饰器工具和执行上下文
  - **为什么需要**：
    - `createParamDecorator`：创建自定义参数装饰器
    - `ExecutionContext`：执行上下文，包含请求和响应对象

## 装饰器定义解读

```typescript
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  }
)
```

**逐行解读**：

- **`export const CurrentUser = createParamDecorator(...)`**
  - **作用**：创建并导出当前用户装饰器
  - **为什么需要**：提供统一的用户信息获取方式
  - **装饰器类型**：参数装饰器（用于方法参数）

- **`createParamDecorator((data: unknown, ctx: ExecutionContext) => { ... })`**
  - **作用**：创建参数装饰器
  - **为什么需要**：NestJS 提供此工具函数创建自定义装饰器
  - **参数说明**：
    - `data`：装饰器参数（未使用，类型为 `unknown`）
    - `ctx`：执行上下文，包含请求和响应对象

- **`const request = ctx.switchToHttp().getRequest()`**
  - **作用**：从执行上下文中获取 HTTP 请求对象
  - **为什么需要**：用户信息存储在请求对象中
  - **`switchToHttp()`**：切换到 HTTP 上下文（NestJS 支持多种上下文，如 WebSocket、gRPC 等）
  - **`getRequest()`**：获取请求对象

- **`return request.user`**
  - **作用**：返回请求对象中的用户信息
  - **为什么需要**：JWT 认证守卫会将用户信息附加到 `request.user`
  - **数据来源**：由 `JwtStrategy` 的 `validate` 方法返回的用户信息

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

- **`@CurrentUser() user: any`**
  - **作用**：从请求中提取当前用户信息
  - **为什么需要**：简化用户信息获取，避免手动访问 `request.user`
  - **参数类型**：`any`（可以定义为更具体的类型，如 `{ userId: string; email: string }`）

## 工作流程

1. **请求到达**：客户端发送请求，携带 JWT Token
2. **守卫验证**：`JwtAuthGuard` 验证 Token
3. **策略验证**：`JwtStrategy` 验证 Token 并查询用户信息
4. **用户信息附加**：用户信息被附加到 `request.user`
5. **装饰器提取**：`@CurrentUser()` 装饰器从 `request.user` 中提取用户信息
6. **控制器使用**：控制器方法可以使用用户信息执行业务逻辑

## 设计模式分析

### 1. 装饰器模式（Decorator Pattern）

**应用场景**：参数提取

**优点**：
- 声明式编程，代码简洁
- 统一用户信息获取方式
- 易于测试和维护

### 2. 依赖注入（Dependency Injection）

**应用场景**：请求对象注入

**优点**：
- 自动注入请求对象
- 简化代码，避免手动访问 `request.user`

## 最佳实践

### 1. 类型安全

- **定义类型**：可以定义用户信息类型，替代 `any`
- **类型检查**：确保用户信息类型正确

### 2. 使用场景

- **需要认证的路由**：只有使用 `@UseGuards(JwtAuthGuard)` 的路由才能使用此装饰器
- **用户信息获取**：需要获取当前登录用户信息时使用

## 总结

`current-user.decorator.ts` 是后端自定义参数装饰器，用于从请求中提取当前登录用户信息。它使用 NestJS 的 `createParamDecorator` 创建，简化了控制器中获取用户信息的代码。通过逐行解读，我们可以深入理解其实现原理和设计思想。

