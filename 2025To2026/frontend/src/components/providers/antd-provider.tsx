'use client'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { ReactNode } from 'react'

/**
 * Ant Design Provider 组件
 * 
 * @description 为应用提供 Ant Design 的配置
 * 包括：
 * - 中文本地化
 * - 主题配置
 * - 全局样式配置
 */
export function AntdProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          // 主色调：紫蓝色
          colorPrimary: '#6366f1',
          // 成功色
          colorSuccess: '#10b981',
          // 警告色
          colorWarning: '#f59e0b',
          // 错误色
          colorError: '#ef4444',
          // 信息色
          colorInfo: '#3b82f6',
          // 圆角
          borderRadius: 8,
          // 字体
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
        },
        components: {
          // Button 组件配置
          Button: {
            borderRadius: 8,
            controlHeight: 40,
          },
          // Card 组件配置
          Card: {
            borderRadius: 12,
          },
          // Input 组件配置
          Input: {
            borderRadius: 8,
            controlHeight: 40,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

