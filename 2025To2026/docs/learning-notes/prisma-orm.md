# Prisma ORM 学习笔记

## 概述

Prisma 是一个现代化的 ORM（对象关系映射）工具，提供类型安全的数据库访问。

## 核心概念

### 1. Schema 定义

在 `schema.prisma` 中定义数据模型：

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  username  String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. 生成 Prisma Client

```bash
npx prisma generate
```

### 3. 数据库迁移

```bash
# 创建迁移
npx prisma migrate dev --name init

# 应用迁移
npx prisma migrate deploy
```

### 4. 查询数据

```typescript
// 查找所有用户
const users = await prisma.user.findMany();

// 查找单个用户
const user = await prisma.user.findUnique({
  where: { id: '1' },
});

// 创建用户
const newUser = await prisma.user.create({
  data: {
    email: 'user@example.com',
    username: 'user',
  },
});

// 更新用户
const updatedUser = await prisma.user.update({
  where: { id: '1' },
  data: { username: 'newusername' },
});

// 删除用户
await prisma.user.delete({
  where: { id: '1' },
});
```

### 5. 关系查询

```typescript
// 包含关联数据
const user = await prisma.user.findUnique({
  where: { id: '1' },
  include: {
    profile: true,
  },
});
```

## 最佳实践

1. **使用事务**：确保数据一致性
2. **使用索引**：优化查询性能
3. **类型安全**：充分利用 TypeScript 类型
4. **迁移管理**：使用版本控制管理迁移

## 参考资料

- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

**最后更新时间**：2026-01-01 14:46:07

