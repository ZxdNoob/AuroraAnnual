'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

/**
 * React Query Provider 组件
 * 
 * @description 为应用提供 React Query 的 QueryClient
 * 配置了默认的查询选项，包括重试策略、缓存时间等
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 失败后重试 1 次
            retry: 1,
            // 数据在 5 分钟内被认为是新鲜的
            staleTime: 5 * 60 * 1000,
            // 数据在缓存中保留 10 分钟
            gcTime: 10 * 60 * 1000,
            // 窗口重新聚焦时不重新获取
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

