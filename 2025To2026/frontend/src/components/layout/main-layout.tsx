'use client'

import { Layout } from 'antd'
import { Header } from './header'
import styles from './main-layout.module.scss'

const { Content } = Layout

/**
 * 主布局组件属性接口
 */
interface MainLayoutProps {
  children: React.ReactNode
}

/**
 * 主布局组件
 * 
 * @description 使用 Ant Design Layout 组件
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Layout className={styles.layout}>
      {/* 头部导航 */}
      <Header />

      {/* 主内容区域 */}
      <Content className={styles.content}>
        <div className={styles.container}>
          {children}
        </div>
      </Content>
    </Layout>
  )
}
