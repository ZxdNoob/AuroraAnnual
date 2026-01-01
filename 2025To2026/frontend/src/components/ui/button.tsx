import { Button as AntButton } from 'antd'
import type { ButtonProps as AntButtonProps } from 'antd'
import React from 'react'

/**
 * Button 组件 - Ant Design 包装器
 * 
 * @description 为了保持向后兼容，将自定义 Button 组件改为 Ant Design Button 的包装器
 * 将自定义的 variant 映射到 Ant Design 的 type
 */
export interface ButtonProps extends Omit<AntButtonProps, 'type' | 'size' | 'variant'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = 'default', size = 'default', className, style, ...props }, ref) => {
    // 将自定义 variant 映射到 Ant Design type
    const typeMap: Record<string, AntButtonProps['type']> = {
      default: 'primary',
      destructive: 'primary',
      outline: 'default',
      secondary: 'default',
      ghost: 'text',
      link: 'link',
      gradient: 'primary',
    }

    // 将自定义 size 映射到 Ant Design size
    const sizeMap: Record<string, AntButtonProps['size']> = {
      sm: 'small',
      default: 'middle',
      lg: 'large',
      icon: 'middle',
    }

    const antdType = typeMap[variant] || 'default'
    const antdSize = sizeMap[size] || 'middle'

    // 处理 gradient variant 的特殊样式
    const gradientStyle = variant === 'gradient' 
      ? {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none',
          color: '#fff',
          ...style,
        }
      : style

    // 处理 destructive variant 的特殊样式
    const destructiveStyle = variant === 'destructive'
      ? {
          background: '#ef4444',
          borderColor: '#ef4444',
          color: '#fff',
          ...gradientStyle,
        }
      : gradientStyle

    return (
      <AntButton
        ref={ref}
        type={antdType}
        size={antdSize}
        className={className}
        style={destructiveStyle}
        danger={variant === 'destructive'}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
