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
          // ============================================
          // 统一配色系统（现代、简洁、专业）
          // ============================================
          // 主色调：紫蓝色（Indigo）- 单一色调，不使用渐变
          colorPrimary: '#6366f1',
          // 成功色：绿色
          colorSuccess: '#10b981',
          // 警告色：橙色
          colorWarning: '#f59e0b',
          // 错误色：红色
          colorError: '#ef4444',
          // 信息色：蓝色
          colorInfo: '#3b82f6',
          // ============================================
          // 设计规范
          // ============================================
          // 圆角：统一使用 8px，保持现代感
          borderRadius: 8,
          // 字体：系统字体栈，确保跨平台一致性
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
          // 背景色：浅灰色背景
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorBgLayout: '#fafafa',
          // 文本颜色：深灰色系，提高可读性
          colorText: '#1a1a1a',
          colorTextSecondary: '#4a5568',
          colorTextTertiary: '#718096',
          // 边框颜色：浅灰色
          colorBorder: '#e2e8f0',
          colorBorderSecondary: '#f1f5f9',
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

