import { PrizeType } from '@prisma/client'

/**
 * 奖品配置接口
 */
export interface PrizeConfig {
  id: string
  name: string
  type: PrizeType
  value?: number // 奖品价值（红包金额、道具效果值等）
  weight: number // 权重（用于概率计算）
  icon: string // 奖品图标
  description?: string // 奖品描述
}

/**
 * 奖品配置数据
 * 
 * @description 定义所有可抽取的奖品及其权重
 * 权重越高，抽中的概率越大
 * 总权重用于计算概率：概率 = 权重 / 总权重
 */
export const PRIZE_CONFIGS: PrizeConfig[] = [
  // ============================================
  // 红包类奖品
  // ============================================
  {
    id: 'red-packet-1',
    name: '小红包',
    type: 'RED_PACKET',
    value: 10, // 10 积分
    weight: 300, // 30% 概率（300/1000）
    icon: 'red-packet-small',
    description: '价值 10 积分的小红包',
  },
  {
    id: 'red-packet-2',
    name: '中红包',
    type: 'RED_PACKET',
    value: 50, // 50 积分
    weight: 150, // 15% 概率（150/1000）
    icon: 'red-packet-medium',
    description: '价值 50 积分的中红包',
  },
  {
    id: 'red-packet-3',
    name: '大红包',
    type: 'RED_PACKET',
    value: 100, // 100 积分
    weight: 50, // 5% 概率（50/1000）
    icon: 'red-packet-large',
    description: '价值 100 积分的大红包',
  },
  {
    id: 'red-packet-4',
    name: '超级红包',
    type: 'RED_PACKET',
    value: 500, // 500 积分
    weight: 10, // 1% 概率（10/1000）
    icon: 'red-packet-super',
    description: '价值 500 积分的超级红包',
  },

  // ============================================
  // 道具类奖品
  // ============================================
  {
    id: 'item-exp-boost-1',
    name: '经验加成卡（1天）',
    type: 'ITEM',
    value: 20, // 20% 经验加成
    weight: 200, // 20% 概率（200/1000）
    icon: 'item-exp-boost-1d',
    description: '使用后 24 小时内经验值获得 +20%',
  },
  {
    id: 'item-exp-boost-3',
    name: '经验加成卡（3天）',
    type: 'ITEM',
    value: 20, // 20% 经验加成
    weight: 80, // 8% 概率（80/1000）
    icon: 'item-exp-boost-3d',
    description: '使用后 72 小时内经验值获得 +20%',
  },
  {
    id: 'item-points-boost-1',
    name: '积分加成卡（1天）',
    type: 'ITEM',
    value: 30, // 30% 积分加成
    weight: 150, // 15% 概率（150/1000）
    icon: 'item-points-boost-1d',
    description: '使用后 24 小时内积分获得 +30%',
  },
  {
    id: 'item-points-boost-3',
    name: '积分加成卡（3天）',
    type: 'ITEM',
    value: 30, // 30% 积分加成
    weight: 50, // 5% 概率（50/1000）
    icon: 'item-points-boost-3d',
    description: '使用后 72 小时内积分获得 +30%',
  },
  {
    id: 'item-rank-boost-1',
    name: '段位加成卡（1次）',
    type: 'ITEM',
    value: 5, // 额外 5 次打卡计数
    weight: 30, // 3% 概率（30/1000）
    icon: 'item-rank-boost-1',
    description: '使用后下次打卡额外计算 5 次打卡次数',
  },
  {
    id: 'item-rank-boost-3',
    name: '段位加成卡（3次）',
    type: 'ITEM',
    value: 10, // 额外 10 次打卡计数
    weight: 10, // 1% 概率（10/1000）
    icon: 'item-rank-boost-3',
    description: '使用后下次打卡额外计算 10 次打卡次数',
  },

  // ============================================
  // 限定奖励类奖品
  // ============================================
  {
    id: 'limited-reward-1',
    name: '限定头像框',
    type: 'LIMITED_REWARD',
    weight: 20, // 2% 概率（20/1000）
    icon: 'limited-avatar-frame',
    description: '限定的精美头像框',
  },
  {
    id: 'limited-reward-2',
    name: '限定称号',
    type: 'LIMITED_REWARD',
    weight: 10, // 1% 概率（10/1000）
    icon: 'limited-title',
    description: '限定的特殊称号',
  },
  {
    id: 'limited-reward-3',
    name: '限定皮肤',
    type: 'LIMITED_REWARD',
    weight: 5, // 0.5% 概率（5/1000）
    icon: 'limited-skin',
    description: '限定的精美皮肤',
  },
]

/**
 * 计算总权重
 * 
 * @returns 所有奖品权重的总和
 */
export function getTotalWeight(): number {
  return PRIZE_CONFIGS.reduce((sum, prize) => sum + prize.weight, 0)
}

/**
 * 根据权重随机选择一个奖品
 * 
 * @description 使用加权随机算法，权重越高的奖品被选中的概率越大
 * 
 * @returns 选中的奖品配置
 */
export function drawPrize(): PrizeConfig {
  const totalWeight = getTotalWeight()
  let random = Math.random() * totalWeight

  for (const prize of PRIZE_CONFIGS) {
    random -= prize.weight
    if (random <= 0) {
      return prize
    }
  }

  // 理论上不会执行到这里，但为了类型安全
  return PRIZE_CONFIGS[PRIZE_CONFIGS.length - 1]
}

/**
 * 抽奖消耗的积分
 */
export const LOTTERY_COST = 50 // 每次抽奖消耗 50 积分

