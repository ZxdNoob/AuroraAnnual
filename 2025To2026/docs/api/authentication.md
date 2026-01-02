# 认证 API 文档

## 概述

认证模块提供用户注册和登录功能，使用 JWT (JSON Web Token) 进行身份验证。

**路径前缀**：`/api/auth`

## 接口列表

### 1. 用户注册

**接口**：`POST /api/auth/register`

**描述**：创建新用户账户

**认证**：不需要

**请求体**：

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**请求参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| email | string | 是 | 用户邮箱地址（需符合邮箱格式） |
| username | string | 是 | 用户名（3-20 个字符，只能包含字母、数字、下划线） |
| password | string | 是 | 密码（至少 6 个字符） |

**响应示例**（201 Created）：

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "username": "username",
    "isActive": true,
    "profile": {
      "nickname": null,
      "avatar": null,
      "bio": null
    }
  }
}
```

**错误响应**：

- **409 Conflict**：邮箱或用户名已存在
  ```json
  {
    "statusCode": 409,
    "message": "邮箱或用户名已存在",
    "error": "Conflict"
  }
  ```

- **400 Bad Request**：请求参数验证失败
  ```json
  {
    "statusCode": 400,
    "message": ["email must be an email", "password must be longer than or equal to 6 characters"],
    "error": "Bad Request"
  }
  ```

### 2. 用户登录

**接口**：`POST /api/auth/login`

**描述**：验证用户凭据并返回 JWT Token

**认证**：不需要

**请求体**：

```json
{
  "usernameOrEmail": "username",
  "password": "password123"
}
```

**请求参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| usernameOrEmail | string | 是 | 用户名或邮箱地址 |
| password | string | 是 | 用户密码 |

**响应示例**（200 OK）：

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "username": "username",
    "isActive": true,
    "profile": {
      "nickname": "昵称",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "个人简介"
    }
  }
}
```

**错误响应**：

- **401 Unauthorized**：用户名或密码错误
  ```json
  {
    "statusCode": 401,
    "message": "用户名或密码错误",
    "error": "Unauthorized"
  }
  ```

- **400 Bad Request**：请求参数验证失败
  ```json
  {
    "statusCode": 400,
    "message": ["usernameOrEmail should not be empty"],
    "error": "Bad Request"
  }
  ```

## JWT Token 使用

### Token 格式

JWT Token 包含以下信息：

- `userId`：用户 ID
- `email`：用户邮箱
- `exp`：过期时间（默认 7 天）

### 在请求中使用 Token

在需要认证的接口中，需要在请求头中携带 Token：

```
Authorization: Bearer <token>
```

### Token 过期

Token 默认有效期为 7 天，过期后需要重新登录获取新的 Token。

## 安全说明

1. **密码加密**：所有密码使用 bcrypt 进行哈希处理（成本因子 10）
2. **Token 安全**：Token 存储在客户端，建议使用 HTTP-only Cookie 或安全的存储方式
3. **HTTPS**：生产环境必须使用 HTTPS 传输

## 使用示例

### JavaScript/TypeScript

```typescript
// 注册
const registerResponse = await fetch('http://localhost:4000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    username: 'username',
    password: 'password123',
  }),
});

const registerData = await registerResponse.json();
const token = registerData.token;

// 登录
const loginResponse = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    usernameOrEmail: 'username',
    password: 'password123',
  }),
});

const loginData = await loginResponse.json();
const token = loginData.token;

// 使用 Token 访问需要认证的接口
const protectedResponse = await fetch('http://localhost:4000/api/checkin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});
```

---

## 用户管理接口

### 1. 获取当前用户信息

**接口**：`GET /api/users/me`

**描述**：获取当前登录用户的基本信息

**认证**：需要（Bearer Token）

**请求参数**：无

**响应示例**（200 OK）：

```json
{
  "id": "1",
  "email": "user@example.com",
  "username": "username",
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**错误响应**：

- `401 Unauthorized`：未提供有效的 Token 或 Token 已过期

### 2. 获取当前用户资料

**接口**：`GET /api/users/me/profile`

**描述**：获取当前登录用户的详细资料信息（包括积分、等级、段位等）

**认证**：需要（Bearer Token）

**请求参数**：无

**响应示例**（200 OK）：

```json
{
  "id": "1",
  "userId": "1",
  "nickname": "用户昵称",
  "avatar": "https://example.com/avatar.jpg",
  "bio": "个人简介",
  "totalPoints": 1000,
  "currentLevel": 5,
  "currentExp": 500,
  "nextLevelExp": 1000,
  "consecutiveCheckInDays": 7,
  "totalCheckInDays": 30,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**错误响应**：

- `401 Unauthorized`：未提供有效的 Token 或 Token 已过期
- `404 Not Found`：用户资料不存在

**使用示例**：

```javascript
// 获取当前用户信息
const userResponse = await fetch('http://localhost:4000/api/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
const userData = await userResponse.json();

// 获取当前用户资料
const profileResponse = await fetch('http://localhost:4000/api/users/me/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
const profileData = await profileResponse.json();
```

---

**最后更新时间**：2026-01-02 23:13:17

