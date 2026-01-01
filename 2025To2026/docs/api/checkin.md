# 打卡 API 文档

## 概述

打卡模块提供用户打卡功能和打卡历史记录查询。

**路径前缀**：`/api/checkin`

**认证**：所有接口都需要 JWT 认证

## 接口列表

### 1. 用户打卡

**接口**：`POST /api/checkin`

**描述**：用户进行打卡操作，系统会自动计算积分、经验值，并检查段位晋升和勋章获取

**认证**：需要

**请求头**：

```
Authorization: Bearer <token>
```

**响应示例**（201 Created）：

```json
{
  "message": "打卡成功",
  "data": {
    "checkInId": "1",
    "userId": "1",
    "checkInDate": "2026-01-01T00:00:00.000Z",
    "points": 6,
    "experience": 13,
    "consecutiveDays": 1,
    "levelUp": false,
    "newLevel": null,
    "rankPromoted": false,
    "newRank": null,
    "badgesEarned": []
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| checkInId | string | 打卡记录 ID |
| userId | string | 用户 ID |
| checkInDate | string | 打卡日期（ISO 8601 格式） |
| points | number | 本次打卡获得的积分 |
| experience | number | 本次打卡获得的经验值 |
| consecutiveDays | number | 连续打卡天数 |
| levelUp | boolean | 是否升级 |
| newLevel | number \| null | 新等级（如果升级） |
| rankPromoted | boolean | 是否段位晋升 |
| newRank | object \| null | 新段位信息（如果晋升） |
| badgesEarned | array | 本次获得的勋章列表 |

**错误响应**：

- **400 Bad Request**：今日已打卡
  ```json
  {
    "statusCode": 400,
    "message": "今日已打卡",
    "error": "Bad Request"
  }
  ```

- **401 Unauthorized**：未认证或 Token 无效
  ```json
  {
    "statusCode": 401,
    "message": "Unauthorized",
    "error": "Unauthorized"
  }
  ```

### 2. 获取打卡记录

**接口**：`GET /api/checkin/history`

**描述**：获取用户的打卡历史记录，支持分页

**认证**：需要

**请求头**：

```
Authorization: Bearer <token>
```

**查询参数**：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码（从 1 开始） |
| limit | number | 否 | 20 | 每页数量（最大 100） |

**响应示例**（200 OK）：

```json
{
  "data": [
    {
      "id": "1",
      "userId": "1",
      "checkInDate": "2026-01-01T00:00:00.000Z",
      "points": 6,
      "experience": 13,
      "consecutiveDays": 1,
      "createdAt": "2026-01-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "userId": "1",
      "checkInDate": "2025-12-31T00:00:00.000Z",
      "points": 5,
      "experience": 10,
      "consecutiveDays": 1,
      "createdAt": "2025-12-31T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2,
    "totalPages": 1
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data | array | 打卡记录列表 |
| pagination | object | 分页信息 |
| pagination.page | number | 当前页码 |
| pagination.limit | number | 每页数量 |
| pagination.total | number | 总记录数 |
| pagination.totalPages | number | 总页数 |

## 积分计算规则

打卡获得的积分计算公式：

```
积分 = 5 + min(连续打卡天数, 10)
```

**示例**：

- 连续打卡 1 天：5 + 1 = 6 分
- 连续打卡 5 天：5 + 5 = 10 分
- 连续打卡 10 天：5 + 10 = 15 分
- 连续打卡 20 天：5 + 10 = 15 分（最多 10 分加成）

## 经验值计算规则

打卡获得的经验值计算公式：

```
经验值 = 10 + 连续登录天数 + (连续打卡天数 * 2)
```

**示例**：

- 连续登录 1 天，连续打卡 1 天：10 + 1 + 2 = 13 经验值
- 连续登录 5 天，连续打卡 5 天：10 + 5 + 10 = 25 经验值
- 连续登录 10 天，连续打卡 10 天：10 + 10 + 20 = 40 经验值

## 自动功能

打卡时会自动执行以下操作：

1. **计算积分和经验值**：根据连续打卡天数计算
2. **检查等级提升**：如果经验值达到下一级要求，自动升级
3. **检查段位晋升**：如果打卡次数达到段位晋升要求，自动晋升
4. **检查勋章获取**：自动检查并授予符合条件的勋章

## 使用示例

### JavaScript/TypeScript

```typescript
// 打卡
const checkInResponse = await fetch('http://localhost:4000/api/checkin', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

const checkInData = await checkInResponse.json();
console.log('打卡成功，获得积分：', checkInData.data.points);
console.log('获得经验值：', checkInData.data.experience);
console.log('连续打卡天数：', checkInData.data.consecutiveDays);

// 获取打卡历史
const historyResponse = await fetch('http://localhost:4000/api/checkin/history?page=1&limit=20', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});

const historyData = await historyResponse.json();
console.log('打卡记录：', historyData.data);
console.log('总记录数：', historyData.pagination.total);
```

---

**最后更新时间**：2026-01-01 14:46:07

