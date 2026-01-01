# Next.js App Router 学习笔记

## 概述

Next.js 14+ 引入了 App Router，这是一个基于 React Server Components 的新路由系统。

## 核心概念

### 1. 文件系统路由

在 `app` 目录中，文件结构自动映射到路由：

```
app/
├── page.tsx          → /
├── about/
│   └── page.tsx      → /about
└── blog/
    ├── page.tsx      → /blog
    └── [slug]/
        └── page.tsx  → /blog/:slug
```

### 2. 服务端组件（Server Components）

默认情况下，所有组件都是服务端组件。

```typescript
// app/page.tsx
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}
```

### 3. 客户端组件（Client Components）

使用 `'use client'` 指令标记客户端组件。

```typescript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 4. 布局（Layouts）

布局组件在多个页面间共享。

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### 5. 数据获取

在服务端组件中直接使用 `fetch`，Next.js 会自动缓存。

```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store', // 禁用缓存
  });
  return res.json();
}
```

## 最佳实践

1. **优先使用服务端组件**：减少客户端 JavaScript 体积
2. **合理使用客户端组件**：只在需要交互时使用
3. **使用 Suspense**：实现流式渲染
4. **优化图片**：使用 `next/image` 组件
5. **环境变量**：使用 `NEXT_PUBLIC_` 前缀暴露给客户端

## 参考资料

- [Next.js App Router 文档](https://nextjs.org/docs/app)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023)

---

**最后更新时间**：2026-01-01 14:46:07

