# 源码解读：前端 API 工具函数

## 文件概述

`api.ts` 是前端 API 请求的工具函数文件，提供统一的 API 请求方法，包括 GET、POST、PUT、DELETE 等 HTTP 方法，以及错误处理、认证 Token 管理等。

**文件位置**：`frontend/src/utils/api.ts`

**重要性**：所有前端 API 请求都通过此文件，是前后端通信的核心。

## 配置和类型定义

### API 基础 URL

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
```

**逐行解读**：

- **`const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'`**
  - **作用**：定义 API 基础 URL
  - **为什么需要**：所有 API 请求都需要基础 URL
  - **环境变量**：从 `process.env.NEXT_PUBLIC_API_URL` 读取（Next.js 环境变量）
  - **默认值**：`'http://localhost:4000'`（开发环境）
  - **`NEXT_PUBLIC_` 前缀**：Next.js 要求客户端环境变量必须以此前缀开头
  - **关联**：与 Next.js 环境变量配置相关

### RequestConfig 接口

```typescript
interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>
  token?: string
}
```

**逐行解读**：

- **`interface RequestConfig extends RequestInit`**
  - **作用**：定义请求配置接口
  - **为什么需要**：TypeScript 类型检查，确保请求配置正确
  - **继承**：`extends RequestInit` 继承 Fetch API 的配置类型

- **`params?: Record<string, string | number | boolean>`**
  - **作用**：查询参数（可选）
  - **为什么需要**：GET 请求可能需要查询参数
  - **类型**：`Record<string, string | number | boolean>` 表示键值对对象
  - **可选**：`?` 表示可选属性

- **`token?: string`**
  - **作用**：JWT Token（可选）
  - **为什么需要**：需要认证的请求需要 Token
  - **可选**：公开接口不需要 Token

## 工具函数解读

### 1. buildUrl 函数

```typescript
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }
  
  return url.toString()
}
```

**逐行解读**：

- **`function buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string`**
  - **作用**：构建完整的请求 URL
  - **为什么需要**：统一处理 URL 构建逻辑
  - **参数**：
    - `endpoint`：API 端点（如 `/api/users/me`）
    - `params`：查询参数（可选）
  - **返回**：完整的 URL 字符串

- **`const url = new URL(\`${API_BASE_URL}${endpoint}\`)`**
  - **作用**：创建 URL 对象
  - **为什么需要**：使用 URL API 可以方便地添加查询参数
  - **URL 构造**：`${API_BASE_URL}${endpoint}` 拼接基础 URL 和端点

- **`if (params) { ... }`**
  - **作用**：如果有查询参数，添加到 URL
  - **为什么需要**：GET 请求可能需要查询参数

- **`Object.entries(params).forEach(([key, value]) => { ... })`**
  - **作用**：遍历查询参数对象
  - **为什么需要**：将每个参数添加到 URL
  - **ES6 语法**：`Object.entries()` 返回键值对数组，`forEach` 遍历

- **`url.searchParams.append(key, String(value))`**
  - **作用**：添加查询参数到 URL
  - **为什么需要**：构建查询字符串（如 `?page=1&limit=10`）
  - **类型转换**：`String(value)` 确保值为字符串类型

- **`return url.toString()`**
  - **作用**：返回完整的 URL 字符串
  - **为什么需要**：Fetch API 需要字符串 URL

### 2. getAuthHeaders 函数

```typescript
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}
```

**逐行解读**：

- **`function getAuthHeaders(token?: string): HeadersInit`**
  - **作用**：获取认证请求头
  - **为什么需要**：统一处理请求头，包括认证 Token
  - **参数**：`token` JWT Token（可选）
  - **返回**：请求头对象

- **`const headers: HeadersInit = { 'Content-Type': 'application/json' }`**
  - **作用**：初始化请求头
  - **为什么需要**：所有请求都需要 `Content-Type` 头
  - **Content-Type**：`application/json` 表示请求体是 JSON 格式

- **`if (token) { headers['Authorization'] = \`Bearer ${token}\` }`**
  - **作用**：如果有 Token，添加认证头
  - **为什么需要**：需要认证的请求需要 `Authorization` 头
  - **格式**：`Bearer ${token}` 是 JWT 认证的标准格式
  - **关联**：与 JWT 认证机制相关

