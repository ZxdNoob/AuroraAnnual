# API 文档概览

## 基本信息

- **API 基础路径**：`/api`
- **API 版本**：0.1.0
- **文档地址**：`http://localhost:4000/api`（Swagger UI）
- **认证方式**：Bearer Token (JWT)

## API 模块

### 1. 认证模块（auth）

- **路径前缀**：`/api/auth`
- **功能**：用户注册、登录
- **详细文档**：[认证 API](./authentication.md)

### 2. 打卡模块（checkin）

- **路径前缀**：`/api/checkin`
- **功能**：用户打卡、打卡历史查询
- **详细文档**：[打卡 API](./checkin.md)

### 3. 积分模块（points）

- **路径前缀**：`/api/points`
- **功能**：积分排行榜、积分统计、积分历史
- **详细文档**：[积分 API](./points.md)

### 4. 段位模块（ranks）

- **路径前缀**：`/api/ranks`
- **功能**：段位信息、段位排行榜
- **详细文档**：[段位 API](./ranks.md)

### 5. 勋章模块（badges）

- **路径前缀**：`/api/badges`
- **功能**：勋章列表、用户勋章、勋章统计
- **详细文档**：[勋章 API](./badges.md)

### 6. 抽奖模块（lottery）

- **路径前缀**：`/api/lottery`
- **功能**：抽奖、抽奖历史、抽奖统计
- **详细文档**：[抽奖 API](./lottery.md)

### 7. 在线编码模块（code）

- **路径前缀**：`/api/code`
- **功能**：文件管理、代码保存
- **详细文档**：[在线编码 API](./code.md)

### 8. 道具模块（items）

- **路径前缀**：`/api/items`
- **功能**：道具列表、道具使用、道具效果
- **详细文档**：[道具 API](./items.md)

### 9. 活动模块（activities）

- **路径前缀**：`/api/activities`
- **功能**：活动管理、活动参与
- **详细文档**：[活动 API](./activities.md)

## 认证说明

### JWT Token 获取

1. 用户注册或登录后，API 会返回 JWT Token
2. 在后续请求中，需要在请求头中携带 Token：
   ```
   Authorization: Bearer <token>
   ```

### 需要认证的接口

大部分接口都需要认证，除了：
- 用户注册（`POST /api/auth/register`）
- 用户登录（`POST /api/auth/login`）
- 部分公开接口（如积分排行榜、段位排行榜等）

## 响应格式

### 成功响应

```json
{
  "data": {},
  "message": "操作成功"
}
```

### 错误响应

```json
{
  "statusCode": 400,
  "message": "错误信息",
  "error": "Bad Request"
}
```

## 状态码说明

- **200**：请求成功
- **201**：创建成功
- **400**：请求参数错误
- **401**：未认证或 Token 无效
- **403**：权限不足
- **404**：资源不存在
- **409**：资源冲突（如邮箱已存在）
- **500**：服务器内部错误

## 分页说明

支持分页的接口使用以下查询参数：

- `page`：页码（从 1 开始，默认 1）
- `limit`：每页数量（默认 10，最大 100）

响应格式：

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 时间格式

所有时间字段使用 ISO 8601 格式：

```
2026-01-01T00:00:00.000Z
```

## 使用 Swagger UI

访问 `http://localhost:4000/api` 可以查看完整的 Swagger API 文档，包括：

- 所有接口的详细说明
- 请求参数和响应格式
- 在线测试接口功能
- 认证 Token 配置

---

**最后更新时间**：2026-01-01 14:46:07

