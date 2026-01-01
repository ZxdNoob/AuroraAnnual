import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * 统计卡片属性接口
 */
interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: boolean
}

/**
 * 统计卡片组件
 * 
 * @description 用于显示统计数据（积分、经验、段位等）的卡片组件
 * 设计特点：
 * - 支持渐变背景
 * - 趋势指示器（上升/下降）
 * - 图标装饰
 * - 清晰的视觉层次
 * 
 * @param title - 统计项标题
 * @param value - 统计值
 * @param description - 描述文字（可选）
 * @param icon - 图标组件（可选）
 * @param trend - 趋势信息（可选）：{ value: 百分比, isPositive: 是否为正增长 }
 * @param gradient - 是否使用渐变背景（可选）
 */
export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  gradient 
}: StatsCardProps) {
  return (
    <Card 
      className={cn(
        'card-hover overflow-hidden relative',
        gradient && 'gradient-primary text-white border-0 shadow-lg' /* 渐变模式下移除边框，增强阴影 */
      )}
    >
      {/* 渐变遮罩层：在渐变模式下添加白色半透明遮罩，增强层次感 */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/5" />
      )}
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle 
          className={cn(
            'text-sm font-medium',
            gradient ? 'text-white/90' : 'text-muted-foreground'
          )}
        >
          {title}
        </CardTitle>
        
        {/* 图标装饰：右上角显示图标 */}
        {Icon && (
          <Icon 
            className={cn(
              'h-5 w-5 transition-transform duration-200 hover:scale-110',
              gradient ? 'text-white/80' : 'text-muted-foreground'
            )} 
          />
        )}
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-2">
        {/* 主要数值：使用大字号和粗体，突出显示 */}
        <div 
          className={cn(
            'text-3xl font-bold tracking-tight',
            gradient ? 'text-white' : ''
          )}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {/* 描述文字：提供额外的上下文信息 */}
        {description && (
          <p 
            className={cn(
              'text-xs leading-relaxed',
              gradient ? 'text-white/80' : 'text-muted-foreground'
            )}
          >
            {description}
          </p>
        )}
        
        {/* 趋势指示器：显示数值变化趋势 */}
        {trend && (
          <div className="flex items-center space-x-1 pt-1">
            {trend.isPositive ? (
              <TrendingUp className={cn(
                'h-4 w-4',
                gradient ? 'text-green-200' : 'text-green-600'
              )} />
            ) : (
              <TrendingDown className={cn(
                'h-4 w-4',
                gradient ? 'text-red-200' : 'text-red-600'
              )} />
            )}
            <span 
              className={cn(
                'text-xs font-medium',
                trend.isPositive 
                  ? (gradient ? 'text-green-200' : 'text-green-600')
                  : (gradient ? 'text-red-200' : 'text-red-600')
              )}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
