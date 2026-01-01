'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs'
import { useState, useEffect } from 'react'

/**
 * Ant Design 样式注册器
 * 
 * @description 解决 FOUC (Flash of Unstyled Content) 问题
 * 通过服务端样式提取，在客户端 hydration 之前注入样式
 * 
 * 工作原理：
 * 1. 使用 @ant-design/cssinjs 的 StyleProvider 和 extractStyle
 * 2. 在服务端渲染时提取样式
 * 3. 在客户端 hydration 之前注入样式到 <head>
 * 4. 样式加载完成后，添加 'antd-ready' 类到 html 元素，显示内容
 * 5. 避免样式闪烁
 */
export function AntdRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => createCache())

  useServerInsertedHTML(() => {
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    )
  })

  // 在客户端 hydration 完成后，标记样式已加载
  // 注意：由于使用了 SSR 样式提取，样式已经在 HTML 中，所以可以立即标记
  useEffect(() => {
    // 立即标记，因为样式已经在服务端注入
    document.documentElement.classList.add('antd-ready')
  }, [])

  return <StyleProvider cache={cache}>{children}</StyleProvider>
}
