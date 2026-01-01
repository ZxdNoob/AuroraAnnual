/**
 * 段位数据定义
 * 
 * @description 定义所有段位的基础数据
 * 包括段位名称、等级、星级范围、晋升所需打卡次数等
 */

/**
 * 段位数据接口
 */
export interface RankData {
  name: string
  level: number
  minStars: number
  maxStars: number
  requiredCheckIns: number
}

/**
 * 所有段位数据
 * 
 * @description 13 个段位等级的数据定义
 * - 倔强黑铁：1-2 星
 * - 不屈白银：1-3 星
 * - 黄金及以后：1-5 星
 * - 传奇王者：无上限（使用 999999 表示）
 */
export const RANK_DATA: RankData[] = [
  {
    name: '倔强黑铁',
    level: 1,
    minStars: 1,
    maxStars: 2,
    requiredCheckIns: 10, // 晋升到不屈白银所需打卡次数
  },
  {
    name: '不屈白银',
    level: 2,
    minStars: 1,
    maxStars: 3,
    requiredCheckIns: 20, // 晋升到黄金所需打卡次数
  },
  {
    name: '黄金',
    level: 3,
    minStars: 1,
    maxStars: 5, // 从黄金开始，都是 5 星
    requiredCheckIns: 30,
  },
  {
    name: '白金',
    level: 4,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 40,
  },
  {
    name: '钻石',
    level: 5,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 50,
  },
  {
    name: '星耀',
    level: 6,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 60,
  },
  {
    name: '不凡大师',
    level: 7,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 70,
  },
  {
    name: '宗师',
    level: 8,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 80,
  },
  {
    name: '最强王者',
    level: 9,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 90,
  },
  {
    name: '非凡王者',
    level: 10,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 100,
  },
  {
    name: '至圣王者',
    level: 11,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 110,
  },
  {
    name: '荣耀王者',
    level: 12,
    minStars: 1,
    maxStars: 5,
    requiredCheckIns: 120,
  },
  {
    name: '传奇王者',
    level: 13,
    minStars: 1,
    maxStars: 999999, // 无上限，使用很大的数字表示
    requiredCheckIns: 0, // 传奇王者不会晋升，所以不需要打卡次数
  },
]

/**
 * 传奇王者等级常量
 * 
 * @description 用于判断是否为传奇王者
 */
export const LEGENDARY_RANK_LEVEL = 13

/**
 * 传奇王者最大星级常量
 * 
 * @description 用于表示传奇王者无上限
 */
export const LEGENDARY_MAX_STARS = 999999

