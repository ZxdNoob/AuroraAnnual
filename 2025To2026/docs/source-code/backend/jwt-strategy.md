# 源码解读：后端 JWT 策略（JwtStrategy）

## 文件概述

`jwt.strategy.ts` 是后端 JWT 认证策略，用于验证 JWT Token 并从 Token 中提取用户信息。它使用 Passport.js 的 JWT 策略实现。

**文件位置**：`backend/src/auth/strategies/jwt.strategy.ts`

**重要性**：JWT 认证的核心，所有需要认证的请求都通过此策略验证 Token。

## 导入语句解读

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../common/prisma/prisma.service'
```

**逐行解读**：

- **`import { Injectable, UnauthorizedException } from '@nestjs/common'`**
  - **作用**：导入 NestJS 核心装饰器和异常类
  - **为什么需要**：
    - `@Injectable()`：标记类为可注入的服务
    - `UnauthorizedException`：401 未授权异常（Token 无效时抛出）

- **`import { PassportStrategy } from '@nestjs/passport'`**
  - **作用**：导入 NestJS Passport 策略基类
  - **为什么需要**：NestJS 的 Passport 集成需要此基类
  - **工作原理**：封装了 Passport.js 的策略实现

- **`import { ExtractJwt, Strategy } from 'passport-jwt'`**
  - **作用**：导入 Passport JWT 策略
  - **为什么需要**：
    - `ExtractJwt`：JWT Token 提取工具
    - `Strategy`：JWT 策略类
  - **关联**：与 Passport.js JWT 策略相关

- **`import { ConfigService } from '@nestjs/config'`**
  - **作用**：导入 NestJS 配置服务
  - **为什么需要**：读取 JWT 密钥等配置

- **`import { PrismaService } from '../../common/prisma/prisma.service'`**
  - **作用**：导入 Prisma 数据库服务
  - **为什么需要**：验证 Token 后需要从数据库查询用户信息

## 类定义解读

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key',
    })
  }
```

**逐行解读**：

- **`@Injectable()`**
  - **作用**：标记类为可注入的服务
  - **为什么需要**：NestJS 依赖注入系统需要此装饰器

- **`export class JwtStrategy extends PassportStrategy(Strategy)`**
  - **作用**：继承 Passport JWT 策略
  - **为什么需要**：NestJS 的 Passport 集成需要继承 `PassportStrategy`
  - **泛型参数**：`Strategy` 表示使用 Passport JWT 策略

- **`constructor(private configService: ConfigService, private prisma: PrismaService)`**
  - **作用**：依赖注入配置服务和 Prisma 服务
  - **为什么需要**：
    - `configService`：读取 JWT 密钥
    - `prisma`：查询用户信息

- **`super({ ... })`**
  - **作用**：调用父类构造函数，配置 JWT 策略
  - **为什么需要**：Passport JWT 策略需要配置选项

- **`jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()`**
  - **作用**：从请求头中提取 JWT Token
  - **为什么需要**：JWT Token 通常放在 `Authorization: Bearer <token>` 请求头中
  - **提取方式**：`fromAuthHeaderAsBearerToken()` 从 `Authorization` 头中提取 Bearer Token
  - **格式**：`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

- **`ignoreExpiration: false`**
  - **作用**：不忽略 Token 过期时间
  - **为什么需要**：过期的 Token 应该被拒绝
  - **安全性**：确保 Token 在有效期内

- **`secretOrKey: configService.get<string>('JWT_SECRET') || 'your-secret-key'`**
  - **作用**：JWT 密钥
  - **为什么需要**：验证 Token 签名需要密钥
  - **配置来源**：从环境变量读取（`.env` 文件）
  - **默认值**：`'your-secret-key'`（开发环境，生产环境必须设置）
  - **安全性**：生产环境必须使用强密钥

## validate 方法解读

```typescript
async validate(payload: { userId: string; email: string }) {
  // 从数据库查询用户
  const user = await this.prisma.user.findUnique({
    where: { id: payload.userId },
    include: { profile: true },
  })

  if (!user || !user.isActive) {
    throw new UnauthorizedException('用户不存在或已被禁用')
  }

  // 更新最后登录时间
  await this.prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  // 返回用户信息（会被附加到 request.user）
  return {
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  }
}
```

**逐行解读**：

- **`async validate(payload: { userId: string; email: string })`**
  - **作用**：验证 JWT Token 并返回用户信息
  - **为什么是异步方法**：需要调用数据库操作（异步）
  - **参数**：`payload` JWT Token 的 payload（包含用户 ID 和邮箱）
  - **执行时机**：Token 验证成功后自动调用
  - **返回**：用户信息对象（会被附加到 `request.user`）

- **`const user = await this.prisma.user.findUnique({ where: { id: payload.userId }, include: { profile: true } })`**
  - **作用**：从数据库查询用户
  - **为什么需要**：验证用户是否存在和是否激活
  - **查询条件**：`where: { id: payload.userId }` 根据用户 ID 查询
  - **关联查询**：`include: { profile: true }` 包含用户资料（虽然未使用，但可以用于扩展）

- **`if (!user || !user.isActive) { throw new UnauthorizedException('用户不存在或已被禁用') }`**
  - **作用**：检查用户是否存在和是否激活
  - **为什么需要**：
    - 用户可能被删除
    - 用户可能被禁用
  - **错误处理**：抛出未授权异常，返回 401 状态码

- **`await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })`**
  - **作用**：更新最后登录时间
  - **为什么需要**：记录用户登录历史，用于安全审计
  - **数据字段**：`lastLoginAt: new Date()` 当前时间

- **`return { userId: user.id, email: user.email, username: user.username, role: user.role }`**
  - **作用**：返回用户信息
  - **为什么需要**：返回的信息会被附加到 `request.user`，供控制器使用
  - **字段说明**：
    - `userId`：用户 ID
    - `email`：用户邮箱
    - `username`：用户名
    - `role`：用户角色
  - **注意**：不返回敏感信息（如密码）

## 设计模式分析

### 1. 策略模式（Strategy Pattern）

**应用场景**：认证策略（JWT 策略）

**优点**：
- 可以轻松切换认证策略（如 OAuth、Local 等）
- 策略独立，易于测试和维护

### 2. 依赖注入（Dependency Injection）

**应用场景**：服务依赖管理

**优点**：
- 解耦依赖，易于测试
- 自动管理服务生命周期

## 性能优化点

### 1. 数据库查询优化

**优化点**：使用 `findUnique` 基于唯一索引查询

**原因**：唯一索引查询性能高，O(log n) 时间复杂度

**效果**：提升 Token 验证性能

### 2. 缓存优化（可选）

**优化点**：可以缓存用户信息，减少数据库查询

**原因**：用户信息变化频率低，可以缓存

**效果**：进一步提升性能（当前未实现）

## 最佳实践

### 1. 安全性

- **Token 验证**：验证 Token 签名和过期时间
- **用户状态检查**：检查用户是否存在和是否激活
- **密钥管理**：使用环境变量管理密钥，生产环境使用强密钥

### 2. 错误处理

- **异常类型**：使用合适的异常类型（`UnauthorizedException`）
- **错误消息**：提供清晰的错误消息

### 3. 日志记录

- **登录时间更新**：记录用户登录时间，用于安全审计

## 总结

`jwt.strategy.ts` 是后端 JWT 认证策略，使用 Passport.js 的 JWT 策略实现 Token 验证。它从请求头中提取 Token，验证 Token 签名和过期时间，从数据库查询用户信息，更新登录时间，返回用户信息供控制器使用。通过逐行解读，我们可以深入理解其实现原理和设计思想。

