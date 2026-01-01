import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge as BadgeComponent } from '@/components/ui/badge'
import { Award, Lock, CheckCircle } from 'lucide-react'

/**
 * 勋章页面组件
 * 
 * @description 显示所有勋章和成就系统
 */
export default function BadgesPage() {
  // 模拟勋章数据
  const badges = [
    {
      id: 1,
      name: '连续打卡 7 天',
      description: '连续打卡 7 天获得',
      icon: '🏆',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2025-12-25',
    },
    {
      id: 2,
      name: '连续打卡 30 天',
      description: '连续打卡 30 天获得',
      icon: '⭐',
      rarity: 'rare',
      unlocked: true,
      unlockedAt: '2026-01-01',
    },
    {
      id: 3,
      name: '连续打卡 100 天',
      description: '连续打卡 100 天获得',
      icon: '💎',
      rarity: 'epic',
      unlocked: false,
    },
    {
      id: 4,
      name: '连续登录 7 天',
      description: '连续登录 7 天获得',
      icon: '🔥',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2025-12-20',
    },
    {
      id: 5,
      name: '达到 10 级',
      description: '经验等级达到 10 级',
      icon: '🌟',
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2025-12-15',
    },
    {
      id: 6,
      name: '达到 20 级',
      description: '经验等级达到 20 级',
      icon: '✨',
      rarity: 'rare',
      unlocked: false,
    },
    {
      id: 7,
      name: '首次达到黄金段位',
      description: '首次达到黄金段位',
      icon: '👑',
      rarity: 'epic',
      unlocked: true,
      unlockedAt: '2025-12-30',
    },
    {
      id: 8,
      name: '首次达到钻石段位',
      description: '首次达到钻石段位',
      icon: '💍',
      rarity: 'legendary',
      unlocked: false,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500'
      case 'rare':
        return 'bg-blue-500'
      case 'epic':
        return 'bg-purple-500'
      case 'legendary':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '普通'
      case 'rare':
        return '稀有'
      case 'epic':
        return '史诗'
      case 'legendary':
        return '传说'
      default:
        return '普通'
    }
  }

  const unlockedCount = badges.filter((b) => b.unlocked).length

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">勋章系统</h1>
          <p className="text-muted-foreground">
            收集各种成就勋章，展示你的学习成果
          </p>
        </div>

        {/* 统计信息 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已解锁</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {unlockedCount} / {badges.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((unlockedCount / badges.length) * 100)}% 完成度
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">普通</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {badges.filter((b) => b.rarity === 'common' && b.unlocked).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                普通勋章数量
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">稀有及以上</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {badges.filter((b) => b.rarity !== 'common' && b.unlocked).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                稀有、史诗、传说勋章
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 勋章列表 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={`relative overflow-hidden ${
                badge.unlocked ? '' : 'opacity-60'
              }`}
            >
              {!badge.unlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{badge.icon}</div>
                  <div className="flex flex-col items-end space-y-1">
                    <BadgeComponent
                      className={`${getRarityColor(badge.rarity)} text-white`}
                    >
                      {getRarityName(badge.rarity)}
                    </BadgeComponent>
                    {badge.unlocked && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
                <CardTitle className="mt-4">{badge.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {badge.description}
                </p>
                {badge.unlocked && badge.unlockedAt && (
                  <p className="text-xs text-muted-foreground">
                    获得时间：{badge.unlockedAt}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}

