# 段位系统详细说明

## 段位等级体系

### 段位等级列表（13 级）

| 等级 | 段位名称 | 星级范围 | 说明 |
| :--- | :--- | :--- | :--- |
| 1 | 倔强黑铁 | 1-2 星 | 初始段位，最高 2 星 |
| 2 | 不屈白银 | 1-3 星 | 第二个段位，最高 3 星 |
| 3 | 黄金 | 1-5 星 | 从黄金开始，所有段位都是 1-5 星 |
| 4 | 白金 | 1-5 星 | 1-5 星 |
| 5 | 钻石 | 1-5 星 | 1-5 星 |
| 6 | 星耀 | 1-5 星 | 1-5 星 |
| 7 | 不凡大师 | 1-5 星 | 1-5 星 |
| 8 | 宗师 | 1-5 星 | 1-5 星 |
| 9 | 最强王者 | 1-5 星 | 1-5 星 |
| 10 | 非凡王者 | 1-5 星 | 1-5 星 |
| 11 | 至圣王者 | 1-5 星 | 1-5 星 |
| 12 | 荣耀王者 | 1-5 星 | 1-5 星 |
| 13 | 传奇王者 | 无上限（1 星到 n 星） | 最高段位，星级无上限 |

### 段位星级规则

1. **倔强黑铁**：1-2 星
   - 1 星 → 2 星 → 晋升到不屈白银

2. **不屈白银**：1-3 星
   - 1 星 → 2 星 → 3 星 → 晋升到黄金

3. **黄金及以后**：1-5 星
   - 从黄金开始，所有段位都是 1-5 星
   - 1 星 → 2 星 → 3 星 → 4 星 → 5 星 → 晋升到下一段位

4. **传奇王者**：无上限
   - 传奇王者是最高段位，星级无上限
   - 可以从 1 星一直升到 n 星（n 可以是任意正整数）
   - 不会晋升到更高段位（因为已经是最高段位）

## 段位数据初始化

### Prisma Schema 中的段位数据

在数据库初始化时，需要创建以下段位数据：

```typescript
const ranks = [
  {
    name: '倔强黑铁',
    level: 1,
    minStars: 1,
    maxStars: 2,
    requiredCheckIns: 10, // 晋升到不屈白银所需打卡次数
    season: 1,
  },
  {
    name: '不屈白银',
    level: 2,
    minStars: 1,
    maxStars: 3,
    requiredCheckIns: 20, // 晋升到黄金所需打卡次数
    season: 1,
  },
  {
    name: '黄金',
    level: 3,
    minStars: 1,
    maxStars: 5, // 从黄金开始，都是 5 星
    requiredCheckIns: 30,
    season: 1,
  },
  {
    name: '白金',
    level: 4,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 40,
    season: 1,
  },
  {
    name: '钻石',
    level: 5,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 50,
    season: 1,
  },
  {
    name: '星耀',
    level: 6,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 60,
    season: 1,
  },
  {
    name: '不凡大师',
    level: 7,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 70,
    season: 1,
  },
  {
    name: '宗师',
    level: 8,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 80,
    season: 1,
  },
  {
    name: '最强王者',
    level: 9,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 90,
    season: 1,
  },
  {
    name: '非凡王者',
    level: 10,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 100,
    season: 1,
  },
  {
    name: '至圣王者',
    level: 11,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 110,
    season: 1,
  },
  {
    name: '荣耀王者',
    level: 12,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 120,
    season: 1,
  },
  {
    name: '传奇王者',
    level: 13,
    minStars: 1,
    maxStars: 999999, // 无上限，使用一个很大的数字表示无上限
    requiredCheckIns: 0, // 传奇王者不会晋升，所以不需要打卡次数
    season: 1,
  },
]
```

### 传奇王者的特殊处理

传奇王者是最高段位，需要特殊处理：

1. **maxStars 设置**：
   - 在数据库中，可以使用一个很大的数字（如 999999）表示无上限
   - 在代码中，需要特殊判断：如果 `maxStars >= 999999` 或 `level === 13`，则视为无上限

