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

### 5. TypeScript 编译错误导致后端服务无法启动

**问题描述**：运行 `npm run start:dev` 时后端服务无法启动，`npm run build` 出现多个 TypeScript 编译错误

**常见原因**：
- 装饰器使用错误（如 `@ApiQuery` 位置不正确）
- 类型不匹配（Prisma 返回 `null`，但 DTO 期望 `undefined`）
- 缺失函数导入
- 类型推断失败（循环中的复杂类型）

**快速解决方案**：

```bash
# 1. 检查编译错误
cd backend
npm run build

# 2. 根据错误信息修复：
# - 装饰器问题：确保 @ApiQuery 在方法上，@Query 在参数上
# - 类型转换：使用 value ?? undefined 将 null 转换为 undefined
# - 缺失导入：添加必要的 import 语句
# - 类型推断：显式指定变量类型

# 3. 重新编译
npm run build

# 4. 启动服务
npm run start:dev
```

**详细解决方案**：请查看 [TypeScript 编译错误详细记录](./2026-01-01-typescript-compilation-errors.md)

### 6. 类型错误（通用）

**问题描述**：TypeScript 类型检查失败

**解决方案**：

1. 运行 `npm run build` 查看详细错误
2. 检查类型定义是否正确
3. 使用类型断言（谨慎使用）

### 7. 前端服务无法启动（Tailwind CSS 配置问题）

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

**最后更新时间**：2026-01-01 20:54:18
