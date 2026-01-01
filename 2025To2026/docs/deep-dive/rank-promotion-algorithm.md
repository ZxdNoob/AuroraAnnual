# 段位晋升算法原理

## 概述

段位晋升算法用于计算用户的段位晋升，包括升星和晋升到下一段位。

## 段位系统

### 段位等级（13 级）

1. 倔强黑铁（1-2 星）
2. 不屈白银（1-3 星）
3. 黄金（1-5 星）
4. 白金（1-5 星）
5. 钻石（1-5 星）
6. 星耀（1-5 星）
7. 不凡大师（1-5 星）
8. 宗师（1-5 星）
9. 最强王者（1-5 星）
10. 非凡王者（1-5 星）
11. 至圣王者（1-5 星）
12. 荣耀王者（1-5 星）
13. 传奇王者（无上限，1 星到 n 星）

## 晋升规则

### 升星规则

- 每个段位有独立的星级系统
- 每星需要 **10 次打卡**
- 达到最大星级后，需要额外打卡次数才能晋升

### 晋升规则

- 达到当前段位的最大星级
- 达到晋升所需的打卡次数
- 晋升到下一段位，星级重置为 1 星

### 降段规则

- **长期不打卡**：每 1 个月降一个段位
- **赛季继承**：赛季结束后，段位继承（降一个段位等级）

## 算法实现

### 升星检查

```typescript
function checkStarPromotion(
  currentStars: number,
  maxStars: number,
  checkInCount: number
): boolean {
  // 每星需要 10 次打卡
  const starsNeeded = (currentStars + 1) * 10;
  return checkInCount >= starsNeeded && currentStars < maxStars;
}
```

### 段位晋升检查

```typescript
function checkRankPromotion(
  currentRank: Rank,
  checkInCount: number
): boolean {
  // 达到最大星级
  if (currentRank.stars < currentRank.maxStars) {
    return false;
  }
  
  // 达到晋升所需打卡次数
  const promotionCheckIns = currentRank.promotionCheckIns;
  return checkInCount >= promotionCheckIns;
}
```

## 设计考虑

1. **渐进式成长**：通过升星和晋升，让用户有持续的成长感
2. **平衡性**：不同段位的升星和晋升难度不同
3. **激励性**：通过段位系统激励用户持续打卡

## 参考资料

- [段位模块源码](../../backend/src/ranks/)
- [段位系统文档](../features/rank-system.md)

---

**最后更新时间**：2026-01-01 14:46:07