2. **晋升逻辑**：
   - 传奇王者不会晋升到更高段位（因为已经是最高段位）
   - 传奇王者可以无限升星（1 星 → 2 星 → ... → n 星）

3. **升星逻辑**：
   ```typescript
   function canUpgradeStar(rank: Rank, currentStars: number): boolean {
     // 传奇王者特殊处理：无上限
     if (rank.level === 13 || rank.maxStars >= 999999) {
       return true // 传奇王者可以无限升星
     }
     
     // 其他段位：检查是否达到最大星级
     return currentStars < rank.maxStars
   }
   ```

## 段位晋升算法

### 升星条件

每个段位内的升星需要满足以下条件：

```typescript
/**
 * 检查是否可以升星
 * @param currentRank 当前段位
 * @param currentStars 当前星级
 * @param checkInCount 当前段位打卡次数
 * @returns 是否可以升星
 */
function canUpgradeStar(
  currentRank: Rank,
  currentStars: number,
  checkInCount: number
): boolean {
  // 传奇王者特殊处理：无上限升星
  if (currentRank.level === 13 || currentRank.maxStars >= 999999) {
    // 传奇王者可以无限升星，每星需要固定打卡次数（如 10 次）
    return checkInCount >= (currentStars * 10)
  }
  
  // 其他段位：检查是否达到最大星级
  if (currentStars >= currentRank.maxStars) {
    return false // 已达到最大星级，不能继续升星
  }
  
  // 检查是否达到升星所需打卡次数（每星需要 10 次打卡）
  return checkInCount >= (currentStars * 10)
}
```

### 晋升到下一段位

当达到当前段位的最大星级并满足晋升条件时，可以晋升到下一段位：

```typescript
/**
 * 检查是否可以晋升到下一段位
 * @param currentRank 当前段位
 * @param currentStars 当前星级
 * @param checkInCount 当前段位打卡次数
 * @returns 是否可以晋升
 */
function canUpgradeRank(
  currentRank: Rank,
  currentStars: number,
  checkInCount: number
): boolean {
  // 传奇王者不能晋升（已经是最高段位）
  if (currentRank.level === 13) {
    return false
  }
  
  // 必须达到当前段位的最大星级
  if (currentStars < currentRank.maxStars) {
    return false
  }
  
  // 检查是否达到晋升所需打卡次数
  return checkInCount >= currentRank.requiredCheckIns
}
```

## 段位降级机制

### 长期不打卡降段

如果用户长期不打卡，段位会自动降级：

- **降段规则**：每相隔 1 个月不打卡，就降一个段位
- **降段逻辑**：
  ```typescript
  /**
   * 计算因长期不打卡导致的段位降级
   * @param lastCheckInDate 最后打卡日期
   * @param currentRank 当前段位
   * @returns 降级后的段位等级
   */
  function calculateRankDowngrade(
    lastCheckInDate: Date,
    currentRank: Rank
  ): number {
    const now = new Date()
    const monthsSinceLastCheckIn = 
      (now.getFullYear() - lastCheckInDate.getFullYear()) * 12 +
      (now.getMonth() - lastCheckInDate.getMonth())
    
    // 每 1 个月降一个段位
    const downgradeLevels = Math.floor(monthsSinceLastCheckIn)
    
    // 计算新段位等级（不能低于 1）
    const newLevel = Math.max(1, currentRank.level - downgradeLevels)
    
    return newLevel
  }
  ```

## 赛季系统

### 赛季累加机制

赛季数一直累加，不会重置。每半年一个赛季，赛季数持续累加。

### 赛季时间

- **第一赛季**：2026 年 1 月 1 日 - 2026 年 6 月 30 日
- **第二赛季**：2026 年 7 月 1 日 - 2026 年 12 月 31 日
- **第三赛季**：2027 年 1 月 1 日 - 2027 年 6 月 30 日
- **第四赛季**：2027 年 7 月 1 日 - 2027 年 12 月 31 日
- **依此类推**：每半年一个赛季，赛季数持续累加

### 赛季计算逻辑

