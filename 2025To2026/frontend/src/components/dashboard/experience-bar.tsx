import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
 * @description 显示当前经验值和升级进度的经验条组件
 * 设计特点：
 * - 渐变进度条
 * - 清晰的数值显示
 * - 平滑的动画过渡
 * - 闪烁动画效果
 * 
 * @param currentExp - 当前经验值
 * @param nextLevelExp - 下一级所需经验值
 * @param currentLevel - 当前等级
 */
export function ExperienceBar({ 
  currentExp, 
  nextLevelExp, 
  currentLevel 
}: ExperienceBarProps) {
  // 计算经验进度百分比
  // 使用 Math.min 确保不超过100%，避免进度条溢出
  const progress = Math.min((currentExp / nextLevelExp) * 100, 100)

  return (
    <Card className="card-hover overflow-hidden relative">
      {/* 背景渐变遮罩：添加微妙的渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">经验等级</span>
          {/* 等级显示：使用渐变文字效果 */}
          <span className="text-2xl font-bold text-gradient">
            Lv.{currentLevel}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {/* 经验值信息：显示当前等级和经验值范围 */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">等级 {currentLevel}</span>
          <span className="text-muted-foreground font-semibold">
            {currentExp.toLocaleString()} / {nextLevelExp.toLocaleString()} 经验
          </span>
        </div>
        
        {/* 经验进度条容器 */}
        <div className="w-full bg-secondary rounded-full h-5 overflow-hidden shadow-inner relative">
          {/* 经验进度条：使用渐变背景，平滑过渡动画 */}
          <div
            className="h-full gradient-success transition-all duration-1000 ease-out rounded-full relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* 闪烁动画层：添加流光效果 */}
            <div className="absolute inset-0 animate-shimmer" />
            
            {/* 进度条高光效果：顶部添加白色半透明层，增强立体感 */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
        
        {/* 距离下一级信息 */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            距离下一级还需
          </span>
          {/* 剩余经验值：使用主色调高亮显示 */}
          <span className="font-semibold text-primary">
            {(nextLevelExp - currentExp).toLocaleString()} 经验
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
