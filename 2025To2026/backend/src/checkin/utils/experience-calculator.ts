/**
 * 经验值计算工具
 * 
 * @description 计算打卡获得的经验值
 * 算法：
 * - 基础经验值：10
 * - 连续登录加成：每天 +1
 * - 连续打卡加成：每天 +2
 * 公式：经验值 = 10 + 连续登录天数 + (连续打卡天数 * 2)
 */

/**
 * 计算经验值
 * 
 * @description 根据连续登录和连续打卡天数计算经验值
 * - 基础经验值：10
 * - 连续登录加成：每天 +1
 * - 连续打卡加成：每天 +2
 * 
 * @param consecutiveLoginDays 连续登录天数
 * @param consecutiveCheckInDays 连续打卡天数
 * @returns 经验值数量
 * 
 * @example
 * ```typescript
 * calculateExperience(1, 1)   // 13 (10 + 1 + 2)
 * calculateExperience(5, 5)   // 25 (10 + 5 + 10)
 * calculateExperience(10, 10) // 40 (10 + 10 + 20)
 * ```
 */
export function calculateExperience(
  consecutiveLoginDays: number,
  consecutiveCheckInDays: number
): number {
  // 基础经验值
  const baseExp = 10

  // 连续登录加成（每天 +1）
  const loginBonus = consecutiveLoginDays

  // 连续打卡加成（每天 +2）
  const checkInBonus = consecutiveCheckInDays * 2

  return baseExp + loginBonus + checkInBonus
}

