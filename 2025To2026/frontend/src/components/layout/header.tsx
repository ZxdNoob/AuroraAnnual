'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layout, Menu, Button, Space, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  HomeOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  TrophyOutlined,
  GiftOutlined,
  StarOutlined,
  FireOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from '@ant-design/icons'
import { useState, useMemo, useEffect } from 'react'
import { Logo } from './logo'
import { HamburgerIcon } from './hamburger-icon'
import { useAuth } from '@/contexts/auth-context'
import styles from './header.module.scss'

const { Header: AntHeader } = Layout

/**
 * 头部导航组件
 * 
 * @description 使用 Ant Design Layout 和 Menu 组件
 * 
 * 修复 Hydration 错误：
 * - 将 navItems 移到组件内部，使用 useMemo 优化
 * - 使用 useEffect 确保 pathname 在客户端 hydration 后更新
 * - 确保服务端和客户端渲染一致
 */
export function Header() {
  const pathnameFromHook = usePathname()
  const router = useRouter()
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const [pathname, setPathname] = useState<string>('/')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 确保 pathname 在客户端 hydration 后更新，避免 SSR 和客户端不一致
  useEffect(() => {
    setMounted(true)
    if (pathnameFromHook) {
      setPathname(pathnameFromHook)
    }
  }, [pathnameFromHook])

  // 在客户端 hydration 完成之前，不渲染依赖认证状态的内容
  // 这样可以避免服务端和客户端渲染不一致导致的 Hydration 错误
  const shouldShowAuthContent = mounted && !isLoading

  // 判断当前是否在登录或注册页面
  // 在这些页面时，PC 端不显示登录/注册按钮（用户已经在这些页面了）
  // 使用 pathnameFromHook 确保判断准确（Next.js 提供的当前路径）
  const isAuthPage = pathnameFromHook === '/login' || pathnameFromHook === '/register'
  
  // 判断是否在首页且未登录（首页会显示"请先登录"提示）
  // 在这种情况下，也不显示右上角的登录/注册按钮，避免重复
  // 注意：只有在认证状态加载完成后（shouldShowAuthContent 为 true）才使用此判断
  const isHomePageWithoutAuth = shouldShowAuthContent && pathnameFromHook === '/' && !isAuthenticated

  /**
   * 导航链接配置
   * 
   * 使用 useMemo 优化性能，避免每次渲染都重新创建
   * 将 navItems 放在组件内部，确保 SSR 和客户端渲染一致
   * 
   * 业界最佳实践：未登录时不显示任何导航菜单，只显示 Logo 和登录/注册按钮
   * 已登录时显示完整的导航菜单
   * 
   * 注意：只有在客户端 hydration 完成后才根据认证状态返回不同的菜单项
   */
  const navItems: MenuProps['items'] = useMemo(() => {
    // 在客户端 hydration 完成之前，返回空数组，确保服务端和客户端一致
    if (!shouldShowAuthContent) {
      return []
    }

    // 未登录时，不显示任何导航菜单项
    if (!isAuthenticated) {
      return []
    }

    // 已登录时，显示完整的导航菜单
    return [
      {
        key: '/',
        label: <Link href="/">首页</Link>,
        icon: <HomeOutlined />,
      },
      {
        key: '/checkin',
        label: <Link href="/checkin">打卡</Link>,
        icon: <ThunderboltOutlined />,
      },
      {
        key: '/code',
        label: <Link href="/code">在线编码</Link>,
        icon: <CodeOutlined />,
      },
      {
        key: '/points',
        label: <Link href="/points">积分排行</Link>,
        icon: <TrophyOutlined />,
      },
      {
        key: '/ranks',
        label: <Link href="/ranks">段位</Link>,
        icon: <StarOutlined />,
      },
      {
        key: '/badges',
        label: <Link href="/badges">勋章</Link>,
        icon: <GiftOutlined />,
      },
      {
        key: '/lottery',
        label: <Link href="/lottery">抽奖</Link>,
        icon: <FireOutlined />,
      },
      {
        key: '/profile',
        label: <Link href="/profile">个人中心</Link>,
        icon: <UserOutlined />,
      },
    ]
  }, [isAuthenticated, shouldShowAuthContent])

  return (
    <AntHeader className={styles.header}>
      <div className={styles.container}>
        {/* Logo 和标题区域 */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <Logo size={40} />
            </div>
            <span className={styles.logoText}>全栈学习激励平台</span>
          </Link>
        </div>

        {/* 桌面端导航菜单 - 只有登录用户才显示，且客户端 hydration 完成后 */}
        {shouldShowAuthContent && isAuthenticated && (
          <Menu
            mode="horizontal"
            selectedKeys={mounted ? [pathname] : []}
            items={navItems}
            className={styles.desktopMenu}
            suppressHydrationWarning
          />
        )}

        {/* 用户操作区域 - 客户端 hydration 完成后才显示 */}
        {/* 在登录/注册页面或首页（未登录时）时，PC 端不显示登录/注册按钮 */}
        {shouldShowAuthContent ? (
          // 已登录用户：始终显示用户菜单
          // 未登录用户：在登录/注册页面或首页时不显示登录/注册按钮（避免重复）
          (isAuthenticated || (!isAuthPage && !isHomePageWithoutAuth)) && (
            <Space className={styles.userActions} suppressHydrationWarning>
              {isAuthenticated ? (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'profile',
                        label: <Link href="/profile">个人中心</Link>,
                        icon: <UserOutlined />,
                      },
                      {
                        type: 'divider',
                      },
                      {
                        key: 'logout',
                        label: '退出登录',
                        icon: <LogoutOutlined />,
                        onClick: () => logout(),
                      },
                    ],
                  }}
                  placement="bottomRight"
                >
                  <Button type="text" className={styles.userButton}>
                    <UserOutlined />
                    <span className={styles.userName}>{user?.nickname || user?.username}</span>
                  </Button>
                </Dropdown>
              ) : (
                <Space>
                  <Button type="text" onClick={() => router.push('/login')}>
                    <LoginOutlined />
                    登录
                  </Button>
                  <Button type="primary" onClick={() => router.push('/register')}>
                    注册
                  </Button>
                </Space>
              )}
            </Space>
          )
        ) : null}

        {/* 移动端菜单按钮 - 只有登录用户才显示，且客户端 hydration 完成后 */}
        {shouldShowAuthContent && isAuthenticated && (
          <Button
            type="text"
            className={styles.mobileMenuButton}
            icon={<HamburgerIcon isOpen={mobileMenuOpen} />}
            onClick={(e) => {
              e.stopPropagation()
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
            suppressHydrationWarning
          />
        )}
      </div>

      {/* 移动端菜单 - 只有登录用户才显示，且客户端 hydration 完成后 */}
      {shouldShowAuthContent && isAuthenticated && mobileMenuOpen && (
        <div className={styles.mobileMenu} suppressHydrationWarning>
          <Menu
            mode="vertical"
            selectedKeys={mounted ? [pathname] : []}
            items={navItems}
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}
    </AntHeader>
  )
}
