import { Header } from './header'

/**
 * 主布局组件属性接口
 */
interface MainLayoutProps {
  children: React.ReactNode
}

/**
 * 主布局组件
 * 
 * @description 包含头部导航和应用主内容区域的布局组件
 * 设计特点：
 * - 网格背景装饰
 * - 渐变遮罩
 * - 响应式容器
 * - 适当的间距和填充
 * 
 * 布局结构：
 * - Header: 固定顶部导航栏
 * - Main: 主内容区域（包含容器和内边距）
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* 背景装饰层 */}
      {/* 网格背景：使用CSS渐变创建网格图案 */}
      <div className="fixed inset-0 -z-10 bg-grid opacity-30" />
      
      {/* 渐变遮罩：添加微妙的渐变色彩 */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      {/* 头部导航 */}
      <Header />
      
      {/* 主内容区域 */}
      <main className="container mx-auto px-4 py-8 md:py-12 relative">
        {/* 使用相对定位，确保内容在背景装饰之上 */}
        {children}
      </main>
    </div>
  )
}
