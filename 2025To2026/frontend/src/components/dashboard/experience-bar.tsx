import { Card, Progress } from 'antd'
import styles from './experience-bar.module.scss'

/**
 * 经验条组件属性接口
 */
interface ExperienceBarProps {
  currentExp: number
  nextLevelExp: number
  currentLevel: number
}

/**
 * 经验条组件
 * 
 * @description 使用 Ant Design Card 和 Progress 组件
 */
export function ExperienceBar({ 
  currentExp, 
  nextLevelExp, 
  currentLevel 
}: ExperienceBarProps) {
  // 计算经验进度百分比
  const progress = Math.min((currentExp / nextLevelExp) * 100, 100)
  const remainingExp = nextLevelExp - currentExp

  return (
    <Card className={styles.card} hoverable>
      <div className={styles.header}>
        <span className={styles.title}>经验等级</span>
        <span className={styles.level}>Lv.{currentLevel}</span>
      </div>
      
      <div className={styles.content}>
        {/* 顶部显示距离下一级经验（突出显示） */}
        <div className={styles.remainingExp}>
          <p className={styles.remainingLabel}>距离下一级还需</p>
          <p className={styles.remainingValue}>
            {remainingExp.toLocaleString()} 经验
          </p>
        </div>
        
        {/* 经验进度条 */}
        <Progress
          percent={progress}
          strokeColor={{
            '0%': '#10b981',
            '100%': '#3b82f6',
          }}
          showInfo={false}
          className={styles.progress}
        />
        
        {/* 经验值信息 */}
        <div className={styles.expInfo}>
          <span>{currentExp.toLocaleString()} / {nextLevelExp.toLocaleString()} 经验</span>
          <span className={styles.levelText}>等级 {currentLevel}</span>
        </div>
      </div>
    </Card>
  )
}