```typescript
/**
 * 计算当前赛季数
 * @param startDate 第一赛季开始日期（2026-01-01）
 * @param currentDate 当前日期
 * @returns 当前赛季数
 */
function calculateCurrentSeason(
  startDate: Date,
  currentDate: Date
): number {
  // 计算从第一赛季开始到现在的月份差
  const monthsDiff = 
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth())
  
  // 每 6 个月一个赛季，从 1 开始
  const season = Math.floor(monthsDiff / 6) + 1
  
  return season
}

/**
 * 获取赛季的开始和结束日期
 * @param season 赛季数
 * @param startDate 第一赛季开始日期（2026-01-01）
 * @returns 赛季的开始和结束日期
 */
function getSeasonDateRange(
  season: number,
  startDate: Date
): { start: Date; end: Date } {
  // 计算赛季开始的月份偏移（每赛季 6 个月）
  const monthOffset = (season - 1) * 6
  
  // 赛季开始日期
  const seasonStart = new Date(startDate)
  seasonStart.setMonth(seasonStart.getMonth() + monthOffset)
  seasonStart.setDate(1) // 每月 1 日
  
  // 赛季结束日期（6 个月后）
  const seasonEnd = new Date(seasonStart)
  seasonEnd.setMonth(seasonEnd.getMonth() + 6)
  seasonEnd.setDate(0) // 上个月的最后一天（即当前月的最后一天）
  
  return {
    start: seasonStart,
    end: seasonEnd,
  }
}
```

### 段位继承机制

赛季结束后，段位会继承到新赛季，但有降段机制：

```typescript
/**
 * 计算新赛季段位继承
 * @param lastSeasonRank 上赛季段位
 * @param lastSeasonStars 上赛季星级
 * @returns 新赛季起始段位和星级
 */
function calculateSeasonInheritance(
  lastSeasonRank: Rank,
  lastSeasonStars: number
): { rank: Rank; stars: number } {
  // 降段规则：降一个段位等级
  const newLevel = Math.max(1, lastSeasonRank.level - 1)
  
  // 查找新段位
  const newRank = ranks.find(rank => rank.level === newLevel)
  
  // 星级继承：保持相同星级，但不能超过新段位的最大星级
  let newStars = lastSeasonStars
  if (newRank && newStars > newRank.maxStars) {
    // 如果新段位的最大星级小于上赛季星级，则降为新段位的最大星级
    newStars = newRank.maxStars
  }
  
  // 传奇王者特殊处理：如果上赛季是传奇王者，新赛季也是传奇王者（但星级可能降低）
  if (lastSeasonRank.level === 13) {
    // 传奇王者在新赛季仍然是传奇王者，但星级可能降低
    // 例如：上赛季传奇王者 100 星，新赛季传奇王者 50 星
    newStars = Math.max(1, Math.floor(lastSeasonStars * 0.5)) // 降为一半，最少 1 星
  }
  
  return {
    rank: newRank || lastSeasonRank,
    stars: newStars,
  }
}
```

### 赛季继承示例

- **第一赛季白金 5 星** → **第二赛季黄金 5 星**
- **第二赛季钻石 3 星** → **第三赛季白金 3 星**
- **第三赛季传奇王者 100 星** → **第四赛季传奇王者 50 星**

**注意**：赛季数一直累加，不会重置。每个新赛季开始时，段位会继承并降段。

## 段位系统实现要点

1. **数据库设计**：
   - `Rank` 表中的 `maxStars` 字段用于存储最大星级
   - 传奇王者使用 `maxStars: 999999` 表示无上限

2. **代码实现**：
   - 需要特殊判断传奇王者（`level === 13` 或 `maxStars >= 999999`）
   - 传奇王者可以无限升星，不会晋升到更高段位

3. **UI 显示**：
   - 传奇王者的星级显示为 "传奇王者 n 星"（n 可以是任意正整数）
   - 其他段位显示为 "段位名称 n 星"（n 在 1-maxStars 范围内）

## 总结

- **倔强黑铁**：1-2 星
- **不屈白银**：1-3 星
- **黄金及以后**：1-5 星（从黄金开始，所有段位都是 1-5 星）
- **传奇王者**：无上限（1 星到 n 星）

这样的设计既保持了段位系统的层次感，又给传奇王者提供了无限成长的空间。

