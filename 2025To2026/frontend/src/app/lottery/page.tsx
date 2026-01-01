import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gift, Coins, Sparkles } from 'lucide-react'

/**
 * 抽奖页面组件
 * 
 * @description 每日抽奖功能页面
 */
export default function LotteryPage() {
  // 模拟奖品数据
  const prizes = [
    { id: 1, name: '红包 10 元', type: 'money', value: 10, probability: 5, icon: '💰' },
    { id: 2, name: '红包 5 元', type: 'money', value: 5, probability: 10, icon: '💰' },
    { id: 3, name: '经验加成卡', type: 'item', value: 50, probability: 15, icon: '⭐' },
    { id: 4, name: '积分加成卡', type: 'item', value: 20, probability: 20, icon: '🎁' },
    { id: 5, name: '段位加成卡', type: 'item', value: 1, probability: 10, icon: '🏆' },
    { id: 6, name: '谢谢参与', type: 'none', value: 0, probability: 40, icon: '🎫' },
  ]

  const userPoints = 1250
  const lotteryCost = 100
  const todayDrawn = false

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">每日抽奖</h1>
          <p className="text-muted-foreground">
            使用积分参与抽奖，有机会获得丰厚奖励
          </p>
        </div>

        {/* 抽奖区域 */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-primary" />
              <span>幸运抽奖</span>
            </CardTitle>
            <CardDescription>
              每次抽奖消耗 {lotteryCost} 积分
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 用户积分信息 */}
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="font-semibold">我的积分</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {userPoints.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    可抽奖 {Math.floor(userPoints / lotteryCost)} 次
                  </p>
                </div>
              </div>

              {/* 抽奖转盘区域 */}
              <div className="border-2 border-dashed rounded-lg p-8 bg-muted/50">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 border-4 border-primary">
                      <Sparkles className="h-16 w-16 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">点击开始抽奖</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      消耗 {lotteryCost} 积分，获得随机奖励
                    </p>
                  </div>
                  <Button size="lg" disabled={userPoints < lotteryCost || todayDrawn}>
                    <Gift className="mr-2 h-4 w-4" />
                    {todayDrawn ? '今日已抽奖' : '开始抽奖'}
                  </Button>
                  {todayDrawn && (
                    <p className="text-sm text-muted-foreground">
                      明天再来试试吧！
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 奖品列表 */}
        <Card>
          <CardHeader>
            <CardTitle>奖品列表</CardTitle>
            <CardDescription>
              所有可能的奖品和获得概率
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prizes.map((prize) => (
                <div
                  key={prize.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{prize.icon}</div>
                    <div>
                      <p className="font-semibold">{prize.name}</p>
                      {prize.type === 'money' && (
                        <p className="text-sm text-muted-foreground">
                          现金奖励：{prize.value} 元
                        </p>
                      )}
                      {prize.type === 'item' && (
                        <p className="text-sm text-muted-foreground">
                          道具奖励：+{prize.value}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {prize.probability}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 抽奖规则 */}
        <Card>
          <CardHeader>
            <CardTitle>抽奖规则</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-2">参与方式</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>每次抽奖消耗 {lotteryCost} 积分</li>
                  <li>每天可以免费抽奖 1 次</li>
                  <li>额外抽奖需要消耗积分</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">奖品类型</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>红包：现金奖励，直接到账</li>
                  <li>道具：经验加成卡、积分加成卡、段位加成卡等</li>
                  <li>限定奖励：活动期间的特殊奖励</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">注意事项</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>抽奖结果完全随机，公平透明</li>
                  <li>奖品会在抽中后立即发放</li>
                  <li>积分不足时无法参与抽奖</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}

