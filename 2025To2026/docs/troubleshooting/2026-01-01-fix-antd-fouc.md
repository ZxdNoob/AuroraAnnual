# 踩坑记录：修复 Ant Design FOUC (Flash of Unstyled Content) 问题

## 基本信息

- **日期**：2026-01-01 21:30:00
- **问题类型**：UI 样式加载 / FOUC 问题
- **严重程度**：中等（影响用户体验）
- **解决时间**：约 30 分钟

## 问题描述

### 现象

首页在初始加载时样式没有生效，需要等待一段时间后样式才恢复正常。页面会出现短暂的未样式化内容闪烁。

### 环境信息

- Next.js: 14.2.0
- Ant Design: 6.1.3
- React: 19.2.0

### 问题表现

1. **初始加载**：页面显示时，Ant Design 组件没有样式
2. **样式延迟**：需要等待 JavaScript 执行完成后，样式才被注入
3. **视觉闪烁**：用户可以看到未样式化的内容，然后突然变成有样式的版本

### 根本原因

Ant Design v5+ 使用 **CSS-in-JS** 技术，样式是在客户端运行时动态注入的：

1. **服务端渲染（SSR）**：Next.js 在服务端渲染 HTML，但此时 Ant Design 的样式还没有生成
2. **客户端 Hydration**：React 在客户端接管页面，Ant Design 开始生成样式
3. **样式注入延迟**：样式需要时间生成和注入到 `<head>` 中
4. **FOUC 发生**：在样式注入完成前，用户看到的是未样式化的内容

### 技术原理

#### Ant Design CSS-in-JS 工作原理

```typescript
// Ant Design 内部（简化版）
function Button() {
  // 使用 CSS-in-JS 生成样式
  const styles = useStyleRegister(
    { theme, token, path: ['Button'] },
    () => ({
      // 动态生成 CSS
      '.ant-btn': {
        borderRadius: token.borderRadius,
        height: token.controlHeight,
        // ...
      }
    })
  )
  
  return <button className={styles.className}>按钮</button>
}
```

#### FOUC 发生的时间线

```
时间轴：
0ms    - 服务端渲染 HTML（无样式）
100ms  - HTML 传输到浏览器
200ms  - 浏览器开始解析 HTML（显示未样式化内容）❌ FOUC 发生
300ms  - JavaScript 开始执行
400ms  - React Hydration 开始
500ms  - Ant Design 开始生成样式
600ms  - 样式注入到 <head>
700ms  - 样式生效（页面恢复正常）✅
```

## 解决方案

### 方案：使用 Ant Design SSR 样式提取

使用 `@ant-design/cssinjs` 提供的 SSR 支持，在服务端预提取样式并注入到 HTML 中。

### 实现步骤

#### 步骤 1：安装依赖

```bash
npm install @ant-design/cssinjs
```

#### 步骤 2：创建样式注册器

**文件**：`frontend/src/lib/antd-registry.tsx`

```typescript
'use client'

import { useServerInsertedHTML } from 'next/navigation'
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs'
import { useState, useEffect } from 'react'

export function AntdRegistry({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => createCache())

  // 在服务端渲染时提取样式并注入到 <head>
  useServerInsertedHTML(() => {
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    )
  })

  // 在客户端 hydration 完成后，标记样式已加载
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.classList.add('antd-ready')
      }, 0)
    })
    
    return () => {
      cancelAnimationFrame(timer)
    }
  }, [])

  return <StyleProvider cache={cache}>{children}</StyleProvider>
}
```

**关键点**：
- `createCache()`：创建样式缓存
- `extractStyle()`：提取生成的样式
- `useServerInsertedHTML()`：Next.js Hook，在服务端注入 HTML
- `StyleProvider`：包装应用，提供样式上下文

#### 步骤 3：在 Layout 中使用

**文件**：`frontend/src/app/layout.tsx`

```typescript
import { AntdRegistry } from '@/lib/antd-registry'
import { AntdProvider } from '@/components/providers/antd-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <AntdProvider>
            {children}
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
```

**关键点**：
- `AntdRegistry` 必须包裹 `AntdProvider`
- 这样可以确保样式在服务端就被提取和注入

#### 步骤 4：添加平滑过渡效果（可选）

**文件**：`frontend/src/app/globals.scss`

```scss
/**
 * 防止 FOUC (Flash of Unstyled Content)
 * 使用平滑的淡入效果
 */
html:not(.antd-ready) body {
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

html.antd-ready body {
  opacity: 1;
}
```

**工作原理**：
- 初始状态：`html` 没有 `antd-ready` 类，`body` 透明度为 0
- 样式加载完成：`AntdRegistry` 添加 `antd-ready` 类
- 平滑显示：`body` 透明度变为 1，使用 CSS transition 实现平滑过渡

