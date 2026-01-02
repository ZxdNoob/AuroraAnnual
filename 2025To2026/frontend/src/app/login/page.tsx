'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Form, Input, Button, Card, message, Typography, Space } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { MainLayout } from '@/components/layout/main-layout'
import styles from './login.module.scss'

const { Title, Text } = Typography

/**
 * 登录页面组件
 * 
 * @description 用户登录页面，支持用户名或邮箱登录
 */
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isLoading, isAuthenticated } = useAuth()
  const [form] = Form.useForm()
  const [mounted, setMounted] = useState(false)

  // 确保只在客户端 hydration 后检查认证状态
  useEffect(() => {
    setMounted(true)
  }, [])

  // 如果已登录，重定向到首页或指定页面
  useEffect(() => {
    if (mounted && isAuthenticated) {
      const redirect = searchParams.get('redirect')
      router.push(redirect || '/')
    }
  }, [mounted, isAuthenticated, router, searchParams])

  // 在客户端 hydration 完成之前，不进行重定向检查
  if (!mounted || isAuthenticated) {
    return null
  }

  /**
   * 处理登录提交
   */
  const handleSubmit = async (values: { usernameOrEmail: string; password: string }) => {
    try {
      await login({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      })
      // 登录成功后，重定向到指定页面或首页
      const redirect = searchParams.get('redirect')
      router.push(redirect || '/')
    } catch (error) {
      // 错误已在 login 函数中处理
      console.error('登录失败:', error)
    }
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <Card className={styles.loginCard}>
          <div className={styles.header}>
            <Title level={2} className={styles.title}>
              欢迎回来
            </Title>
            <Text type="secondary" className={styles.subtitle}>
              登录您的账户以继续
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="usernameOrEmail"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名或邮箱"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少 6 个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={mounted && isLoading}
                className={styles.submitButton}
                suppressHydrationWarning
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <Text type="secondary">
              还没有账户？{' '}
              <Link href="/register" className={styles.link}>
                立即注册
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

