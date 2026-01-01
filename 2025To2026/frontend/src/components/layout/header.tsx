'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Layout, Menu, Button, Space } from 'antd'
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
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import { useState, useMemo, useEffect } from 'react'
import { Logo } from './logo'
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

  /**
   * 导航链接配置
   * 
   * 使用 useMemo 优化性能，避免每次渲染都重新创建
   * 将 navItems 放在组件内部，确保 SSR 和客户端渲染一致
   */
  const navItems: MenuProps['items'] = useMemo(() => [
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
  ], [])

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

        {/* 桌面端导航菜单 */}
        <Menu
          mode="horizontal"
          selectedKeys={mounted ? [pathname] : []}
          items={navItems}
          className={styles.desktopMenu}
        />

        {/* 移动端菜单按钮 */}
        <Button
          type="text"
          className={styles.mobileMenuButton}
          icon={mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          onClick={(e) => {
            e.stopPropagation()
            setMobileMenuOpen(!mobileMenuOpen)
          }}
          aria-label={mobileMenuOpen ? '关闭菜单' : '打开菜单'}
        />
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
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
