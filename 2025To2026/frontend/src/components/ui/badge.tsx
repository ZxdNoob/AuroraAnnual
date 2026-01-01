import { Badge as AntBadge } from 'antd'
import type { BadgeProps as AntBadgeProps } from 'antd'
import React from 'react'

/**
 * Badge 组件 - Ant Design 包装器
 * 
 * @description 为了保持向后兼容，将自定义 Badge 组件改为 Ant Design Badge 的包装器
 */
export interface BadgeProps extends Omit<AntBadgeProps, 'status'> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  children,
  className,
  ...props 
}) => {
  // 将自定义 variant 映射到 Ant Design 的样式
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: '#6366f1',
      color: '#fff',
    },
    secondary: {
      backgroundColor: '#f0f0f0',
      color: '#333',
    },
    destructive: {
      backgroundColor: '#ef4444',
      color: '#fff',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid #d9d9d9',
      color: '#333',
    },
    success: {
      backgroundColor: '#10b981',
      color: '#fff',
    },
  }

  const style = variantStyles[variant] || variantStyles.default

  return (
    <AntBadge
      className={className}
      style={style}
      {...props}
    >
      {children}
    </AntBadge>
  )
}
