/**
 * 积分计算工具
 * 
 * @description 计算打卡获得的积分
 * 算法：基础积分 5 分 + 连续打卡加成（最多 10 分）
 * 公式：积分 = 5 + min(连续天数, 10)
 */

/**
 * 计算打卡积分
 * 
 * @description 根据连续打卡天数计算积分
 * - 基础积分：5 分
 * - 连续打卡加成：连续天数，最多 10 分
 * - 总积分 = 5 + min(连续天数, 10)
 * 
 * @param consecutiveDays 连续打卡天数
 * @returns 积分数量
 * 
 * @example
 * ```typescript
 * calculateCheckInPoints(1)  // 6 (5 + 1)
 * calculateCheckInPoints(5)  // 10 (5 + 5)
 * calculateCheckInPoints(10) // 15 (5 + 10)
 * calculateCheckInPoints(20) // 15 (5 + 10，最多 10 分加成)
 * ```
 */
export function calculateCheckInPoints(consecutiveDays: number): number {
  // 基础积分
  const basePoints = 5

  // 连续打卡加成（最多 10 分）
  const bonusPoints = Math.min(consecutiveDays, 10)

  return basePoints + bonusPoints
}

