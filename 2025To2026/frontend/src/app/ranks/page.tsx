import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, TrendingUp } from 'lucide-react'

/**
 * 段位页面组件
 * 
 * @description 显示段位系统、当前段位和段位晋升规则
 */
export default function RanksPage() {
  // 段位数据
  const ranks = [
    { id: 1, name: '倔强黑铁', level: 1, minStars: 1, maxStars: 2, requiredCheckIns: 0, color: 'gray' },
    { id: 2, name: '不屈白银', level: 2, minStars: 1, maxStars: 3, requiredCheckIns: 5, color: 'slate' },
    { id: 3, name: '黄金', level: 3, minStars: 1, maxStars: 5, requiredCheckIns: 15, color: 'yellow' },
    { id: 4, name: '白金', level: 4, minStars: 1, maxStars: 5, requiredCheckIns: 30, color: 'cyan' },
    { id: 5, name: '钻石', level: 5, minStars: 1, maxStars: 5, requiredCheckIns: 60, color: 'blue' },
    { id: 6, name: '星耀', level: 6, minStars: 1, maxStars: 5, requiredCheckIns: 100, color: 'purple' },
    { id: 7, name: '不凡大师', level: 7, minStars: 1, maxStars: 5, requiredCheckIns: 150, color: 'pink' },
    { id: 8, name: '宗师', level: 8, minStars: 1, maxStars: 5, requiredCheckIns: 220, color: 'orange' },
    { id: 9, name: '最强王者', level: 9, minStars: 1, maxStars: 5, requiredCheckIns: 300, color: 'red' },
    { id: 10, name: '非凡王者', level: 10, minStars: 1, maxStars: 5, requiredCheckIns: 400, color: 'amber' },
    { id: 11, name: '至圣王者', level: 11, minStars: 1, maxStars: 5, requiredCheckIns: 500, color: 'rose' },
    { id: 12, name: '荣耀王者', level: 12, minStars: 1, maxStars: 5, requiredCheckIns: 650, color: 'violet' },
    { id: 13, name: '传奇王者', level: 13, minStars: 1, maxStars: 999, requiredCheckIns: 800, color: 'indigo' },
  ]

  const currentRank = ranks[2] // 黄金
  const currentStars = 3
  const totalCheckIns = 45

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">段位系统</h1>
          <p className="text-muted-foreground">
            通过累计打卡提升段位，每个段位都有独立的星级系统
          </p>
        </div>

        {/* 当前段位 */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span>我的段位</span>
            </CardTitle>
            <CardDescription>
              当前赛季：第 1 赛季（2026-01-01 至 2026-06-30）
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center space-x-2 mb-4">
                  <Trophy className="h-12 w-12 text-yellow-500" />
                  <div>
                    <p className="text-3xl font-bold">{currentRank.name}</p>
                    <div className="flex items-center justify-center space-x-1 mt-1">
                      {Array.from({ length: currentRank.maxStars }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < currentStars
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <Badge variant="secondary">
                    {currentStars} / {currentRank.maxStars} 星
                  </Badge>
                  <Badge variant="secondary">
                    累计打卡 {totalCheckIns} 天
                  </Badge>
                </div>
              </div>

              {/* 进度条 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>距离下一段位</span>
                  <span>
                    {totalCheckIns} / {ranks[currentRank.level].requiredCheckIns} 天
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{
                      width: `${(totalCheckIns / ranks[currentRank.level].requiredCheckIns) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  还需 {ranks[currentRank.level].requiredCheckIns - totalCheckIns} 天打卡可晋升至{' '}
                  {ranks[currentRank.level].name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 段位列表 */}
        <Card>
          <CardHeader>
            <CardTitle>所有段位</CardTitle>
            <CardDescription>
              13 个段位等级，从倔强黑铁到传奇王者
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ranks.map((rank) => {
                const isCurrent = rank.id === currentRank.id
                const isUnlocked = totalCheckIns >= rank.requiredCheckIns
                return (
                  <div
                    key={rank.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isCurrent
                        ? 'bg-primary/10 border-primary'
                        : isUnlocked
                        ? 'bg-muted/50'
                        : 'opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12">
                        <Trophy
                          className={`h-6 w-6 ${
                            isCurrent ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold">{rank.name}</p>
                          {isCurrent && (
                            <Badge variant="default" className="text-xs">
                              当前
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {rank.minStars}-{rank.maxStars} 星 · 需要 {rank.requiredCheckIns} 天打卡
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isUnlocked ? (
                        <Badge variant="secondary">已解锁</Badge>
                      ) : (
                        <Badge variant="outline">未解锁</Badge>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 段位规则说明 */}
        <Card>
          <CardHeader>
            <CardTitle>段位规则</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-2">升段机制</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>通过累计打卡天数提升段位</li>
                  <li>每个段位有独立的星级系统（1-5 星，传奇王者无上限）</li>
                  <li>达到段位要求的打卡天数后自动升段</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">降段机制</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>长期不打卡会自动降段</li>
                  <li>每相隔 1 个月不打卡降一个段位</li>
                  <li>保持活跃可以维持当前段位</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">赛季系统</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>每半年一个赛季，赛季数持续累加</li>
                  <li>赛季结束后段位会继承（例如：上赛季白金 5 星，新赛季黄金 5 星）</li>
                  <li>新赛季可以重新冲击更高段位</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

