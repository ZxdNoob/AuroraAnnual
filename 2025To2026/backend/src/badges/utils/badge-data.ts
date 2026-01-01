import { BadgeType, BadgeRarity } from '@prisma/client'

/**
 * 勋章条件接口
 */
export interface BadgeCondition {
  // 打卡相关
  consecutiveCheckInDays?: number // 连续打卡天数
  totalCheckInDays?: number // 累计打卡天数

  // 登录相关
  consecutiveLoginDays?: number // 连续登录天数
  totalLoginDays?: number // 累计登录天数

  // 等级相关
  level?: number // 达到等级

  // 段位相关
  rankLevel?: number // 达到段位等级
  rankName?: string // 达到段位名称

  // 里程碑相关
  firstTime?: boolean // 首次达成
}

/**
 * 勋章数据接口
 */
export interface BadgeData {
  name: string
  description: string
  icon: string // SVG 图标路径或数据
  type: BadgeType
  condition: BadgeCondition
  rarity: BadgeRarity
}

/**
 * 勋章数据定义
 * 
 * @description 定义所有可获取的勋章及其获取条件
 */
export const BADGE_DATA: BadgeData[] = [
  // ============================================
  // 打卡类勋章
  // ============================================
  {
    name: '初来乍到',
    description: '完成首次打卡',
    icon: 'check-in-first',
    type: 'CHECK_IN',
    condition: { firstTime: true, totalCheckInDays: 1 },
    rarity: 'COMMON',
  },
  {
    name: '坚持不懈',
    description: '连续打卡 7 天',
    icon: 'check-in-7',
    type: 'CHECK_IN',
    condition: { consecutiveCheckInDays: 7 },
    rarity: 'COMMON',
  },
  {
    name: '持之以恒',
    description: '连续打卡 30 天',
    icon: 'check-in-30',
    type: 'CHECK_IN',
    condition: { consecutiveCheckInDays: 30 },
    rarity: 'RARE',
  },
  {
    name: '打卡达人',
    description: '连续打卡 100 天',
    icon: 'check-in-100',
    type: 'CHECK_IN',
    condition: { consecutiveCheckInDays: 100 },
    rarity: 'EPIC',
  },
  {
    name: '打卡之王',
    description: '连续打卡 365 天',
    icon: 'check-in-365',
    type: 'CHECK_IN',
    condition: { consecutiveCheckInDays: 365 },
    rarity: 'LEGENDARY',
  },
  {
    name: '累计打卡 10 次',
    description: '累计打卡 10 次',
    icon: 'check-in-total-10',
    type: 'CHECK_IN',
    condition: { totalCheckInDays: 10 },
    rarity: 'COMMON',
  },
  {
    name: '累计打卡 50 次',
    description: '累计打卡 50 次',
    icon: 'check-in-total-50',
    type: 'CHECK_IN',
    condition: { totalCheckInDays: 50 },
    rarity: 'RARE',
  },
  {
    name: '累计打卡 200 次',
    description: '累计打卡 200 次',
    icon: 'check-in-total-200',
    type: 'CHECK_IN',
    condition: { totalCheckInDays: 200 },
    rarity: 'EPIC',
  },
  {
    name: '累计打卡 1000 次',
    description: '累计打卡 1000 次',
    icon: 'check-in-total-1000',
    type: 'CHECK_IN',
    condition: { totalCheckInDays: 1000 },
    rarity: 'LEGENDARY',
  },

  // ============================================
  // 登录类勋章
  // ============================================
  {
    name: '初次见面',
    description: '完成首次登录',
    icon: 'login-first',
    type: 'LOGIN',
    condition: { firstTime: true, totalLoginDays: 1 },
    rarity: 'COMMON',
  },
  {
    name: '每日相伴',
    description: '连续登录 7 天',
    icon: 'login-7',
    type: 'LOGIN',
    condition: { consecutiveLoginDays: 7 },
    rarity: 'COMMON',
  },
  {
    name: '忠实用户',
    description: '连续登录 30 天',
    icon: 'login-30',
    type: 'LOGIN',
    condition: { consecutiveLoginDays: 30 },
    rarity: 'RARE',
  },
  {
    name: '铁杆粉丝',
    description: '连续登录 100 天',
    icon: 'login-100',
    type: 'LOGIN',
    condition: { consecutiveLoginDays: 100 },
    rarity: 'EPIC',
  },
  {
    name: '永不缺席',
    description: '连续登录 365 天',
    icon: 'login-365',
    type: 'LOGIN',
    condition: { consecutiveLoginDays: 365 },
    rarity: 'LEGENDARY',
  },

  // ============================================
  // 等级类勋章
  // ============================================
  {
    name: '初出茅庐',
    description: '达到 10 级',
    icon: 'level-10',
    type: 'LEVEL',
    condition: { level: 10 },
    rarity: 'COMMON',
  },
  {
    name: '小有所成',
    description: '达到 20 级',
    icon: 'level-20',
    type: 'LEVEL',
    condition: { level: 20 },
    rarity: 'COMMON',
  },
  {
    name: '登堂入室',
    description: '达到 30 级',
    icon: 'level-30',
    type: 'LEVEL',
    condition: { level: 30 },
    rarity: 'RARE',
  },
  {
    name: '炉火纯青',
    description: '达到 50 级',
    icon: 'level-50',
    type: 'LEVEL',
    condition: { level: 50 },
    rarity: 'RARE',
  },
  {
    name: '出类拔萃',
    description: '达到 70 级',
    icon: 'level-70',
    type: 'LEVEL',
    condition: { level: 70 },
    rarity: 'EPIC',
  },
  {
    name: '登峰造极',
    description: '达到 100 级',
    icon: 'level-100',
    type: 'LEVEL',
    condition: { level: 100 },
    rarity: 'LEGENDARY',
  },

  // ============================================
  // 段位类勋章
  // ============================================
  {
    name: '黑铁新星',
    description: '达到倔强黑铁段位',
    icon: 'rank-iron',
    type: 'RANK',
    condition: { rankName: '倔强黑铁' },
    rarity: 'COMMON',
  },
  {
    name: '白银战士',
    description: '达到不屈白银段位',
    icon: 'rank-silver',
    type: 'RANK',
    condition: { rankName: '不屈白银' },
    rarity: 'COMMON',
  },
  {
    name: '黄金荣耀',
    description: '达到黄金段位',
    icon: 'rank-gold',
    type: 'RANK',
    condition: { rankName: '黄金' },
    rarity: 'RARE',
  },
  {
    name: '白金精英',
    description: '达到白金段位',
    icon: 'rank-platinum',
    type: 'RANK',
    condition: { rankName: '白金' },
    rarity: 'RARE',
  },
  {
    name: '钻石大师',
    description: '达到钻石段位',
    icon: 'rank-diamond',
    type: 'RANK',
    condition: { rankName: '钻石' },
    rarity: 'EPIC',
  },
  {
    name: '星耀传说',
    description: '达到星耀段位',
    icon: 'rank-star',
    type: 'RANK',
    condition: { rankName: '星耀' },
    rarity: 'EPIC',
  },
  {
    name: '大师风范',
    description: '达到不凡大师段位',
    icon: 'rank-master',
    type: 'RANK',
    condition: { rankName: '不凡大师' },
    rarity: 'EPIC',
  },
  {
    name: '宗师境界',
    description: '达到宗师段位',
    icon: 'rank-grandmaster',
    type: 'RANK',
    condition: { rankName: '宗师' },
    rarity: 'LEGENDARY',
  },
  {
    name: '王者之巅',
    description: '达到最强王者段位',
    icon: 'rank-challenger',
    type: 'RANK',
    condition: { rankName: '最强王者' },
    rarity: 'LEGENDARY',
  },
  {
    name: '非凡王者',
    description: '达到非凡王者段位',
    icon: 'rank-extraordinary',
    type: 'RANK',
    condition: { rankName: '非凡王者' },
    rarity: 'LEGENDARY',
  },
  {
    name: '至圣王者',
    description: '达到至圣王者段位',
    icon: 'rank-supreme',
    type: 'RANK',
    condition: { rankName: '至圣王者' },
    rarity: 'LEGENDARY',
  },
  {
    name: '荣耀王者',
    description: '达到荣耀王者段位',
    icon: 'rank-glory',
    type: 'RANK',
    condition: { rankName: '荣耀王者' },
    rarity: 'LEGENDARY',
  },
  {
    name: '传奇王者',
    description: '达到传奇王者段位',
    icon: 'rank-legend',
    type: 'RANK',
    condition: { rankName: '传奇王者' },
    rarity: 'LEGENDARY',
  },

  // ============================================
  // 里程碑类勋章
  // ============================================
  {
    name: '首次晋升',
    description: '首次段位晋升',
    icon: 'milestone-first-rank-up',
    type: 'MILESTONE',
    condition: { firstTime: true },
    rarity: 'COMMON',
  },
  {
    name: '等级突破',
    description: '首次达到 20 级',
    icon: 'milestone-level-20',
    type: 'MILESTONE',
    condition: { firstTime: true, level: 20 },
    rarity: 'RARE',
  },
  {
    name: '段位突破',
    description: '首次达到黄金段位',
    icon: 'milestone-rank-gold',
    type: 'MILESTONE',
    condition: { firstTime: true, rankName: '黄金' },
    rarity: 'EPIC',
  },
]

