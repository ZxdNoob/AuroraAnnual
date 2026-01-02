'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ExperienceBar } from '@/components/dashboard/experience-bar'
import { 
  Card, 
  Button, 
  Badge, 
  Row, 
  Col, 
  Space, 
  Typography, 
  Spin,
  Empty,
  List,
  Avatar,
} from 'antd'
import {
  TrophyOutlined,
  ThunderboltOutlined,
  GiftOutlined,
  CodeOutlined,
  StarOutlined,
  CalendarOutlined,
  SafetyOutlined,
  FireOutlined,
  RightOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useRecentActivities, type ActivityItem } from '@/hooks/useRecentActivities'
import styles from './page.module.scss'

const { Title, Paragraph, Text } = Typography

/**
 * 获取活动图标
 */
function getActivityIcon(type: string) {
  switch (type) {
    case 'CHECK_IN':
      return <ThunderboltOutlined />
    case 'CODE':
      return <CodeOutlined />
    case 'BADGE':
      return <SafetyOutlined />
    case 'LOTTERY':
      return <GiftOutlined />
    default:
      return <FireOutlined />
  }
}

/**
 * 获取活动颜色
 * 
 * @description 统一使用主色调，保持视觉一致性
 */
function getActivityColor(type: string): string {
  // 所有活动类型统一使用主色调，保持设计一致性
  return '#6366f1'
}

/**
 * 首页组件
 * 
 * @description 使用 Ant Design 组件构建的首页
 */
