# 段位 API 文档

## 概述

段位模块提供段位信息查询和段位排行榜功能。

**路径前缀**：`/api/ranks`

## 接口列表

### 1. 获取我的段位信息

**接口**：`GET /api/ranks/my`

**描述**：获取当前登录用户的段位信息

**认证**：需要

**响应示例**（200 OK）：

```json
{
  "userId": "1",
  "rankId": "5",
  "rankName": "钻石",
  "stars": 3,
  "maxStars": 5,
  "season": 1,
  "totalCheckIns": 50,
  "nextPromotionCheckIns": 7
}
```

### 2. 获取段位排行榜

**接口**：`GET /api/ranks/leaderboard`

**描述**：获取当前赛季的段位排行榜

**认证**：不需要

**查询参数**：

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| limit | number | 否 | 100 | 返回数量限制 |

**响应示例**（200 OK）：

```json
{
  "data": [
    {
      "rank": 1,
      "userId": "1",
      "username": "user1",
      "rankName": "传奇王者",
      "stars": 10,
      "totalCheckIns": 200
    }
  ]
}
```

---

**最后更新时间**：2026-01-01 14:46:07

