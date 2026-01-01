# JWT 认证学习笔记

## 概述

JWT (JSON Web Token) 是一种无状态的认证机制，常用于前后端分离的应用中。

## JWT 结构

JWT 由三部分组成，用 `.` 分隔：

```
Header.Payload.Signature
```

### 1. Header（头部）

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

### 2. Payload（载荷）

```json
{
  "userId": "1",
  "email": "user@example.com",
  "exp": 1735689600
}
```

### 3. Signature（签名）

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

## 工作流程

1. 用户登录，服务器验证凭据
2. 服务器生成 JWT Token
3. 客户端存储 Token（localStorage 或 Cookie）
4. 后续请求在 Header 中携带 Token
5. 服务器验证 Token 并处理请求

## 安全考虑

1. **Token 存储**：建议使用 HTTP-only Cookie
2. **Token 过期**：设置合理的过期时间
3. **HTTPS**：生产环境必须使用 HTTPS
4. **密钥管理**：使用强密钥，不要硬编码

## 实现示例

### 生成 Token

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: '1', email: 'user@example.com' },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

### 验证 Token

```typescript
import jwt from 'jsonwebtoken';

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // decoded 包含用户信息
} catch (error) {
  // Token 无效
}
```

## 参考资料

- [JWT.io](https://jwt.io)
- [JWT 规范](https://tools.ietf.org/html/rfc7519)

---

**最后更新时间**：2026-01-01 14:46:07

