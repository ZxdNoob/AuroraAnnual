import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Trophy, Star, Award } from 'lucide-react'

/**
 * 个人中心页面组件
 * 
 * @description 显示用户个人信息、统计数据等
 */
export default function ProfilePage() {
  // 模拟用户数据
  const userData = {
    username: '当前用户',
    email: 'user@example.com',
    nickname: '学习达人',
    avatar: '',
    role: 'USER',
    createdAt: '2025-12-01',
    totalPoints: 1250,
    currentLevel: 15,
    currentExp: 850,
    nextLevelExp: 1200,
    currentRank: '黄金',
    rankStars: 3,
    consecutiveLoginDays: 7,
    consecutiveCheckInDays: 7,
    totalCheckInDays: 45,
    badgesCount: 8,
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 页面标题 */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">个人中心</h1>
          <p className="text-muted-foreground">
            查看和管理你的个人信息
          </p>
        </div>

        {/* 用户信息卡片 */}
        <Card>
          <CardHeader>
            <CardTitle>个人信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* 头像和基本信息 */}
              <div className="flex items-center space-x-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-2xl font-bold">{userData.nickname}</h2>
                    <Badge variant="secondary">@{userData.username}</Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>注册于 {userData.createdAt}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline">编辑资料</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计数据 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总积分</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userData.totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                累计获得积分
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">当前等级</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">等级 {userData.currentLevel}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userData.currentExp} / {userData.nextLevelExp} 经验
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">当前段位</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.currentRank}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {userData.rankStars} 星
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">获得勋章</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.badgesCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                已解锁的成就勋章
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 打卡统计 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>连续登录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {userData.consecutiveLoginDays} 天
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                保持连续登录可获得额外奖励
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>连续打卡</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {userData.consecutiveCheckInDays} 天
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                连续打卡可获得积分加成
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>累计打卡</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {userData.totalCheckInDays} 天
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                总打卡天数
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-4">
          <Button>修改密码</Button>
          <Button variant="outline">账户设置</Button>
          <Button variant="outline">退出登录</Button>
        </div>
      </div>
    </MainLayout>
  )
}

