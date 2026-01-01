import { MainLayout } from '@/components/layout/main-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ExperienceBar } from '@/components/dashboard/experience-bar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Trophy, 
  Zap, 
  Award, 
  Gift, 
  TrendingUp,
  Calendar,
  Code,
  Star,
  Sparkles,
  ArrowRight,
  Flame,
  Target,
  Activity
} from 'lucide-react'
import Link from 'next/link'

/**
 * 首页组件
 * 
 * @description 显示用户仪表板，包含统计信息、经验进度、快速操作等
 * 设计特点：
 * - 现代化的卡片布局
 * - 清晰的视觉层次
 * - 丰富的交互反馈
 * - 响应式设计
 * 
 * 页面结构：
 * 1. 欢迎横幅（Hero Section）
 * 2. 快速操作卡片（Quick Actions）
 * 3. 统计信息卡片（Statistics）
 * 4. 经验进度和段位信息
 * 5. 最近活动列表
 */
export default function HomePage() {
  // 模拟数据（后续会从 API 获取）
  const userStats = {
    totalPoints: 1250,
    currentLevel: 15,
    currentExp: 850,
    nextLevelExp: 1200,
    currentRank: '黄金',
    rankStars: 3,
    consecutiveCheckInDays: 7,
    totalCheckInDays: 45,
    badgesCount: 8,
  }

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in">
        {/* ========== 欢迎区域（Hero Section）========== */}
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-12 text-white shadow-2xl">
          {/* 背景装饰：使用绝对定位的圆形渐变 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          
          {/* 内容区域 */}
          <div className="relative z-10 space-y-6">
            {/* 欢迎标签 */}
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                欢迎回来
              </Badge>
            </div>
            
            {/* 主标题 */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              继续你的学习之旅
            </h1>
            
            {/* 描述文字 */}
            <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
              每天进步一点点，通过打卡、编码练习、完成任务来获得积分和经验，提升段位，解锁更多成就！
            </p>
            
            {/* 操作按钮组 */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/checkin">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="shadow-lg hover:shadow-xl bg-white/95 text-primary hover:bg-white"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  立即打卡
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/code">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                >
                  <Code className="mr-2 h-5 w-5" />
                  开始编码
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ========== 快速操作卡片 ========== */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 每日打卡卡片 */}
          <Card className="card-hover group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link href="/checkin">
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-warning shadow-lg group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                </div>
                <CardTitle className="text-lg">每日打卡</CardTitle>
                <CardDescription>
                  连续 {userStats.consecutiveCheckInDays} 天打卡中
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gradient-warning">
                      {userStats.consecutiveCheckInDays}
                    </span>
                    <span className="text-muted-foreground">天</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    累计打卡 {userStats.totalCheckInDays} 天
                  </p>
                  <Button className="w-full mt-4" size="sm" variant="gradient">
                    立即打卡
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* 在线编码卡片 */}
          <Card className="card-hover group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link href="/code">
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-success shadow-lg group-hover:scale-110 transition-transform">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
                <CardTitle className="text-lg">在线编码</CardTitle>
                <CardDescription>
                  专业代码编辑器
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gradient-success">
                    开始编码
                  </div>
                  <p className="text-sm text-muted-foreground">
                    练习编程，提升技能
                  </p>
                  <Button className="w-full mt-4" size="sm" variant="outline">
                    进入编辑器
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* 每日抽奖卡片 */}
          <Card className="card-hover group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link href="/lottery">
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-secondary shadow-lg group-hover:scale-110 transition-transform">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
                </div>
                <CardTitle className="text-lg">每日抽奖</CardTitle>
                <CardDescription>
                  免费抽奖机会
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gradient-secondary">
                    免费抽奖
                  </div>
                  <p className="text-sm text-muted-foreground">
                    有机会获得丰厚奖励
                  </p>
                  <Button className="w-full mt-4" size="sm" variant="outline">
                    立即抽奖
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* 我的段位卡片 */}
          <Card className="card-hover group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Link href="/ranks">
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg group-hover:scale-110 transition-transform">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                </div>
                <CardTitle className="text-lg">我的段位</CardTitle>
                <CardDescription>
                  {userStats.currentRank} {userStats.rankStars} 星
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">{userStats.currentRank}</span>
                    <Badge variant="secondary">{userStats.rankStars} 星</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    查看段位详情
                  </p>
                  <Button className="w-full mt-4" size="sm" variant="outline">
                    查看详情
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* ========== 统计信息卡片 ========== */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="总积分"
            value={userStats.totalPoints.toLocaleString()}
            description="累计获得积分"
            icon={Trophy}
            trend={{ value: 12, isPositive: true }}
            gradient
          />
          <StatsCard
            title="当前等级"
            value={userStats.currentLevel}
            description="经验等级"
            icon={Star}
          />
          <StatsCard
            title="连续打卡"
            value={`${userStats.consecutiveCheckInDays} 天`}
            description="保持打卡可获得额外奖励"
            icon={Calendar}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            title="获得勋章"
            value={userStats.badgesCount}
            description="已解锁的成就勋章"
            icon={Award}
          />
        </div>

        {/* ========== 经验进度和段位信息 ========== */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 经验进度条 */}
          <ExperienceBar
            currentExp={userStats.currentExp}
            nextLevelExp={userStats.nextLevelExp}
            currentLevel={userStats.currentLevel}
          />

          {/* 段位信息卡片 */}
          <Card className="card-hover relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-orange-500/10 to-red-500/10" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span>段位信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 space-y-6">
              {/* 段位展示 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{userStats.currentRank}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 transition-colors ${
                            i < userStats.rankStars
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 段位详情 */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">当前赛季</span>
                  <span className="font-semibold">第 1 赛季</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">累计打卡</span>
                  <span className="font-semibold">{userStats.totalCheckInDays} 天</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">段位等级</span>
                  <Badge variant="secondary" className="font-semibold">
                    {userStats.currentRank} {userStats.rankStars} 星
                  </Badge>
                </div>
              </div>
              
              {/* 查看详情按钮 */}
              <Link href="/ranks">
                <Button variant="gradient" className="w-full">
                  查看段位详情
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* ========== 最近活动 ========== */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>最近活动</span>
            </CardTitle>
            <CardDescription>
              查看你的最新活动和成就
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  icon: Zap, 
                  title: '完成每日打卡', 
                  time: '2 小时前', 
                  reward: '+10 积分', 
                  color: 'text-orange-500',
                  bgColor: 'bg-orange-500/10'
                },
                { 
                  icon: Code, 
                  title: '完成编程练习', 
                  time: '5 小时前', 
                  reward: '+25 经验', 
                  color: 'text-blue-500',
                  bgColor: 'bg-blue-500/10'
                },
                { 
                  icon: Award, 
                  title: '获得新勋章：连续打卡 7 天', 
                  time: '1 天前', 
                  reward: '新获得', 
                  color: 'text-purple-500',
                  bgColor: 'bg-purple-500/10',
                  isNew: true 
                },
              ].map((activity, index) => {
                const Icon = activity.icon
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors group"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${activity.bgColor} ${activity.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge variant={activity.isNew ? 'default' : 'secondary'} className="font-semibold shrink-0">
                      {activity.reward}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
