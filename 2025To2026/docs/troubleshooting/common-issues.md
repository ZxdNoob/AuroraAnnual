# 常见问题记录

## 概述

本文档记录开发过程中遇到的常见问题和解决方案。

## 问题列表

### 1. Prisma Client 未生成

**问题描述**：运行应用时提示 `PrismaClient is not initialized`

**解决方案**：

```bash
cd backend
npx prisma generate
```

### 2. 数据库连接失败

**问题描述**：无法连接到 PostgreSQL 数据库

**解决方案**：

1. 检查 `.env` 文件中的 `DATABASE_URL`
2. 确认数据库服务正在运行
3. 检查数据库用户名和密码是否正确

### 3. JWT Token 验证失败

**问题描述**：Token 验证时返回 401 错误

**解决方案**：

1. 检查 Token 是否过期
2. 确认 `JWT_SECRET` 环境变量已设置
3. 检查请求头格式：`Authorization: Bearer <token>`

### 4. CORS 跨域问题

**问题描述**：前端请求后端 API 时出现 CORS 错误

**解决方案**：

在 `main.ts` 中配置 CORS：

```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

### 5. 类型错误

**问题描述**：TypeScript 类型检查失败

**解决方案**：

1. 运行 `npm run build` 查看详细错误
2. 检查类型定义是否正确
3. 使用类型断言（谨慎使用）

### 6. 前端服务无法启动（Tailwind CSS 配置问题）

**问题描述**：访问 `http://localhost:3000` 时页面卡住或返回 500 错误

**常见原因**：
- Tailwind CSS 依赖缺失或版本不兼容
- PostCSS 配置错误（Tailwind CSS v4 需要使用 `@tailwindcss/postcss`）
- CSS 语法错误（`@apply` 指令使用不当）

**快速解决方案**：

```bash
# 1. 安装缺失的依赖
cd frontend
npm install -D tailwindcss postcss autoprefixer tailwindcss-animate @tailwindcss/postcss --legacy-peer-deps

# 2. 清理缓存
rm -rf .next

# 3. 重启服务
npm run dev
```

**详细解决方案**：请查看 [项目启动问题详细记录](./2026-01-01-project-startup-issues.md)

---

**最后更新时间**：2026-01-01 15:42:24