- **`return headers`**
  - **作用**：返回请求头对象
  - **为什么需要**：Fetch API 需要 `headers` 参数

### 3. handleResponse 函数

```typescript
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }
  
  return response.json()
}
```

**逐行解读**：

- **`async function handleResponse<T>(response: Response): Promise<T>`**
  - **作用**：处理 API 响应
  - **为什么需要**：统一处理响应，包括错误处理
  - **泛型**：`<T>` 表示返回类型
  - **参数**：`response` Fetch API 响应对象
  - **返回**：解析后的数据

- **`if (!response.ok) { ... }`**
  - **作用**：检查响应是否成功
  - **为什么需要**：HTTP 状态码 200-299 表示成功，其他表示错误
  - **`response.ok`**：Fetch API 属性，表示响应是否成功

- **`const error = await response.json().catch(() => ({ message: response.statusText }))`**
  - **作用**：尝试解析错误响应
  - **为什么需要**：后端可能返回 JSON 格式的错误信息
  - **错误处理**：如果解析失败，使用 `response.statusText` 作为错误信息
  - **`catch`**：捕获 JSON 解析错误

- **`throw new Error(error.message || \`HTTP error! status: ${response.status}\`)`**
  - **作用**：抛出错误
  - **为什么需要**：统一错误处理，让调用者可以捕获错误
  - **错误信息**：优先使用后端返回的错误信息，否则使用 HTTP 状态文本

- **`return response.json()`**
  - **作用**：解析响应为 JSON
  - **为什么需要**：后端返回 JSON 格式数据
  - **异步操作**：`json()` 是异步方法，返回 Promise

## HTTP 方法函数解读

### 1. get 函数

```typescript
export async function get<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}
```

**逐行解读**：

- **`export async function get<T = any>(endpoint: string, config?: RequestConfig): Promise<T>`**
  - **作用**：发送 GET 请求
  - **为什么需要**：获取数据（如用户信息、列表数据）
  - **泛型**：`<T>` 表示返回数据类型
  - **参数**：
    - `endpoint`：API 端点
    - `config`：请求配置（可选）

- **`const { params, token, ...fetchConfig } = config || {}`**
  - **作用**：解构请求配置
  - **为什么需要**：分离查询参数、Token 和其他配置
  - **ES6 语法**：解构赋值和剩余参数

- **`const url = buildUrl(endpoint, params)`**
  - **作用**：构建完整的请求 URL
  - **为什么需要**：包含查询参数的完整 URL

- **`const response = await fetch(url, { method: 'GET', headers: getAuthHeaders(token), ...fetchConfig })`**
  - **作用**：发送 GET 请求
  - **为什么需要**：调用后端 API
  - **Fetch API**：浏览器原生 API，用于发送 HTTP 请求
  - **配置**：
    - `method: 'GET'`：HTTP 方法
    - `headers: getAuthHeaders(token)`：请求头（包含认证 Token）
    - `...fetchConfig`：其他配置（如 `signal` 用于取消请求）

- **`return handleResponse<T>(response)`**
  - **作用**：处理响应并返回数据
  - **为什么需要**：统一处理响应和错误

### 2. post 函数

```typescript
export async function post<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: data ? JSON.stringify(data) : undefined,
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}
```

**逐行解读**：

- **`export async function post<T = any>(endpoint: string, data?: any, config?: RequestConfig): Promise<T>`**
  - **作用**：发送 POST 请求
  - **为什么需要**：创建数据（如用户注册、登录）
  - **参数**：
    - `endpoint`：API 端点
    - `data`：请求体数据（可选）
    - `config`：请求配置（可选）

- **`body: data ? JSON.stringify(data) : undefined`**
  - **作用**：设置请求体
  - **为什么需要**：POST 请求需要发送数据
  - **JSON 序列化**：`JSON.stringify()` 将对象转换为 JSON 字符串
  - **条件判断**：如果有数据才设置 body，否则为 `undefined`

### 3. put 函数

```typescript
export async function put<T = any>(
  endpoint: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: data ? JSON.stringify(data) : undefined,
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}
```

**逐行解读**：

