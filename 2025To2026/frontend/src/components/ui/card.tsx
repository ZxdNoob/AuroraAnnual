import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * 卡片组件
 * 
 * @description 现代化的卡片组件，支持悬停效果、阴影和边框
 * 设计特点：
 * - 圆角设计（rounded-xl）
 * - 平滑的阴影效果
 * - 悬停时的轻微上浮动画
 * - 玻璃态效果支持
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300',
      'hover:shadow-md hover:border-primary/20', /* 悬停时增强阴影和边框高亮 */
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

/**
 * 卡片头部组件
 * 
 * @description 卡片头部区域，包含标题和描述
 * 使用padding和间距系统，确保视觉平衡
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

/**
 * 卡片标题组件
 * 
 * @description 卡片标题，使用较大的字号和字重
 * 设计特点：
 * - 字体大小：text-2xl（24px）
 * - 字重：font-semibold（600）
 * - 行高和字距：leading-none tracking-tight
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

/**
 * 卡片描述组件
 * 
 * @description 卡片描述文字，使用较小的字号和柔和的颜色
 * 用于补充说明和次要信息
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground leading-relaxed', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

/**
 * 卡片内容组件
 * 
 * @description 卡片主体内容区域
 * 使用padding确保内容与边框有适当间距
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

/**
 * 卡片底部组件
 * 
 * @description 卡片底部区域，通常用于放置操作按钮
 * 使用flex布局，方便对齐操作元素
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
