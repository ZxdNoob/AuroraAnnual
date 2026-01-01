import { Card as AntCard } from 'antd'
import type { CardProps as AntCardProps } from 'antd'
import React from 'react'

/**
 * Card 组件 - Ant Design 包装器
 * 
 * @description 为了保持向后兼容，将自定义 Card 组件改为 Ant Design Card 的包装器
 */
export const Card = AntCard

/**
 * CardHeader - 使用 Card.Meta 或自定义样式
 */
export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className,
  ...props 
}) => (
  <div className={className} {...props}>
    {children}
  </div>
)

/**
 * CardTitle - 使用 Typography.Title
 */
export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ 
  children, 
  className,
  ...props 
}) => (
  <h3 className={className} {...props}>
    {children}
  </h3>
)

/**
 * CardDescription - 使用 Typography.Text
 */
export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ 
  children, 
  className,
  ...props 
}) => (
  <p className={className} {...props}>
    {children}
  </p>
)

/**
 * CardContent - 使用 Card body
 */
export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className,
  ...props 
}) => (
  <div className={className} {...props}>
    {children}
  </div>
)

/**
 * CardFooter - 使用 Card actions
 */
export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  children, 
  className,
  ...props 
}) => (
  <div className={className} {...props}>
    {children}
  </div>
)
