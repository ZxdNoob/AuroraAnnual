'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import { post, getAuthToken, get } from '@/utils/api'
import type { User } from '@/types'

/**
 * 认证响应接口
 */
interface AuthResponse {
  accessToken: string
  user: {
    id: string
    email: string
    username: string
    nickname?: string
    avatar?: string
    role: string
  }
}

/**
 * 登录请求接口
 */
interface LoginRequest {
  usernameOrEmail: string
  password: string
}

/**
 * 注册请求接口
 */
interface RegisterRequest {
  email: string
  username: string
  password: string
  nickname?: string
}

/**
 * 认证上下文接口
 */
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

/**
 * 认证上下文
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * 认证 Provider 组件
 * 
 * @description 提供全局认证状态管理
 * - 管理用户登录状态
 * - 提供登录、注册、登出功能
 * - 自动从 localStorage 恢复登录状态
 * - 提供用户信息刷新功能
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 服务端渲染时，isLoading 初始为 false，避免服务端和客户端不一致
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => {
    // 服务端渲染时，直接返回 false
    if (typeof window === 'undefined') {
      return false
    }
    // 客户端渲染时，初始为 true，等待从 localStorage 恢复状态
    return true
  })
  const router = useRouter()

  /**
   * 从 Token 获取用户信息
   */
  const fetchUserFromToken = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    try {
      // 从后端获取当前用户信息
      const userData = await get<User>('/api/users/me', { token })
      setUser(userData)
    } catch (error) {
      // Token 无效，清除本地存储
      console.error('获取用户信息失败:', error)
      localStorage.removeItem('auth_token')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * 初始化：从 localStorage 恢复登录状态
   * 
   * 注意：只在客户端执行，避免服务端和客户端渲染不一致
   */
  useEffect(() => {
    // 确保只在客户端执行
    if (typeof window !== 'undefined') {
      fetchUserFromToken()
    } else {
      // 服务端渲染时，直接设置为非加载状态
      setIsLoading(false)
    }
  }, [fetchUserFromToken])

  /**
   * 用户登录
   * 
   * @param credentials 登录凭据（用户名/邮箱和密码）
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      const response = await post<AuthResponse>('/api/auth/login', credentials)
      
      // 保存 Token 到 localStorage
      localStorage.setItem('auth_token', response.accessToken)
      
      // 更新用户状态
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        nickname: response.user.nickname,
        avatar: response.user.avatar,
        role: response.user.role as 'USER' | 'SUPER_ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUser(userData)
      
      message.success('登录成功')
      router.push('/')
    } catch (error: any) {
      message.error(error.message || '登录失败，请检查用户名和密码')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  /**
   * 用户注册
   * 
   * @param data 注册数据
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setIsLoading(true)
      const response = await post<AuthResponse>('/api/auth/register', data)
      
      // 保存 Token 到 localStorage
      localStorage.setItem('auth_token', response.accessToken)
      
      // 更新用户状态
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        nickname: response.user.nickname,
        avatar: response.user.avatar,
        role: response.user.role as 'USER' | 'SUPER_ADMIN',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUser(userData)
      
      message.success('注册成功，欢迎加入！')
      router.push('/')
    } catch (error: any) {
      message.error(error.message || '注册失败，请检查输入信息')
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  /**
   * 用户登出
   */
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    setUser(null)
    message.success('已退出登录')
    router.push('/login')
  }, [router])

  /**
   * 刷新用户信息
   */
  const refreshUser = useCallback(async () => {
    await fetchUserFromToken()
  }, [fetchUserFromToken])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * 使用认证上下文
 * 
 * @description 获取认证相关的状态和方法
 * @returns 认证上下文值
 * @throws 如果不在 AuthProvider 内使用，抛出错误
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

