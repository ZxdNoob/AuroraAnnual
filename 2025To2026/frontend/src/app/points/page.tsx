import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, TrendingUp, Crown, Star, Sparkles, Gift } from 'lucide-react'

/**
 * 积分排行榜页面组件
 * 
 * @description 显示积分排行榜和积分统计信息，使用业界顶级设计
 */
export default function PointsPage() {
  // 模拟排行榜数据
  const leaderboard = [
    { rank: 1, username: '用户A', points: 3250, level: 25, rankName: '钻石', rankStars: 5 },
    { rank: 2, username: '用户B', points: 2980, level: 23, rankName: '钻石', rankStars: 3 },
    { rank: 3, username: '用户C', points: 2750, level: 22, rankName: '白金', rankStars: 5 },
    { rank: 4, username: '用户D', points: 2500, level: 20, rankName: '白金', rankStars: 3 },
    { rank: 5, username: '用户E', points: 2300, level: 19, rankName: '黄金', rankStars: 5 },
    { rank: 6, username: '用户F', points: 2100, level: 18, rankName: '黄金', rankStars: 3 },
    { rank: 7, username: '用户G', points: 1950, level: 17, rankName: '黄金', rankStars: 2 },
    { rank: 8, username: '用户H', points: 1800, level: 16, rankName: '白银', rankStars: 5 },
    { rank: 9, username: '用户I', points: 1650, level: 15, rankName: '白银', rankStars: 3 },
    { rank: 10, username: '用户J', points: 1500, level: 14, rankName: '白银', rankStars: 2 },
  ]

  const currentUser = {
    rank: 15,
    username: '当前用户',
    points: 1250,
    level: 15,
    rankName: '黄金',
    rankStars: 3,
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400 fill-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600 fill-amber-600" />
    return <span className="text-muted-foreground font-bold text-lg">{rank}</span>
  }

  const getRankGradient = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-orange-500'
    if (rank === 2) return 'from-gray-300 to-gray-500'
    if (rank === 3) return 'from-amber-400 to-amber-600'
    return 'from-primary/10 to-secondary/10'
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-4xl font-bold text-gradient">积分排行榜</h1>
          <p className="text-lg text-muted-foreground">
            查看积分排名，激励自己不断进步，冲击更高段位
          </p>
        </div>

        {/* 当前用户信息 - 使用渐变卡片 */}
        <Card className="border-2 border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <span>我的排名</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary shadow-xl">
                  <span className="text-3xl font-bold text-white">#{currentUser.rank}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{currentUser.username}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-sm">
                      {currentUser.rankName} {currentUser.rankStars} 星
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                      等级 {currentUser.level}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-gradient mb-1">
                  {currentUser.points.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">积分</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 排行榜 - 更精美的设计 */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span>积分排行榜</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-5 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                    user.rank <= 3 ? `bg-gradient-to-r ${getRankGradient(user.rank)}/10 border-primary/30` : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(user.rank)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-bold text-lg">{user.username}</p>
                        {user.rank <= 3 && (
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {user.rankName} {user.rankStars} 星
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          等级 {user.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold text-primary text-xl">
                        {user.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">积分</p>
                    </div>
                    {user.rank <= 3 && (
                      <TrendingUp className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 积分说明 - 更精美的设计 */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span>如何获得积分？</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold">每日打卡</p>
                    <p className="text-muted-foreground">
                      基础 5 积分，连续打卡有加成（最多 +10 积分）
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-success text-white text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold">完成编程练习</p>
                    <p className="text-muted-foreground">
                      根据难度获得 10-50 积分
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-secondary text-white text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold">参与活动</p>
                    <p className="text-muted-foreground">
                      根据活动规则获得积分
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold">获得成就</p>
                    <p className="text-muted-foreground">
                      解锁勋章可获得积分奖励
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary" />
                <span>积分用途</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">参与抽奖活动</p>
                    <p className="text-muted-foreground">消耗积分获得丰厚奖励</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-success">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">兑换道具和奖励</p>
                    <p className="text-muted-foreground">使用积分兑换各种道具</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">提升段位等级</p>
                    <p className="text-muted-foreground">积分可用于段位晋升</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-primary/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-secondary">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">解锁特殊权益</p>
                    <p className="text-muted-foreground">高积分用户享有特殊权益</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
