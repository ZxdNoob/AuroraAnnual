# 积分 API 文档

## 概述

积分模块提供积分排行榜、积分统计、积分历史记录等功能。

**路径前缀**：`/api/points`

## 接口列表

### 1. 获取积分排行榜

**接口**：`GET /api/points/leaderboard`

**描述**：获取积分排行榜，按总积分降序排列

**认证**：不需要

**查询参数**：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| page | number | 否 | 1 | 页码（从 1 开始） |
| limit | number | 否 | 10 | 每页数量（最大 100） |

**响应示例**（200 OK）：

```json
{
  "data": [
    {
      "rank": 1,
      "userId": "1",
      "username": "user1",
      "totalPoints": 1000,
      "avatar": "https://example.com/avatar.jpg"
    },
    {
      "rank": 2,
      "userId": "2",
      "username": "user2",
      "totalPoints": 900,
      "avatar": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 2. 获取我的积分统计

**接口**：`GET /api/points/statistics`

**描述**：获取当前用户的积分统计信息

**认证**：需要

**响应示例**（200 OK）：

```json
{
  "totalPoints": 1000,
  "todayPoints": 15,
  "weekPoints": 105,
  "monthPoints": 450,
  "byType": {
    "CHECKIN": 800,
    "LOTTERY": 200
  },
  "trend": [
    { "date": "2026-01-01", "points": 15 },
    { "date": "2025-12-31", "points": 10 }
  ]
}
```

### 3. 获取我的积分历史记录

**接口**：`GET /api/points/history`

**描述**：获取当前用户的积分获取历史记录

**认证**：需要

**查询参数**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码 |
| limit | number | 否 | 每页数量 |
| type | string | 否 | 积分类型筛选 |
| startDate | string | 否 | 开始日期（ISO 8601） |
| endDate | string | 否 | 结束日期（ISO 8601） |

### 4. 获取我的积分排名

**接口**：`GET /api/points/my-rank`

**描述**：获取当前用户在积分排行榜中的排名

**认证**：需要

**响应示例**（200 OK）：

```json
{
  "rank": 10,
  "totalPoints": 1000,
  "totalUsers": 100
}
```

---

**最后更新时间**：2026-01-01 14:46:07

