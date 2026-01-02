# 源码解读：后端用户服务（UsersService）

## 文件概述

`users.service.ts` 是后端用户服务，负责处理用户相关的业务逻辑，包括获取用户信息和用户资料。

**文件位置**：`backend/src/users/users.service.ts`

**重要性**：用户数据获取的核心服务，所有用户相关的数据查询都通过此服务。

## 导入语句解读

```typescript
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../common/prisma/prisma.service'
```

**逐行解读**：

- **`import { Injectable, NotFoundException } from '@nestjs/common'`**
  - **作用**：导入 NestJS 核心装饰器和异常类
  - **为什么需要**：
    - `@Injectable()`：标记类为可注入的服务
    - `NotFoundException`：404 未找到异常（用户不存在时抛出）

- **`import { PrismaService } from '../common/prisma/prisma.service'`**
  - **作用**：导入 Prisma 数据库服务
  - **为什么需要**：访问数据库（查询用户、用户资料等）

## 类定义解读

```typescript
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
```

**逐行解读**：

- **`@Injectable()`**
  - **作用**：标记类为可注入的服务
  - **为什么需要**：NestJS 依赖注入系统需要此装饰器

- **`export class UsersService`**
  - **作用**：导出用户服务类
  - **为什么需要**：其他模块（如 `UsersController`）需要使用此服务

- **`constructor(private readonly prisma: PrismaService)`**
  - **作用**：依赖注入 Prisma 服务
  - **为什么需要**：访问数据库需要 Prisma 服务

## getUserById 方法解读

```typescript
async getUserById(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      nickname: true,
      avatar: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw new NotFoundException('用户不存在')
  }

  return user
}
```

**逐行解读**：

- **`async getUserById(userId: string)`**
  - **作用**：根据 ID 获取用户信息
  - **为什么是异步方法**：需要调用数据库操作（异步）
  - **参数**：`userId` 用户 ID

- **`const user = await this.prisma.user.findUnique({ ... })`**
  - **作用**：查询用户记录
  - **为什么使用 `findUnique`**：基于唯一索引查询，性能高
  - **查询条件**：`where: { id: userId }` 根据 ID 查询

- **`select: { id: true, email: true, ... }`**
  - **作用**：只返回指定的字段
  - **为什么需要**：
    - 不返回敏感信息（如密码）
    - 减少数据传输量
    - 提升性能
  - **字段说明**：
    - `id`：用户 ID
    - `email`：邮箱
    - `username`：用户名
    - `nickname`：昵称
    - `avatar`：头像
    - `role`：角色
    - `isActive`：是否激活
    - `lastLoginAt`：最后登录时间
    - `createdAt`：创建时间
    - `updatedAt`：更新时间
  - **注意**：不包含 `password` 字段，保护用户密码安全

- **`if (!user) { throw new NotFoundException('用户不存在') }`**
  - **作用**：如果用户不存在，抛出未找到异常
  - **为什么需要**：提供清晰的错误信息
  - **HTTP 状态码**：404 Not Found

- **`return user`**
  - **作用**：返回用户信息
  - **为什么需要**：调用者需要用户数据

## getUserProfile 方法解读

```typescript
async getUserProfile(userId: string) {
  const profile = await this.prisma.userProfile.findUnique({
    where: { userId },
  })

  if (!profile) {
    throw new NotFoundException('用户资料不存在')
  }

  return profile
}
```

**逐行解读**：

- **`async getUserProfile(userId: string)`**
  - **作用**：获取用户资料
  - **为什么是异步方法**：需要调用数据库操作（异步）
  - **参数**：`userId` 用户 ID

- **`const profile = await this.prisma.userProfile.findUnique({ where: { userId } })`**
  - **作用**：查询用户资料记录
  - **为什么使用 `findUnique`**：基于唯一索引查询，性能高
  - **查询条件**：`where: { userId }` 根据用户 ID 查询

- **`if (!profile) { throw new NotFoundException('用户资料不存在') }`**
  - **作用**：如果用户资料不存在，抛出未找到异常
  - **为什么需要**：提供清晰的错误信息
  - **HTTP 状态码**：404 Not Found

- **`return profile`**
  - **作用**：返回用户资料
  - **为什么需要**：调用者需要用户资料数据

## 设计模式分析

### 1. 服务模式（Service Pattern）

**应用场景**：业务逻辑封装

**优点**：
- 业务逻辑集中管理，易于维护
- 可以复用业务逻辑
- 易于测试（可以 mock 依赖）

### 2. 依赖注入（Dependency Injection）

**应用场景**：服务依赖管理

**优点**：
- 解耦依赖，易于测试
- 自动管理服务生命周期
- 支持单例模式

## 性能优化点

### 1. 数据库查询优化

**优化点**：使用 `findUnique` 基于唯一索引查询

**原因**：唯一索引查询性能高，O(log n) 时间复杂度

**效果**：提升查询性能，特别是在大量用户时

### 2. 字段选择优化

**优化点**：使用 `select` 只返回需要的字段

**原因**：减少数据传输量，提升性能

**效果**：减少网络传输，提升响应速度

## 最佳实践

### 1. 安全性

- **不返回敏感信息**：使用 `select` 排除密码等敏感字段
- **错误处理**：提供清晰的错误信息

### 2. 数据验证

- **存在性检查**：检查用户是否存在
- **类型安全**：使用 TypeScript 确保类型安全

### 3. 错误处理

- **异常类型**：使用合适的异常类型（`NotFoundException`）
- **错误消息**：提供清晰的错误消息
- **HTTP 状态码**：使用正确的 HTTP 状态码

## 总结

`users.service.ts` 是后端用户服务，实现了用户信息和用户资料的获取功能。它使用 Prisma ORM 进行数据库操作，使用 `select` 优化查询性能，不返回敏感信息，提供清晰的错误处理。通过逐行解读，我们可以深入理解其实现原理和设计思想。