export default function HomePage() {
  // 获取用户资料数据
  const { data: userProfileData, isLoading: profileLoading } = useUserProfile()
  const { data: activities = [], isLoading: activitiesLoading } = useRecentActivities(10)

  // 如果数据加载中，显示加载状态（但显示骨架屏而不是完全空白）
  if (profileLoading) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <Card loading className={styles.heroCard} style={{ minHeight: '200px' }} />
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4].map((i) => (
              <Col key={i} xs={24} sm={12} lg={6}>
                <Card loading />
              </Col>
            ))}
          </Row>
        </div>
      </MainLayout>
    )
  }

  // 如果未登录或数据加载失败，显示提示
  if (!userProfileData) {
    return (
      <MainLayout>
        <div className={styles.container}>
          <Card className={styles.heroCard}>
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <h2 style={{ color: 'white', marginBottom: '16px' }}>请先登录</h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '24px' }}>
                登录后即可查看您的学习数据和统计信息
              </p>
              <Space>
                <Button type="default" size="large" href="/login" style={{ background: 'white' }}>
                  登录
                </Button>
                <Button type="default" size="large" href="/register" style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                  注册
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </MainLayout>
    )
  }

  // 使用真实用户数据
  const userStats = {
    totalPoints: userProfileData.profile.totalPoints,
    currentLevel: userProfileData.profile.currentLevel,
    currentExp: userProfileData.profile.currentExp,
    nextLevelExp: userProfileData.profile.nextLevelExp,
    currentRank: userProfileData.rank?.name || '倔强黑铁',
    rankStars: userProfileData.rank ? Math.min(5, Math.max(1, userProfileData.profile.totalCheckInDays % 5 || 1)) : 1,
    consecutiveCheckInDays: userProfileData.profile.consecutiveCheckInDays,
    totalCheckInDays: userProfileData.profile.totalCheckInDays,
    badgesCount: 0,
    season: userProfileData.rank?.season || 1,
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        {/* ========== 欢迎区域（Hero Section）========== */}
        <Card className={styles.heroCard}>
          <div>
            <div className={styles.heroWelcomeGreeting}>
              <span className={styles.heroWelcomeText}>欢迎回来</span>
            </div>
            <Title level={1} className={styles.heroTitle}>
              继续你的学习之旅
            </Title>
            <Paragraph className={styles.heroDescription}>
              每天进步一点点，通过打卡、编码练习、完成任务来获得积分和经验，提升段位，解锁更多成就！
            </Paragraph>
            <div className={styles.heroButtons}>
              <Link href="/checkin">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ThunderboltOutlined />}
                  className={styles.heroPrimaryButton}
                >
                  立即打卡
                </Button>
              </Link>
              <Link href="/code">
                <Button 
                  size="large" 
                  icon={<CodeOutlined />}
                  className={styles.heroSecondaryButton}
                >
                  开始编码
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        {/* ========== 快速操作卡片 ========== */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable 
              className={styles.actionCard}
              actions={[
                <Link key="checkin" href="/checkin">
                  <Button type="primary" block size="large">立即打卡</Button>
                </Link>
              ]}
            >
              <Card.Meta
                avatar={<div className={styles.iconWrapper}>
                  <ThunderboltOutlined />
                </div>}
                title="每日打卡"
                description={`连续${userStats.consecutiveCheckInDays}天打卡中`}
              />
              <div className={styles.actionContent}>
                <div>
                  <span className={styles.actionValue}>{userStats.consecutiveCheckInDays}</span>
                  <span className={styles.actionValueLabel}> 天</span>
                </div>
                <Text type="secondary" className={styles.actionSubText}>
                  累计打卡 {userStats.totalCheckInDays} 天
                </Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable 
              className={styles.actionCard}
              actions={[
                <Link key="code" href="/code">
                  <Button block size="large">进入编辑器</Button>
                </Link>
              ]}
            >
              <Card.Meta
                avatar={<div className={styles.iconWrapper}>
                  <CodeOutlined />
                </div>}
                title="在线编码"
                description="专业代码编辑器"
              />
              <div className={styles.actionContent}>
                <Text strong style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.85)' }}>练习编程</Text>
                <Text type="secondary" className={styles.actionSubText}>提升技能</Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable 
              className={styles.actionCard}
              actions={[
                <Link key="lottery" href="/lottery">
                  <Button type="primary" block size="large">立即抽奖</Button>
                </Link>
              ]}
            >
              <Card.Meta
                avatar={<div className={styles.iconWrapper}>
                  <GiftOutlined />
                </div>}
                title="每日抽奖"
                description="免费抽奖机会"
              />
              <div className={styles.actionContent}>
                <Text strong style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.85)' }}>有机会获得</Text>
                <Text type="secondary" className={styles.actionSubText}>丰厚奖励</Text>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card 
              hoverable 
              className={styles.actionCard}
              actions={[
                <Link key="ranks" href="/ranks">
                  <Button block size="large">查看详情</Button>
                </Link>
              ]}
            >
              <Card.Meta
                avatar={<div className={styles.iconWrapper}>
                  <TrophyOutlined />
                </div>}
                title="我的段位"
                description={`${userStats.currentRank}${userStats.rankStars}星`}
              />
              <div className={styles.actionContent}>
                <Space align="baseline" size={8}>
                  <Text strong style={{ fontSize: '20px', color: 'rgba(0, 0, 0, 0.85)' }}>
                    {userStats.currentRank}
                  </Text>
                  <Badge 
                    count={userStats.rankStars} 
                    style={{ 
                      backgroundColor: '#6366f1',
                      fontSize: '12px',
                      minWidth: '20px',
                      height: '20px',
                      lineHeight: '20px',
                      padding: '0 6px',
                    }} 
                  />
                </Space>
                <Text type="secondary" className={styles.actionSubText}>查看段位详情</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ========== 统计信息卡片 ========== */}
        <Row gutter={[16, 16]} style={{ marginTop: 8 }}>
          <Col xs={12} sm={12} lg={6}>
            <StatsCard
              title="总积分"
              value={userStats.totalPoints.toLocaleString()}
              description="累计获得积分"
              icon={<TrophyOutlined />}
              gradient
            />
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <StatsCard
              title="当前等级"
              value={userStats.currentLevel}
              description="经验等级"
              icon={<StarOutlined />}
            />
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <StatsCard
              title="连续打卡"
              value={`${userStats.consecutiveCheckInDays}天`}
              description="保持打卡可获得额外奖励"
              icon={<CalendarOutlined />}
            />
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <StatsCard
              title="获得勋章"
              value={userStats.badgesCount}
              description="已解锁的成就勋章"
              icon={<SafetyOutlined />}
            />
          </Col>
        </Row>

        {/* ========== 经验进度和段位信息 ========== */}
        <Row gutter={[16, 16]} className={styles.equalHeightRow} style={{ marginTop: 8 }}>
          <Col xs={24} md={24} lg={12} style={{ display: 'flex' }}>
            <ExperienceBar
              currentExp={userStats.currentExp}
              nextLevelExp={userStats.nextLevelExp}
              currentLevel={userStats.currentLevel}
            />
          </Col>

          <Col xs={24} md={24} lg={12} style={{ display: 'flex' }}>
            <Card 
              title={
                <Space>
                  <TrophyOutlined style={{ color: '#6366f1' }} />
                  <span>段位信息</span>
                </Space>
              }
              hoverable
              style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className={styles.rankIcon}>
                    <TrophyOutlined style={{ fontSize: '32px', color: '#fff' }} />
                  </div>
                  <div>
                    <Title level={3} style={{ margin: 0 }}>{userStats.currentRank}</Title>
                    <Space>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarOutlined
                          key={i}
                          style={{
                            color: i < userStats.rankStars ? '#6366f1' : '#d9d9d9',
                            fontSize: '16px',
                          }}
                        />
                      ))}
                    </Space>
                  </div>
                </div>
                
                <div className={styles.rankInfo}>
                  <div className={styles.rankInfoItem}>
                    <Text type="secondary">当前赛季</Text>
                    <Text strong>第 {userStats.season} 赛季</Text>
                  </div>
                  <div className={styles.rankInfoItem}>
                    <Text type="secondary">累计打卡</Text>
                    <Text strong>{userStats.totalCheckInDays} 天</Text>
                  </div>
                  <div className={styles.rankInfoItem}>
                    <Text type="secondary">段位等级</Text>
                    <Badge count={`${userStats.currentRank} ${userStats.rankStars} 星`} style={{ backgroundColor: '#6366f1' }} />
                  </div>
                </div>
                
                <Link href="/ranks">
                  <Button type="primary" block icon={<RightOutlined />}>
                    查看段位详情
                  </Button>
                </Link>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* ========== 最近活动 ========== */}
        <Card
          className={styles.recentActivitiesCard}
          title={
            <Space>
              <FireOutlined style={{ color: '#6366f1' }} />
              <span>最近活动</span>
            </Space>
          }
          extra={<Text type="secondary" style={{ fontSize: '14px' }}>查看你的最新活动和成就</Text>}
          hoverable
        >
          {activitiesLoading ? (
            <div className={styles.loadingContainer}>
              <Spin />
            </div>
          ) : activities.length === 0 ? (
            <Empty description="暂无活动记录" />
          ) : (
            <List
              dataSource={activities}
              renderItem={(activity) => {
                const color = getActivityColor(activity.type)
                return (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          style={{ backgroundColor: color }}
                          icon={getActivityIcon(activity.type)}
                        />
                      }
                      title={activity.title}
                      description={activity.time}
                    />
                    {activity.reward && (
                      <Badge 
                        count={activity.reward} 
                        style={{ 
                          backgroundColor: '#6366f1'
                        }} 
                      />
                    )}
                  </List.Item>
                )
              }}
            />
          )}
        </Card>
      </div>
    </MainLayout>
  )
}
