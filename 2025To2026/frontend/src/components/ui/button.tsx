import * as React from 'react'
import { cn } from '@/lib/utils'

/**
 * 按钮组件属性接口
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

/**
 * 按钮组件
 * 
 * @description 现代化的按钮组件，支持多种样式变体和尺寸
 * 设计特点：
 * - 平滑的过渡动画
 * - 点击时的缩放反馈
 * - 焦点状态的可见性
 * - 渐变样式支持
 * 
 * @variant 按钮样式变体：
 * - default: 默认主色调按钮
 * - destructive: 危险操作按钮（红色）
 * - outline: 轮廓按钮
 * - secondary: 次要按钮
 * - ghost: 幽灵按钮（无背景）
 * - link: 链接样式按钮
 * - gradient: 渐变按钮（主色调渐变）
 * 
 * @size 按钮尺寸：
 * - sm: 小尺寸（h-9, px-4）
 * - default: 默认尺寸（h-11, px-6）
 * - lg: 大尺寸（h-12, px-8）
 * - icon: 图标按钮（h-10, w-10）
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    /**
     * 基础样式类
     * - inline-flex: 行内弹性布局
     * - items-center justify-center: 内容居中
     * - rounded-lg: 圆角（8px）
     * - font-medium: 中等字重
     * - transition-all duration-200: 平滑过渡（200ms）
     * - focus-visible:outline-none: 移除默认焦点轮廓
     * - focus-visible:ring-2: 自定义焦点环（2px）
     * - active:scale-95: 点击时缩放至95%（反馈效果）
     * - disabled:opacity-50: 禁用时50%透明度
     */
    const baseStyles = 
      'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
      'disabled:opacity-50 disabled:pointer-events-none active:scale-95'
    
    /**
     * 按钮样式变体定义
     * 每种变体都有独特的颜色和样式
     */
    const variants = {
      /**
       * 默认按钮：主色调背景
       * - bg-primary: 主色调背景
       * - text-primary-foreground: 主色调文字（通常是白色）
       * - hover:bg-primary/90: 悬停时90%不透明度
       * - shadow-md hover:shadow-lg: 阴影效果
       */
      default: 
        'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
      
      /**
       * 危险按钮：红色背景
       * 用于删除、警告等危险操作
       */
      destructive: 
        'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg',
      
      /**
       * 轮廓按钮：透明背景，有边框
       * - border-2: 2px边框
       * - hover:bg-accent: 悬停时显示背景
       * - hover:border-primary/50: 悬停时边框高亮
       */
      outline: 
        'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50',
      
      /**
       * 次要按钮：灰色背景
       * 用于次要操作
       */
      secondary: 
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md',
      
      /**
       * 幽灵按钮：无背景
       * 悬停时显示背景
       */
      ghost: 
        'hover:bg-accent hover:text-accent-foreground',
      
      /**
       * 链接按钮：文本样式
       * - underline-offset-4: 下划线偏移
       * - hover:underline: 悬停时显示下划线
       */
      link: 
        'text-primary underline-offset-4 hover:underline',
      
      /**
       * 渐变按钮：主色调渐变背景
       * - gradient-primary: 使用主色调渐变
       * - text-white: 白色文字
       * - hover:opacity-90: 悬停时90%不透明度
       * - shadow-lg hover:shadow-xl: 大阴影效果
       * - transform hover:scale-105: 悬停时轻微放大（105%）
       */
      gradient: 
        'gradient-primary text-white hover:opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105',
    }
    
    /**
     * 按钮尺寸定义
     * 控制按钮的高度和内边距
     */
    const sizes = {
      sm: 'h-9 px-4 rounded-md text-sm',          /* 小按钮：36px高，16px左右内边距 */
      default: 'h-11 px-6 py-2',                  /* 默认：44px高，24px左右内边距 */
      lg: 'h-12 px-8 rounded-lg text-base',       /* 大按钮：48px高，32px左右内边距 */
      icon: 'h-10 w-10',                          /* 图标按钮：40x40px正方形 */
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
