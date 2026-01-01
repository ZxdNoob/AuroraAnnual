'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Code, Trophy, Gift, Award, Zap, User, Sparkles, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

/**
 * 导航链接配置
 * 
 * @description 定义所有导航链接的配置
 * 每个链接包含：路径、标签、图标
 */
const navLinks = [
  { href: '/', label: '首页', icon: Home },
  { href: '/checkin', label: '打卡', icon: Zap },
  { href: '/code', label: '在线编码', icon: Code },
  { href: '/points', label: '积分排行', icon: Trophy },
  { href: '/ranks', label: '段位', icon: Award },
  { href: '/badges', label: '勋章', icon: Gift },
  { href: '/lottery', label: '抽奖', icon: Sparkles },
  { href: '/profile', label: '个人中心', icon: User },
]

/**
 * 头部导航组件
 * 
 * @description 包含主导航菜单和应用标题的头部组件
 * 设计特点：
 * - 玻璃态效果（毛玻璃）
 * - 响应式设计（移动端菜单）
 * - 活动状态高亮
 * - 平滑的过渡动画
 * 
 * 技术实现：
 * - 使用 backdrop-blur 实现玻璃态效果
 * - 使用 sticky 定位实现固定顶部
 * - 使用 useState 管理移动端菜单状态
 */
export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo 和标题区域 */}
        <div className="flex items-center space-x-3">
          {/* Logo图标：使用渐变背景 */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:shadow-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            {/* 标题：使用渐变文字效果 */}
            <span className="text-xl font-bold text-gradient hidden sm:block">
              全栈学习激励平台
            </span>
          </Link>
        </div>

        {/* 桌面端导航菜单 */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium',
                  'transition-all duration-200',
                  isActive
                    ? 'gradient-primary text-white shadow-lg scale-105' /* 活动状态：渐变背景、白色文字、阴影、轻微放大 */
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105' /* 非活动状态：悬停时显示背景、轻微放大 */
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="切换菜单"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* 移动端菜单：下拉菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-xl">
          <nav className="container px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium',
                    'transition-all duration-200',
                    isActive
                      ? 'gradient-primary text-white shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