### 优化后的时间线

```
时间轴（优化后）：
0ms    - 服务端渲染 HTML
100ms  - 服务端提取 Ant Design 样式 ✅
200ms  - 样式注入到 HTML <head> ✅
300ms  - HTML 传输到浏览器（已包含样式）
400ms  - 浏览器解析 HTML（样式已存在）✅ 无 FOUC
500ms  - JavaScript 执行
600ms  - React Hydration
700ms  - 添加 'antd-ready' 类，平滑显示 ✅
```

## 验证方法

### 验证步骤

1. **清除浏览器缓存**
   ```bash
   # 或使用浏览器开发者工具清除缓存
   ```

2. **检查 HTML 源码**
   - 打开浏览器开发者工具
   - 查看 `<head>` 部分
   - 应该能看到 `<style id="antd">...</style>` 标签
   - 标签内应该包含 Ant Design 的 CSS 样式

3. **检查网络请求**
   - 打开 Network 标签
   - 刷新页面
   - 不应该看到额外的 CSS 文件请求（样式已在 HTML 中）

4. **检查视觉效果**
   - 刷新页面
   - 页面应该立即显示正确的样式
   - 不应该有样式闪烁

### 验证结果

✅ **样式预提取**：服务端成功提取样式
✅ **样式注入**：样式已注入到 HTML `<head>`
✅ **无 FOUC**：页面初始加载时样式已生效
✅ **平滑过渡**：使用淡入效果，用户体验更好

## 经验总结

### 预防措施

1. **使用 SSR 样式提取**：
   - 对于使用 CSS-in-JS 的库（如 Ant Design、Material-UI），必须使用 SSR 支持
   - 在 Next.js App Router 中，使用 `useServerInsertedHTML` Hook

2. **测试 FOUC**：
   - 使用慢速网络（Chrome DevTools Network Throttling）
   - 清除浏览器缓存
   - 检查初始 HTML 源码

3. **性能优化**：
   - 样式预提取可以减少客户端工作量
   - 平滑过渡可以改善用户体验

### 最佳实践

1. **样式提取顺序**：
   - `AntdRegistry` 必须包裹 `AntdProvider`
   - 确保样式上下文正确传递

2. **过渡效果**：
   - 使用 `opacity` 而不是 `visibility`
   - 使用 CSS `transition` 实现平滑过渡
   - 避免完全隐藏内容（影响 SEO）

3. **缓存管理**：
   - 使用 `createCache()` 创建样式缓存
   - 确保缓存正确传递

### 技术要点

1. **@ant-design/cssinjs**：
   - Ant Design v5+ 的样式引擎
   - 支持 SSR 样式提取
   - 提供 `StyleProvider`、`extractStyle` 等 API

2. **Next.js useServerInsertedHTML**：
   - Next.js 13+ App Router 的 Hook
   - 用于在服务端注入 HTML
   - 必须在客户端组件中使用

3. **CSS-in-JS SSR**：
   - 服务端提取样式
   - 注入到 HTML
   - 客户端 hydration 时复用样式

## 相关技术深入学习

### Ant Design CSS-in-JS

- **官方文档**：https://ant.design/docs/react/customize-theme-cn#theme
- **CSS-in-JS 原理**：https://ant.design/docs/react/customize-theme-cn#cssinjs
- **SSR 支持**：https://ant.design/docs/react/ssr-cn

### Next.js SSR

- **Next.js 文档**：https://nextjs.org/docs
- **App Router SSR**：https://nextjs.org/docs/app/building-your-application/rendering/server-components
- **useServerInsertedHTML**：https://nextjs.org/docs/app/api-reference/functions/use-server-inserted-html

### FOUC 问题

- **FOUC 定义**：Flash of Unstyled Content
- **常见原因**：CSS-in-JS、异步加载样式、样式加载延迟
- **解决方案**：SSR 样式提取、内联关键 CSS、预加载样式

## 参考资料

- [Ant Design SSR 文档](https://ant.design/docs/react/ssr-cn)
- [@ant-design/cssinjs 文档](https://github.com/ant-design/cssinjs)
- [Next.js useServerInsertedHTML](https://nextjs.org/docs/app/api-reference/functions/use-server-inserted-html)
- [FOUC 问题详解](https://web.dev/critical-rendering-path-render-blocking-css/)

## 后续建议

1. **性能监控**：
   - 监控样式提取时间
   - 监控页面加载时间
   - 使用 Lighthouse 检查性能

2. **进一步优化**：
   - 考虑使用关键 CSS 提取
   - 优化样式缓存策略
   - 减少不必要的样式生成

3. **测试覆盖**：
   - 添加 FOUC 测试
   - 测试不同网络条件
   - 测试不同设备

---

**最后更新时间**：2026-01-01 21:30:00

