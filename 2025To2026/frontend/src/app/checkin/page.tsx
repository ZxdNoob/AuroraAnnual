import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap, Calendar, TrendingUp, Gift, Flame, Sparkles, CheckCircle2 } from 'lucide-react'

/**
 * 打卡页面组件
 * 
 * @description 每日打卡功能页面，显示打卡记录和奖励信息，使用业界顶级设计
 */
export default function CheckInPage() {
  // 模拟数据
  const checkInData = {
    todayChecked: true,
    consecutiveDays: 7,
    totalDays: 45,
    todayPoints: 12, // 基础 5 分 + 连续 7 天加成
    todayExp: 50,
    nextRewardDay: 10,
  }

  const recentCheckIns = [
    { date: '2026-01-01', points: 12, exp: 50, consecutive: 7 },
    { date: '2025-12-31', points: 11, exp: 50, consecutive: 6 },
    { date: '2025-12-30', points: 10, exp: 50, consecutive: 5 },
  ]

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold text-gradient">每日打卡</h1>
          <p className="text-lg text-muted-foreground">
            坚持打卡，获得积分和经验奖励，连续打卡可获得额外加成
          </p>
        </div>

        {/* 打卡卡片 - 使用渐变和动画效果 */}
        <Card className="border-2 border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <span>今日打卡</span>
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  连续打卡可获得额外奖励，最多 10 分加成
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            {checkInData.todayChecked ? (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full gradient-primary shadow-2xl animate-pulse-glow">
                      <CheckCircle2 className="h-16 w-16 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Sparkles className="h-8 w-8 text-yellow-500 animate-pulse" />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gradient mb-2">今日已打卡！</p>
                  <p className="text-muted-foreground">
                    获得 <span className="font-bold text-primary">{checkInData.todayPoints}</span> 积分和{' '}
                    <span className="font-bold text-primary">{checkInData.todayExp}</span> 经验
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Flame className="mr-2 h-4 w-4 text-orange-500" />
                    连续 {checkInData.consecutiveDays} 天
                  </Badge>
                  <Badge variant="secondary" className="px-4 py-2 text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    累计 {checkInData.totalDays} 天
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted border-4 border-dashed border-primary/30">
                    <Calendar className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold mb-2">开始今日打卡</p>
                  <p className="text-muted-foreground">
                    完成打卡可获得积分和经验奖励
                  </p>
                </div>
                <Button size="lg" variant="gradient" className="w-full max-w-xs mx-auto shadow-xl hover:scale-105 transition-transform">
                  <Zap className="mr-2 h-5 w-5" />
                  立即打卡
                </Button>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-muted-foreground">
                      连续打卡 {checkInData.consecutiveDays} 天
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    预计获得：<span className="font-bold text-primary">{checkInData.todayPoints}</span> 积分 +{' '}
                    <span className="font-bold text-primary">{checkInData.todayExp}</span> 经验
                  </p>
                </div>
              </div>
            )}

            {/* 连续打卡奖励说明 - 更精美的设计 */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>连续打卡奖励</span>
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => {
                  const isActive = day <= checkInData.consecutiveDays
                  return (
                    <div
                      key={day}
                      className={`relative p-4 rounded-xl text-center transition-all duration-300 ${
                        isActive
                          ? 'gradient-primary text-white shadow-lg scale-105'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="h-4 w-4 text-yellow-300" />
                        </div>
                      )}
                      <div className="text-2xl font-bold">{day}</div>
                      <div className="text-xs mt-1">+{day}</div>
                    </div>
                  )
                })}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                连续打卡天数越多，积分加成越多（最多 10 分）
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 打卡记录 - 更精美的设计 */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>最近打卡记录</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentCheckIns.map((record, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-5 border rounded-xl hover:bg-accent/50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-md group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{record.date}</p>
                      <p className="text-sm text-muted-foreground flex items-center space-x-1">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span>连续 {record.consecutive} 天</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">
                        +{record.points} 积分
                      </p>
                      <p className="text-sm text-muted-foreground">
                        +{record.exp} 经验
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 打卡统计 - 使用渐变卡片 */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-hover gradient-primary text-white border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">连续打卡</CardTitle>
              <TrendingUp className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">{checkInData.consecutiveDays} 天</div>
              <p className="text-xs text-white/80 mt-1">
                保持打卡可获得额外奖励
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-success text-white border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">累计打卡</CardTitle>
              <Calendar className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">{checkInData.totalDays} 天</div>
              <p className="text-xs text-white/80 mt-1">
                总打卡天数
              </p>
            </CardContent>
          </Card>

          <Card className="card-hover gradient-secondary text-white border-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-white/90">下次奖励</CardTitle>
              <Gift className="h-5 w-5 text-white/80" />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-white mb-1">{checkInData.nextRewardDay} 天</div>
              <p className="text-xs text-white/80 mt-1">
                连续打卡 {checkInData.nextRewardDay} 天可获得特殊奖励
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
