/**
 * 段位数据初始化脚本
 * 
 * @description 用于初始化数据库中的段位数据
 * 使用方法：在应用启动时调用，或作为独立脚本运行
 * 
 * @example
 * ```typescript
 * // 在应用启动时初始化
 * const ranksService = app.get(RanksService);
 * await ranksService.initializeRanks();
 * ```
 */

import { PrismaClient } from '@prisma/client'
import { RANK_DATA } from '../utils/rank-data'
import { calculateCurrentSeason } from '../utils/season-calculator'

const prisma = new PrismaClient()

/**
 * 初始化段位数据
 * 
 * @description 创建所有段位的基础数据
 */
async function initRanks() {
  const currentSeason = calculateCurrentSeason()

  console.log(`开始初始化第 ${currentSeason} 赛季的段位数据...`)

  // 检查段位数据是否已存在
  const existingRanks = await prisma.rank.findMany({
    where: { season: currentSeason },
  })

  if (existingRanks.length > 0) {
    console.log(`第 ${currentSeason} 赛季的段位数据已存在，跳过初始化`)
    return
  }

  // 创建所有段位数据
  for (const rankData of RANK_DATA) {
    await prisma.rank.create({
      data: {
        name: rankData.name,
        level: rankData.level,
        minStars: rankData.minStars,
        maxStars: rankData.maxStars,
        requiredCheckIns: rankData.requiredCheckIns,
        season: currentSeason,
      },
    })
    console.log(`✓ 创建段位：${rankData.name} (等级 ${rankData.level})`)
  }

  console.log(`✅ 段位数据初始化完成！`)
}

// 如果作为脚本直接运行
if (require.main === module) {
  initRanks()
    .catch((error) => {
      console.error('段位数据初始化失败：', error)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
}

export { initRanks }

