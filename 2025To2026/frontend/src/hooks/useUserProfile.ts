'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { get, getAuthToken } from '@/utils/api'
import type { UserProfile, User, Rank } from '@/types'

/**
 * 用户资料响应接口
 */
interface UserProfileResponse {
  user: User
  profile: UserProfile
  rank?: Rank
}

/**
 * 获取用户资料
 * 
 * @description 使用 React Query 获取用户资料数据
 * 包含用户信息、用户资料和段位信息
 */
export function useUserProfile() {
  const token = getAuthToken()
  
  return useQuery({
    queryKey: ['userProfile', token],
    queryFn: async () => {
      if (!token) {
        throw new Error('未登录')
      }
      
      // 获取用户信息
      const user = await get<User>('/api/users/me', { token })
      
      // 获取用户资料
      const profile = await get<UserProfile>('/api/users/me/profile', { token })
      
      // 获取段位信息（如果有）
      let rank: Rank | undefined
      if (profile.currentRankId) {
        try {
          rank = await get<Rank>(`/api/ranks/${profile.currentRankId}`, { token })
        } catch (error) {
          console.error('获取段位信息失败:', error)
        }
      }
      
      return { user, profile, rank } as UserProfileResponse
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 分钟
    retry: 1,
  })
}

