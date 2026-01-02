'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Spin } from 'antd'
import { useAuth } from '@/contexts/auth-context'

/**
 * 需要认证的组件包装器
 * 
 * @description 保护需要登录才能访问的页面
 * - 如果用户未登录，自动重定向到登录页
 * - 如果用户已登录，显示子组件
 * - 在加载状态时显示加载动画
 * 
 * @param children - 需要保护的内容
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // 确保只在客户端 hydration 后执行
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      // 保存当前路径，登录后可以重定向回来
      const currentPath = window.location.pathname
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`)
    }
  }, [mounted, isAuthenticated, isLoading, router])

  // 在客户端 hydration 完成之前，显示加载状态
  // 这样可以确保服务端和客户端初始渲染一致
  if (!mounted || isLoading || !isAuthenticated) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
        suppressHydrationWarning
      >
        <Spin size="large" />
      </div>
    )
  }

  return <>{children}</>
}

