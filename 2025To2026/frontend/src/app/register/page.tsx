'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Card, message, Typography } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { MainLayout } from '@/components/layout/main-layout'
import styles from './register.module.scss'

const { Title, Text } = Typography

/**
 * 注册页面组件
 * 
 * @description 用户注册页面，创建新账户
 */
export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, isAuthenticated } = useAuth()
  const [form] = Form.useForm()
  const [mounted, setMounted] = useState(false)

  // 确保只在客户端 hydration 后检查认证状态
  useEffect(() => {
    setMounted(true)
  }, [])

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/')
    }
  }, [mounted, isAuthenticated, router])

  // 在客户端 hydration 完成之前，不进行重定向检查
  if (!mounted || isAuthenticated) {
    return null
  }

  /**
   * 处理注册提交
   */
  const handleSubmit = async (values: {
    email: string
    username: string
    password: string
    confirmPassword: string
    nickname?: string
  }) => {
    try {
      await register({
        email: values.email,
        username: values.username,
        password: values.password,
        nickname: values.nickname,
      })
    } catch (error) {
      // 错误已在 register 函数中处理
      console.error('注册失败:', error)
    }
  }

  return (
    <MainLayout>
      <div className={styles.container}>
        <Card className={styles.registerCard}>
          <div className={styles.header}>
            <Title level={2} className={styles.title}>
              创建账户
            </Title>
            <Text type="secondary" className={styles.subtitle}>
              加入我们，开始您的学习之旅
            </Text>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入邮箱地址' },
                { type: 'email', message: '邮箱格式不正确' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱地址"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 3, message: '用户名至少 3 个字符' },
                { max: 20, message: '用户名最多 20 个字符' },
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: '用户名只能包含字母、数字和下划线',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名（3-20 个字符）"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少 6 个字符' },
                { max: 50, message: '密码最多 50 个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码（至少 6 个字符）"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="nickname"
              rules={[
                { max: 50, message: '昵称最多 50 个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="昵称（可选）"
                autoComplete="nickname"
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
                注册
              </Button>
            </Form.Item>
          </Form>

          <div className={styles.footer}>
            <Text type="secondary">
              已有账户？{' '}
              <Link href="/login" className={styles.link}>
                立即登录
              </Link>
            </Text>
          </div>
        </Card>
      </div>
    </MainLayout>
  )
}

