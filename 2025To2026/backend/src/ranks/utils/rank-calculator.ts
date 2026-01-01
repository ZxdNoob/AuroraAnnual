import { RANK_DATA, LEGENDARY_RANK_LEVEL, LEGENDARY_MAX_STARS } from './rank-data'

/**
 * 段位计算工具
 * 
 * @description 处理段位晋升、降级、升星等计算逻辑
 */

/**
 * 检查是否可以升星
 * 
 * @description 检查当前段位和星级是否可以继续升星
 * 
 * @param rankLevel 段位等级（1-13）
 * @param currentStars 当前星级
 * @param maxStars 最大星级
 * @returns 是否可以升星
 */
export function canUpgradeStar(
  rankLevel: number,
  currentStars: number,
  maxStars: number
): boolean {
  // 传奇王者特殊处理：无上限升星
  if (rankLevel === LEGENDARY_RANK_LEVEL || maxStars >= LEGENDARY_MAX_STARS) {
    return true // 传奇王者可以无限升星
  }

  // 其他段位：检查是否达到最大星级
  return currentStars < maxStars
}

/**
 * 检查是否可以晋升到下一段位
 * 
 * @description 检查是否满足晋升到下一段位的条件
 * 
 * @param rankLevel 当前段位等级
 * @param currentStars 当前星级
 * @param maxStars 当前段位最大星级
 * @param checkInCount 当前段位打卡次数
 * @param requiredCheckIns 晋升所需打卡次数
 * @returns 是否可以晋升
 */
export function canUpgradeRank(
  rankLevel: number,
  currentStars: number,
  maxStars: number,
  checkInCount: number,
  requiredCheckIns: number
): boolean {
  // 传奇王者不能晋升（已经是最高段位）
  if (rankLevel === LEGENDARY_RANK_LEVEL) {
    return false
  }

  // 必须达到当前段位的最大星级
  if (currentStars < maxStars) {
    return false
  }

  // 检查是否达到晋升所需打卡次数
  return checkInCount >= requiredCheckIns
}

/**
 * 计算升星所需打卡次数
 * 
 * @description 计算从当前星级升到下一星级所需的打卡次数
 * 每星需要 10 次打卡
 * 
 * @param currentStars 当前星级
 * @returns 升星所需打卡次数
 */
export function getCheckInsForNextStar(currentStars: number): number {
  // 每星需要 10 次打卡
  return (currentStars + 1) * 10
}

/**
 * 计算段位继承后的段位和星级
 * 
 * @description 计算新赛季段位继承，参考王者荣耀和英雄联盟的继承机制
 * 降段规则：降一个段位等级
 * 传奇王者特殊处理：星级降为一半，最少 1 星
 * 
 * @param lastSeasonRankLevel 上赛季段位等级
 * @param lastSeasonStars 上赛季星级
 * @returns 新赛季起始段位等级和星级
 */
export function calculateSeasonInheritance(
  lastSeasonRankLevel: number,
  lastSeasonStars: number
): { rankLevel: number; stars: number } {
  // 降段规则：降一个段位等级
  const newRankLevel = Math.max(1, lastSeasonRankLevel - 1)

  // 查找新段位数据
  const newRankData = RANK_DATA.find((rank) => rank.level === newRankLevel)

  if (!newRankData) {
    // 如果找不到段位数据，返回最低段位
    return { rankLevel: 1, stars: 1 }
  }

  // 传奇王者特殊处理
  if (lastSeasonRankLevel === LEGENDARY_RANK_LEVEL) {
    // 传奇王者在新赛季仍然是传奇王者，但星级可能降低
    // 例如：上赛季传奇王者 100 星，新赛季传奇王者 50 星
    const newStars = Math.max(1, Math.floor(lastSeasonStars * 0.5)) // 降为一半，最少 1 星
    return {
      rankLevel: LEGENDARY_RANK_LEVEL, // 传奇王者仍然是传奇王者
      stars: newStars,
    }
  }

  // 其他段位：保持相同星级，但不能超过新段位的最大星级
  let newStars = lastSeasonStars
  if (newStars > newRankData.maxStars) {
    // 如果新段位的最大星级小于上赛季星级，则降为新段位的最大星级
    newStars = newRankData.maxStars
  }

  return {
    rankLevel: newRankLevel,
    stars: newStars,
  }
}

/**
 * 计算长期不打卡导致的段位降级
 * 
 * @description 如果用户长期不打卡，段位会自动降级
 * 降段规则：每相隔 1 个月不打卡，就降一个段位
 * 
 * @param lastCheckInDate 最后打卡日期
 * @param currentRankLevel 当前段位等级
 * @param currentDate 当前日期（可选，默认为当前时间）
 * @returns 降级后的段位等级（不能低于 1）
 */
export function calculateRankDowngrade(
  lastCheckInDate: Date,
  currentRankLevel: number,
  currentDate: Date = new Date()
): number {
  // 计算从最后打卡日期到现在的月份差
  const monthsSinceLastCheckIn =
    (currentDate.getFullYear() - lastCheckInDate.getFullYear()) * 12 +
    (currentDate.getMonth() - lastCheckInDate.getMonth())

  // 每 1 个月降一个段位
  const downgradeLevels = Math.floor(monthsSinceLastCheckIn)

  // 计算新段位等级（不能低于 1）
  const newLevel = Math.max(1, currentRankLevel - downgradeLevels)

  return newLevel
}

/**
 * 获取段位数据
 * 
 * @description 根据段位等级获取段位数据
 * 
 * @param level 段位等级
 * @returns 段位数据，如果不存在返回 null
 */
export function getRankDataByLevel(level: number) {
  return RANK_DATA.find((rank) => rank.level === level) || null
}

/**
 * 获取下一段位数据
 * 
 * @description 根据当前段位等级获取下一段位的数据
 * 
 * @param currentLevel 当前段位等级
 * @returns 下一段位数据，如果已经是最高段位返回 null
 */
export function getNextRankData(currentLevel: number) {
  if (currentLevel >= LEGENDARY_RANK_LEVEL) {
    return null // 已经是最高段位
  }

  return RANK_DATA.find((rank) => rank.level === currentLevel + 1) || null
}

