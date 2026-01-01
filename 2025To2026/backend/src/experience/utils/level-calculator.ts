/**
 * 等级计算工具
 * 
 * @description 计算等级和经验值相关逻辑
 */

/**
 * 计算下一级所需经验值
 * 
 * @description 根据当前等级计算升到下一级所需的总经验值
 * 公式：100 * (level ^ 1.5)
 * 
 * @param currentLevel 当前等级
 * @returns 下一级所需经验值
 * 
 * @example
 * ```typescript
 * calculateNextLevelExp(1)  // 100
 * calculateNextLevelExp(10) // 3162
 * calculateNextLevelExp(20) // 8944
 * ```
 */
export function calculateNextLevelExp(currentLevel: number): number {
  // 等级越高，所需经验值越多
  // 公式：100 * (level ^ 1.5)
  return Math.floor(100 * Math.pow(currentLevel, 1.5))
}

/**
 * 检查是否可以升级
 * 
 * @description 检查当前经验值是否达到升级条件
 * 
 * @param currentExp 当前经验值
 * @param nextLevelExp 下一级所需经验值
 * @returns 是否可以升级
 */
export function canLevelUp(currentExp: number, nextLevelExp: number): boolean {
  return currentExp >= nextLevelExp
}

/**
 * 计算升级后的等级
 * 
 * @description 根据当前经验值计算应该达到的等级
 * 
 * @param totalExp 总经验值（累加不清空）
 * @param startLevel 起始等级（默认 1）
 * @returns 当前等级
 */
export function calculateLevel(totalExp: number, startLevel: number = 1): number {
  let level = startLevel
  let requiredExp = calculateNextLevelExp(level)

  // 如果总经验值达到下一级要求，继续升级
  while (totalExp >= requiredExp) {
    level++
    requiredExp = calculateNextLevelExp(level)
  }

  return level
}