- **`export async function put<T = any>(...)`**
  - **作用**：发送 PUT 请求
  - **为什么需要**：更新数据（如更新用户信息）
  - **实现逻辑**：与 `post` 函数类似，但使用 `PUT` 方法

### 4. del 函数

```typescript
export async function del<T = any>(endpoint: string, config?: RequestConfig): Promise<T> {
  const { params, token, ...fetchConfig } = config || {}
  const url = buildUrl(endpoint, params)
  
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    ...fetchConfig,
  })
  
  return handleResponse<T>(response)
}
```

**逐行解读**：

- **`export async function del<T = any>(endpoint: string, config?: RequestConfig): Promise<T>`**
  - **作用**：发送 DELETE 请求
  - **为什么需要**：删除数据（如删除文件、删除记录）
  - **函数名**：使用 `del` 而不是 `delete`，因为 `delete` 是 JavaScript 关键字
  - **实现逻辑**：与 `get` 函数类似，但使用 `DELETE` 方法

### 5. getAuthToken 函数

```typescript
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}
```

**逐行解读**：

- **`export function getAuthToken(): string | null`**
  - **作用**：从 localStorage 获取认证 Token
  - **为什么需要**：其他组件需要获取 Token 进行 API 请求
  - **返回类型**：`string | null` 表示可能为 `null`（未登录）

- **`if (typeof window === 'undefined') return null`**
  - **作用**：检查是否在客户端环境
  - **为什么需要**：`localStorage` 只在客户端存在，服务端不存在
  - **服务端渲染**：Next.js 会在服务端预渲染，此时 `window` 对象不存在

- **`return localStorage.getItem('auth_token')`**
  - **作用**：从 localStorage 获取 Token
  - **为什么需要**：Token 存储在 localStorage 中
  - **存储键名**：`auth_token` 与 `AuthContext` 中的键名一致

## 设计模式分析

### 1. 工具函数模式

**应用场景**：封装通用功能（URL 构建、请求头构建、响应处理）

**优点**：
- 代码复用，避免重复代码
- 统一处理，易于维护
- 类型安全，使用 TypeScript 确保类型正确

### 2. 函数式编程模式

**应用场景**：纯函数设计（buildUrl、getAuthHeaders）

**优点**：
- 易于测试
- 易于理解
- 无副作用

### 3. 错误处理模式

**应用场景**：统一错误处理（handleResponse）

**优点**：
- 统一错误格式
- 易于错误处理
- 提升用户体验

## 性能优化点

### 1. URL 构建优化

**优化点**：使用 URL API 构建 URL

**原因**：URL API 自动处理 URL 编码，避免手动拼接

**效果**：提升代码可读性和正确性

### 2. 错误处理优化

**优化点**：统一的错误处理机制

**原因**：所有 API 请求都使用相同的错误处理逻辑

**效果**：提升用户体验，错误信息一致

## 最佳实践

### 1. 类型安全

- 使用 TypeScript 泛型确保返回类型正确
- 使用接口定义配置类型

### 2. 错误处理

- 统一的错误处理机制
- 清晰的错误信息

### 3. 代码复用

- 封装通用功能，避免重复代码
- 使用工具函数简化调用

### 4. 安全性

- Token 存储在 localStorage（生产环境应考虑 HTTP-only Cookie）
- 使用 HTTPS 传输（生产环境）

## 使用示例

### GET 请求

```typescript
import { get } from '@/utils/api'

// 获取用户信息
const user = await get<User>('/api/users/me', { token: getAuthToken() })

// 带查询参数
const users = await get<User[]>('/api/users', { 
  params: { page: 1, limit: 10 },
  token: getAuthToken()
})
```

### POST 请求

```typescript
import { post } from '@/utils/api'

// 用户登录
const response = await post<AuthResponse>('/api/auth/login', {
  usernameOrEmail: 'user@example.com',
  password: 'password123'
})
```

## 总结

`api.ts` 是前端 API 请求的工具函数文件，提供统一的 API 请求方法，包括 GET、POST、PUT、DELETE 等 HTTP 方法。它封装了 URL 构建、请求头构建、响应处理等通用功能，使用 TypeScript 确保类型安全，提供统一的错误处理机制。通过逐行解读，我们可以深入理解其实现原理和设计思想。

