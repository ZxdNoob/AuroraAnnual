# 源码解读：前端用户资料 Hook（useUserProfile）

## 文件概述

`useUserProfile.ts` 是前端自定义 React Hook，用于获取用户资料数据。它使用 React Query（TanStack Query）进行数据获取、缓存和状态管理。

**文件位置**：`frontend/src/hooks/useUserProfile.ts`

**重要性**：用户资料数据的核心获取逻辑，多个页面依赖此 Hook。

## 导入语句解读

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { get, getAuthToken } from '@/utils/api'
import type { UserProfile, User, Rank } from '@/types'
```

**逐行解读**：

- **`'use client'`**
  - **作用**：Next.js App Router 指令，标记此文件为客户端组件
  - **为什么需要**：使用了 `useQuery`、`getAuthToken` 等客户端 API

- **`import { useState, useEffect } from 'react'`**
  - **作用**：导入 React Hooks（虽然此文件未使用，但保留以备扩展）

- **`import { useQuery } from '@tanstack/react-query'`**
  - **作用**：导入 React Query 的 `useQuery` Hook
  - **为什么需要**：用于数据获取、缓存和状态管理
  - **工作原理**：React Query 提供强大的数据获取和缓存功能
  - **关联**：与 React Query 数据获取库相关

- **`import { get, getAuthToken } from '@/utils/api'`**
  - **作用**：导入 API 工具函数
  - **为什么需要**：
    - `get`：发送 GET 请求获取数据
    - `getAuthToken`：获取认证 Token

- **`import type { UserProfile, User, Rank } from '@/types'`**
  - **作用**：导入类型定义（仅类型导入）
  - **为什么需要**：TypeScript 类型检查，确保数据类型正确

## 类型定义解读

```typescript
interface UserProfileResponse {
  user: User
  profile: UserProfile
  rank?: Rank
}
```

**逐行解读**：

- **`interface UserProfileResponse`**
  - **作用**：定义用户资料响应的数据结构
  - **为什么需要**：TypeScript 类型检查，确保 API 响应符合预期格式

- **`user: User`**
  - **作用**：用户基本信息
  - **为什么需要**：包含用户 ID、邮箱、用户名等基本信息

- **`profile: UserProfile`**
  - **作用**：用户详细资料
  - **为什么需要**：包含积分、等级、经验、段位等详细信息

- **`rank?: Rank`**
  - **作用**：用户段位信息（可选）
  - **为什么需要**：段位信息可能不存在（新用户）
  - **可选**：`?` 表示可选属性

## useUserProfile Hook 解读

```typescript
export function useUserProfile() {
  const token = getAuthToken()
  
  return useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('未登录')
      }
      
      // 获取用户信息
      const user = await get<User>('/api/users/me', { token })
      
      // 获取用户资料
      const profile = await get<UserProfile>('/api/users/me/profile', { token })
      
      // 获取段位信息（如果有）
      let rank: Rank | undefined
      if (profile.currentRankId) {
        try {
          rank = await get<Rank>(`/api/ranks/${profile.currentRankId}`, { token })
        } catch (error) {
          console.error('获取段位信息失败:', error)
        }
      }
      
      return { user, profile, rank } as UserProfileResponse
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 分钟
    retry: 1,
  })
}
```

**逐行解读**：

- **`export function useUserProfile()`**
  - **作用**：导出用户资料 Hook
  - **为什么需要**：其他组件需要使用此 Hook 获取用户资料

- **`const token = getAuthToken()`**
  - **作用**：获取认证 Token
  - **为什么需要**：API 请求需要 Token 进行认证
  - **注意**：每次 Hook 调用都会获取 Token，确保使用最新 Token

- **`return useQuery({ ... })`**
  - **作用**：使用 React Query 获取数据
  - **为什么需要**：React Query 提供数据获取、缓存、重试等功能
  - **返回**：React Query 的查询结果对象（包含 `data`、`isLoading`、`error` 等）

- **`queryKey: ['userProfile', token]`**
  - **作用**：查询键，用于缓存和标识查询
  - **为什么需要**：React Query 使用查询键管理缓存
  - **键组成**：
    - `'userProfile'`：查询名称
    - `token`：Token 作为键的一部分，确保不同用户的缓存独立
  - **缓存机制**：相同查询键的数据会被缓存，避免重复请求

- **`queryFn: async () => { ... }`**
  - **作用**：查询函数，实际的数据获取逻辑
  - **为什么是异步函数**：需要调用 API 获取数据
  - **为什么需要**：定义如何获取数据

- **`if (!token) { throw new Error('未登录') }`**
  - **作用**：检查 Token 是否存在
  - **为什么需要**：没有 Token 无法获取用户资料
  - **错误处理**：抛出错误，React Query 会处理错误状态

- **`const user = await get<User>('/api/users/me', { token })`**
  - **作用**：获取用户基本信息
  - **为什么需要**：用户资料响应需要用户基本信息
  - **API 路径**：`/api/users/me`（需要认证）
  - **类型**：`get<User>` 表示返回类型为 `User`

- **`const profile = await get<UserProfile>('/api/users/me/profile', { token })`**
  - **作用**：获取用户详细资料
  - **为什么需要**：用户资料响应需要用户详细资料
  - **API 路径**：`/api/users/me/profile`（需要认证）
  - **类型**：`get<UserProfile>` 表示返回类型为 `UserProfile`

- **`let rank: Rank | undefined`**
  - **作用**：声明段位变量
  - **为什么需要**：段位信息可能不存在，需要可选类型

- **`if (profile.currentRankId) { ... }`**
  - **作用**：检查用户是否有段位
  - **为什么需要**：新用户可能没有段位，避免不必要的 API 调用

- **`try { rank = await get<Rank>(...) } catch (error) { ... }`**
  - **作用**：获取段位信息，如果失败则忽略
  - **为什么需要**：段位信息获取失败不应影响用户资料获取
  - **错误处理**：记录错误但不抛出，确保用户资料可以正常返回

- **`return { user, profile, rank } as UserProfileResponse`**
  - **作用**：返回用户资料响应
  - **为什么需要**：符合 `UserProfileResponse` 接口定义
  - **类型断言**：`as UserProfileResponse` 确保类型正确

- **`enabled: !!token`**
  - **作用**：控制查询是否启用
  - **为什么需要**：没有 Token 时不应执行查询
  - **逻辑**：`!!token` 将 Token 转换为布尔值（存在为 `true`，不存在为 `false`）

- **`staleTime: 5 * 60 * 1000`**
  - **作用**：设置数据过期时间（5 分钟）
  - **为什么需要**：在 5 分钟内，数据被认为是新鲜的，不会重新获取
  - **性能优化**：减少不必要的 API 请求
  - **时间单位**：毫秒（5 分钟 = 5 * 60 * 1000 毫秒）

- **`retry: 1`**
  - **作用**：设置重试次数（1 次）
  - **为什么需要**：网络请求可能失败，自动重试提升成功率
  - **重试次数**：失败后重试 1 次，如果仍然失败则不再重试

## React Query 返回值解读

`useQuery` 返回的对象包含以下属性：

- **`data`**：查询数据（`UserProfileResponse | undefined`）
- **`isLoading`**：是否正在加载（首次加载时）
- **`isFetching`**：是否正在获取（包括重新获取）
- **`error`**：错误对象（如果查询失败）
- **`refetch`**：手动重新获取数据的函数

## 设计模式分析

### 1. Custom Hook 模式

**应用场景**：封装数据获取逻辑

**优点**：
- 代码复用，避免在每个组件中重复数据获取逻辑
- 关注点分离，数据获取逻辑独立管理
- 易于测试和维护

### 2. React Query 模式

**应用场景**：数据获取和缓存管理

**优点**：
- 自动缓存，减少不必要的 API 请求
- 自动重试，提升请求成功率
- 状态管理，提供加载、错误等状态

## 性能优化点

### 1. 数据缓存

**优化点**：使用 React Query 缓存数据

**原因**：相同查询键的数据会被缓存，避免重复请求

**效果**：提升性能，减少 API 请求次数

### 2. 条件查询

**优化点**：使用 `enabled` 选项控制查询启用

**原因**：没有 Token 时不应执行查询

**效果**：避免不必要的 API 请求

### 3. 过期时间设置

**优化点**：设置 `staleTime` 为 5 分钟

**原因**：在 5 分钟内，数据被认为是新鲜的，不会重新获取

**效果**：减少 API 请求，提升性能

## 最佳实践

### 1. 错误处理

- **段位信息获取失败**：记录错误但不影响用户资料获取
- **Token 不存在**：抛出错误，让调用者处理

### 2. 类型安全

- 使用 TypeScript 确保数据类型正确
- 使用接口定义响应类型

### 3. 性能优化

- 使用 React Query 缓存数据
- 设置合理的过期时间
- 条件启用查询

## 使用示例

### 在组件中使用

```typescript
'use client'

import { useUserProfile } from '@/hooks/useUserProfile'

export default function ProfilePage() {
  const { data: userProfileData, isLoading, error } = useUserProfile()

  if (isLoading) {
    return <div>加载中...</div>
  }

  if (error) {
    return <div>加载失败：{error.message}</div>
  }

  if (!userProfileData) {
    return <div>未登录</div>
  }

  return (
    <div>
      <h1>欢迎，{userProfileData.user.username}</h1>
      <p>积分：{userProfileData.profile.totalPoints}</p>
      <p>等级：{userProfileData.profile.currentLevel}</p>
    </div>
  )
}
```

## 总结

`useUserProfile.ts` 是前端用户资料获取的 Hook，使用 React Query 进行数据获取和缓存管理。它封装了用户信息、用户资料和段位信息的获取逻辑，提供了类型安全和性能优化。通过逐行解读，我们可以深入理解其实现原理和设计思想。

