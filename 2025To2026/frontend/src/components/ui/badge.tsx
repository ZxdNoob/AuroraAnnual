import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * 徽章组件属性接口
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success'
}

/**
 * 徽章组件
 * 
 * @description 现代化的徽章组件，用于显示标签、状态等信息
 * 设计特点：
 * - 圆角设计（rounded-full）
 * - 紧凑的内边距
 * - 清晰的字体和颜色对比
 * - 平滑的过渡效果
 * 
 * @variant 徽章样式变体：
 * - default: 默认主色调徽章
 * - secondary: 次要徽章（灰色）
 * - destructive: 危险徽章（红色）
 * - outline: 轮廓徽章（无背景）
 * - success: 成功徽章（绿色）
 */
function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  /**
   * 徽章样式变体定义
   * 每种变体都有独特的颜色和样式
   */
  const variants = {
    /**
     * 默认徽章：主色调背景
     * - border-transparent: 透明边框
     * - bg-primary: 主色调背景
     * - text-primary-foreground: 主色调文字
     * - hover:bg-primary/80: 悬停时80%不透明度
     */
    default: 
      'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
    
    /**
     * 次要徽章：灰色背景
     * 用于次要信息显示
     */
    secondary: 
      'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
    
    /**
     * 危险徽章：红色背景
     * 用于错误、警告等状态
     */
    destructive: 
      'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
    
    /**
     * 轮廓徽章：无背景，有边框
     * 用于次要标签
     */
    outline: 
      'text-foreground border-border',
    
    /**
     * 成功徽章：绿色背景
     * 用于成功状态、完成状态等
     * 使用渐变色实现
     */
    success:
      'border-transparent gradient-success text-white hover:opacity-90',
  }

  return (
    <div
      className={cn(
        /* 基础样式 */
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        'transition-colors duration-200',        /* 颜色过渡动画 */
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', /* 焦点状态 */
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
