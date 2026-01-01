# 经验值计算算法原理

## 概述

经验值计算算法用于计算用户打卡时获得的经验值，考虑连续登录和连续打卡的加成。

## 算法公式

```
经验值 = 基础经验值 + 连续登录天数 + (连续打卡天数 * 2)
```

具体实现：

```typescript
经验值 = 10 + 连续登录天数 + (连续打卡天数 * 2)
```

## 算法详解

### 基础经验值

每次打卡的基础经验值固定为 **10 点**。

### 连续登录加成

- 连续登录天数直接加到经验值中
- 鼓励用户每天登录

### 连续打卡加成

- 连续打卡天数乘以 2 后加到经验值中
- 鼓励用户连续打卡，获得更多经验值

### 计算示例

| 连续登录天数 | 连续打卡天数 | 基础经验值 | 登录加成 | 打卡加成 | 总经验值 |
|------------|------------|----------|---------|---------|---------|
| 1 | 1 | 10 | 1 | 2 | 13 |
| 5 | 5 | 10 | 5 | 10 | 25 |
| 10 | 10 | 10 | 10 | 20 | 40 |

## 实现代码

```typescript
function calculateExperience(
  consecutiveLoginDays: number,
  consecutiveCheckInDays: number
): number {
  const baseExperience = 10;
  const loginBonus = consecutiveLoginDays;
  const checkInBonus = consecutiveCheckInDays * 2;
  return baseExperience + loginBonus + checkInBonus;
}
```

## 设计考虑

1. **双重激励**：同时鼓励登录和打卡
2. **打卡权重更高**：打卡加成是登录加成的 2 倍
3. **持续增长**：连续天数越多，经验值越多

## 参考资料

- [打卡模块源码](../../backend/src/checkin/utils/experience-calculator.ts)

---

**最后更新时间**：2026-01-01 14:46:07

