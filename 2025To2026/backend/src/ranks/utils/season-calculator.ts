/**
 * 赛季计算工具
 * 
 * @description 计算当前赛季数、赛季时间范围等
 * 赛季累加机制：从 2026 年 1 月 1 日开始，每半年一个赛季
 */

/**
 * 第一赛季开始日期
 * 
 * @description 2026 年 1 月 1 日 00:00:00
 */
export const FIRST_SEASON_START_DATE = new Date('2026-01-01T00:00:00.000Z')

/**
 * 每个赛季的月数
 */
export const SEASON_MONTHS = 6

/**
 * 计算当前赛季数
 * 
 * @description 根据当前日期计算当前是第几个赛季
 * 赛季累加机制：从第一赛季开始，每 6 个月一个赛季
 * 
 * @param currentDate 当前日期（可选，默认为当前时间）
 * @returns 当前赛季数（从 1 开始）
 * 
 * @example
 * ```typescript
 * calculateCurrentSeason() // 如果当前是 2026-01-15，返回 1
 * calculateCurrentSeason(new Date('2026-07-15')) // 返回 2
 * calculateCurrentSeason(new Date('2027-01-15')) // 返回 3
 * ```
 */
export function calculateCurrentSeason(
  currentDate: Date = new Date()
): number {
  // 计算从第一赛季开始到现在的月份差
  const monthsDiff =
    (currentDate.getFullYear() - FIRST_SEASON_START_DATE.getFullYear()) * 12 +
    (currentDate.getMonth() - FIRST_SEASON_START_DATE.getMonth())

  // 每 6 个月一个赛季，从 1 开始
  const season = Math.floor(monthsDiff / SEASON_MONTHS) + 1

  return season
}

/**
 * 获取赛季的开始和结束日期
 * 
 * @description 根据赛季数计算该赛季的开始和结束日期
 * 
 * @param season 赛季数（从 1 开始）
 * @returns 赛季的开始和结束日期
 * 
 * @example
 * ```typescript
 * getSeasonDateRange(1) // { start: 2026-01-01, end: 2026-06-30 }
 * getSeasonDateRange(2) // { start: 2026-07-01, end: 2026-12-31 }
 * ```
 */
export function getSeasonDateRange(season: number): {
  start: Date
  end: Date
} {
  // 计算赛季开始的月份偏移（每赛季 6 个月）
  const monthOffset = (season - 1) * SEASON_MONTHS

  // 赛季开始日期
  const seasonStart = new Date(FIRST_SEASON_START_DATE)
  seasonStart.setMonth(seasonStart.getMonth() + monthOffset)
  seasonStart.setDate(1) // 每月 1 日
  seasonStart.setHours(0, 0, 0, 0)

  // 赛季结束日期（6 个月后）
  const seasonEnd = new Date(seasonStart)
  seasonEnd.setMonth(seasonEnd.getMonth() + SEASON_MONTHS)
  seasonEnd.setDate(0) // 上个月的最后一天（即当前月的最后一天）
  seasonEnd.setHours(23, 59, 59, 999)

  return {
    start: seasonStart,
    end: seasonEnd,
  }
}

/**
 * 检查日期是否在赛季范围内
 * 
 * @description 检查指定日期是否在指定赛季的时间范围内
 * 
 * @param date 要检查的日期
 * @param season 赛季数
 * @returns 是否在赛季范围内
 */
export function isDateInSeason(date: Date, season: number): boolean {
  const { start, end } = getSeasonDateRange(season)
  return date >= start && date <= end
}

/**
 * 获取日期所在的赛季
 * 
 * @description 根据日期计算该日期所在的赛季数
 * 
 * @param date 日期
 * @returns 赛季数
 */
export function getSeasonByDate(date: Date): number {
  return calculateCurrentSeason(date)
}

