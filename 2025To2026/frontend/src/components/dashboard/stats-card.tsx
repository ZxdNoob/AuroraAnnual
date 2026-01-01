import { Card, Statistic } from 'antd'
import type { StatisticProps } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import styles from './stats-card.module.scss'

/**
 * 统计卡片属性接口
 */
interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: boolean
}

/**
 * 统计卡片组件
 * 
 * @description 使用 Ant Design Card 和 Statistic 组件
 */
export function StatsCard({ 
  title, 
  value, 
  description, 
  icon,
  trend, 
  gradient 
}: StatsCardProps) {
  const cardClassName = gradient 
    ? `${styles.card} ${styles.gradientCard}` 
    : styles.card

  return (
    <Card className={cardClassName} hoverable>
      <Statistic
        title={title}
        value={typeof value === 'number' ? value : value}
        prefix={icon}
        suffix={trend && (
          <span className={trend.isPositive ? styles.trendUp : styles.trendDown}>
            {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
        valueStyle={{ 
          color: gradient ? '#fff' : undefined,
          fontSize: '24px',
          fontWeight: 'bold'
        }}
      />
      {description && (
        <div className={styles.description} style={{ color: gradient ? 'rgba(255,255,255,0.8)' : undefined }}>
          {description}
        </div>
      )}
    </Card>
  )
}
