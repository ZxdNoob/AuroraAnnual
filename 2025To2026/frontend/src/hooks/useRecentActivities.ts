'use client'

import { useQuery } from '@tanstack/react-query'
import { get, getAuthToken } from '@/utils/api'

/**
 * 活动类型
 */
export type ActivityType = 'CHECK_IN' | 'CODE' | 'BADGE' | 'LOTTERY' | 'RANK_UP'

/**
 * 活动项接口
 */
export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description?: string
  time: string
  reward?: string
  icon?: string
  isNew?: boolean
  timestamp?: number // 用于排序的时间戳
}

/**
 * 获取最近活动
 * 
 * @description 获取用户最近的活动记录
 * 包括打卡、编码、获得勋章、抽奖、段位提升等
 */
export function useRecentActivities(limit: number = 10) {
  const token = getAuthToken()
  
  return useQuery({
    queryKey: ['recentActivities', limit, token],
    queryFn: async (): Promise<ActivityItem[]> => {
      if (!token) {
        return []
      }
      
      // 获取最近的打卡记录
      const checkIns = await get<any[]>('/api/checkin/history', {
        token,
        params: { limit },
      }).catch(() => [])
      
      // 获取最近的积分记录
      const points = await get<any[]>('/api/points/history', {
        token,
        params: { limit },
      }).catch(() => [])
      
      // 获取最近的勋章
      const badges = await get<any[]>('/api/badges/my', {
        token,
        params: { limit: 5 },
      }).catch(() => [])
      
      // 组合并排序活动
      const activities: ActivityItem[] = []
      
      // 处理打卡记录
      checkIns.forEach((checkIn) => {
        const time = checkIn.checkInDate || checkIn.createdAt
        activities.push({
          id: `checkin-${checkIn.id}`,
          type: 'CHECK_IN',
          title: '完成每日打卡',
          time: formatTimeAgo(time),
          reward: `+${checkIn.pointsEarned || 0} 积分`,
          timestamp: time ? new Date(time).getTime() : Date.now(),
        })
      })
      
      // 处理积分记录
      points.forEach((point) => {
        if (point.type === 'CHECK_IN') return // 避免重复
        
        activities.push({
          id: `point-${point.id}`,
          type: 'CODE',
          title: point.description || '获得积分',
          time: formatTimeAgo(point.createdAt),
          reward: `+${point.amount} 积分`,
          timestamp: point.createdAt ? new Date(point.createdAt).getTime() : Date.now(),
        })
      })
      
      // 处理勋章
      badges.forEach((badge) => {
        const time = badge.achievedAt || badge.createdAt
        activities.push({
          id: `badge-${badge.id}`,
          type: 'BADGE',
          title: `获得新勋章：${badge.badge?.name || '未知勋章'}`,
          time: formatTimeAgo(time),
          reward: '新获得',
          isNew: true,
          timestamp: time ? new Date(time).getTime() : Date.now(),
        })
      })
      
      // 按时间戳排序（最新的在前）
      activities.sort((a, b) => {
        return (b.timestamp || 0) - (a.timestamp || 0)
      })
      
      return activities.slice(0, limit)
    },
    enabled: !!token,
    staleTime: 2 * 60 * 1000, // 2 分钟
    retry: 1,
  })
}

/**
 * 格式化时间为相对时间
 * 
 * @param dateString - 日期字符串
 * @returns 相对时间字符串（如：2 小时前）
 */
function formatTimeAgo(dateString: string | Date): string {
  if (!dateString) return '刚刚'
  
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    // 如果时间无效，返回默认值
    if (isNaN(diff)) return '刚刚'
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) {
      return `${days} 天前`
    } else if (hours > 0) {
      return `${hours} 小时前`
    } else if (minutes > 0) {
      return `${minutes} 分钟前`
    } else {
      return '刚刚'
    }
  } catch (error) {
    return '刚刚'
  }
}

