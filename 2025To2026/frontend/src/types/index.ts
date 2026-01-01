/**
 * 用户类型定义
 */
export interface User {
  id: string
  email: string
  username: string
  nickname?: string
  avatar?: string
  role: 'USER' | 'SUPER_ADMIN'
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * 用户资料类型定义
 */
export interface UserProfile {
  id: string
  userId: string
  bio?: string
  location?: string
  website?: string
  github?: string
  totalPoints: number
  currentRankId?: string
  currentLevel: number
  currentExp: number
  nextLevelExp: number
  consecutiveLoginDays: number
  consecutiveCheckInDays: number
  totalCheckInDays: number
}

/**
 * 段位类型定义
 */
export interface Rank {
  id: string
  name: string
  level: number
  minStars: number
  maxStars: number
  requiredCheckIns: number
  season: number
}

/**
 * 打卡记录类型定义
 */
export interface CheckIn {
  id: string
  userId: string
  checkInDate: string
  pointsEarned: number
  expEarned: number
  consecutiveDays: number
  createdAt: string
}

/**
 * API 响应类型定义
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

