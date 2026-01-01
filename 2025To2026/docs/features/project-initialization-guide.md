# 项目初始化指南

## 项目概述

本项目是一个全栈学习激励平台，采用 Next.js 14 + React 19.2 + NestJS + TypeScript 技术栈。

## 已完成的工作

### 1. 项目结构 ✅

- 创建了完整的项目目录结构
- 前端目录：`frontend/`
- 后端目录：`backend/`
- 文档目录：`docs/`

### 2. 数据库设计 ✅

- 完成了 Prisma Schema 设计
- 包含所有核心数据模型：
  - 用户系统（User、UserProfile）
  - 打卡系统（CheckIn）
  - 积分系统（Point）
  - 段位系统（Rank、UserRank）
  - 经验系统（Experience）
  - 勋章系统（Badge、UserBadge）
  - 抽奖系统（Lottery）
  - 道具系统（Item、UserItem）
  - 活动系统（Activity、ActivityParticipant）
  - 代码文件系统（CodeFile）

### 3. 架构文档 ✅

- 系统架构概览
- 技术栈选型说明
- 数据库设计文档

### 4. Docker 配置 ✅

- Docker Compose 配置文件
- 包含 PostgreSQL、Redis、后端服务

## 待完成的工作

### 1. 前端项目初始化

需要执行以下步骤：

```bash
cd frontend

# 使用 Next.js 创建项目
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# 安装依赖
pnpm add react@19.2 react-dom@19.2
pnpm add zustand @tanstack/react-query
pnpm add react-hook-form @hookform/resolvers zod
pnpm add monaco-editor
pnpm add @radix-ui/react-* # shadcn/ui 组件
pnpm add lucide-react # 图标库

# 安装开发依赖
pnpm add -D @types/node @types/react @types/react-dom
pnpm add -D eslint eslint-config-next
pnpm add -D prettier prettier-plugin-tailwindcss
pnpm add -D typescript
```

### 2. 后端项目初始化

需要执行以下步骤：

```bash
cd backend

# 使用 NestJS CLI 创建项目
npm i -g @nestjs/cli
nest new . --package-manager pnpm

# 安装依赖
pnpm add @prisma/client
pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add bcrypt
pnpm add @nestjs/swagger swagger-ui-express
pnpm add class-validator class-transformer
pnpm add @nestjs/config

# 安装开发依赖
pnpm add -D prisma
pnpm add -D @types/bcrypt
pnpm add -D @types/passport-jwt
```

### 3. 数据库初始化

```bash
cd backend

# 初始化 Prisma
npx prisma init

# 生成 Prisma Client
npx prisma generate

# 创建数据库迁移
npx prisma migrate dev --name init

# 查看数据库（可选）
npx prisma studio
```

### 4. 环境变量配置

#### 前端环境变量（`frontend/.env.local`）

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_NAME=全栈学习激励平台
```

#### 后端环境变量（`backend/.env`）

```env
# 数据库
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/learning_platform?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# 应用
PORT=4000
NODE_ENV=development
```

### 5. 核心模块实现

#### 5.1 用户认证模块

- [ ] 用户注册
- [ ] 用户登录（JWT）
- [ ] 用户信息获取
- [ ] 超级管理员权限控制

#### 5.2 打卡模块

- [ ] 打卡接口
- [ ] 连续打卡天数计算
- [ ] 积分计算算法（连续打卡加成，最多 10 分）
- [ ] 经验值计算算法

#### 5.3 段位模块

- [ ] 段位数据初始化（13 个段位）
- [ ] 段位晋升算法
- [ ] 段位降级算法
- [ ] 赛季管理（赛季累加：第一赛季 2026.1-6，第二赛季 2026.7-12，第三赛季 2027.1-6，依此类推）
- [ ] 段位继承机制（赛季结束后的降段）

#### 5.4 经验等级模块

- [ ] 经验值计算（登录、打卡、连续加成）
- [ ] 等级计算算法
- [ ] 下一级经验值计算
- [ ] 等级权益管理

#### 5.5 积分模块

- [ ] 积分获取记录
- [ ] 积分消费记录
- [ ] 积分排行榜

#### 5.6 勋章模块

- [ ] 勋章数据初始化
- [ ] 勋章获取条件检查
- [ ] 勋章 SVG 图标生成
- [ ] 用户勋章展示

#### 5.7 抽奖模块

- [ ] 抽奖算法实现
- [ ] 奖品配置管理
- [ ] 抽奖记录
- [ ] 抽奖 UI（业界顶级设计）

#### 5.8 在线编码模块

- [ ] Monaco Editor 集成
- [ ] 文件管理（创建、删除、重命名、移动）
- [ ] 代码保存
- [ ] 多语言支持

#### 5.9 活动模块

- [ ] 活动创建和管理
- [ ] 活动时间范围管理
- [ ] 活动奖励配置
- [ ] 活动参与记录

### 6. 前端页面实现

#### 6.1 认证页面

- [ ] 登录页面
- [ ] 注册页面
- [ ] 忘记密码页面

#### 6.2 主页面

- [ ] 首页（打卡、积分、段位、经验展示）
- [ ] 个人中心
- [ ] 排行榜页面

#### 6.3 功能页面

- [ ] 在线编码页面
- [ ] 抽奖页面
- [ ] 勋章展示页面
- [ ] 活动页面

### 7. UI 组件实现

- [ ] 使用 shadcn/ui 组件库
- [ ] 自定义组件（段位展示、经验条、积分卡片等）
- [ ] 响应式设计（PC 端和移动端）

### 8. 算法实现

#### 8.1 积分算法

```typescript
/**
 * 计算打卡积分
 * @param consecutiveDays 连续打卡天数
 * @returns 积分数量
 */
function calculateCheckInPoints(consecutiveDays: number): number {
  // 基础积分
  const basePoints = 5;
  
  // 连续打卡加成（最多 10 分）
  const bonusPoints = Math.min(consecutiveDays, 10);
  
  return basePoints + bonusPoints;
}
```

#### 8.2 经验算法

```typescript
/**
 * 计算经验值
 * @param baseExp 基础经验值
 * @param consecutiveLoginDays 连续登录天数
 * @param consecutiveCheckInDays 连续打卡天数
 * @returns 经验值数量
 */
function calculateExperience(
  baseExp: number,
  consecutiveLoginDays: number,
  consecutiveCheckInDays: number
): number {
  let experience = baseExp;
  
  // 连续登录加成（每天 +1）
  experience += consecutiveLoginDays;
  
  // 连续打卡加成（每天 +2）
  experience += consecutiveCheckInDays * 2;
  
  return experience;
}
```

#### 8.3 等级算法

```typescript
/**
 * 计算下一级所需经验值
 * @param currentLevel 当前等级
 * @returns 下一级所需经验值
 */
function calculateNextLevelExp(currentLevel: number): number {
  // 等级越高，所需经验值越多
  // 公式：100 * (level ^ 1.5)
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
}
```

#### 8.4 段位晋升算法

```typescript
/**
 * 检查段位晋升条件
 * @param currentRank 当前段位
 * @param currentStars 当前星级
 * @param checkInCount 当前段位打卡次数
 * @returns 是否满足晋升条件
 */
function checkRankUp(
  currentRank: Rank,
  currentStars: number,
  checkInCount: number
): boolean {
  // 如果达到最大星级
  if (currentStars >= currentRank.maxStars) {
    // 检查是否达到晋升所需打卡次数
    return checkInCount >= currentRank.requiredCheckIns;
  }
  
  // 如果未达到最大星级，检查是否达到升星条件
  return checkInCount >= (currentStars * 10); // 每星需要 10 次打卡
}
```

#### 8.5 段位继承算法

```typescript
/**
 * 计算新赛季段位继承
 * @param lastSeasonRank 上赛季段位
 * @returns 新赛季起始段位
 */
function calculateSeasonInheritance(lastSeasonRank: Rank): Rank {
  // 降段规则：降一个段位等级
  const newLevel = Math.max(1, lastSeasonRank.level - 1);
  
  // 查找新段位
  return ranks.find(rank => rank.level === newLevel);
}
```

### 9. 测试

- [ ] 单元测试
- [ ] 集成测试
- [ ] E2E 测试

### 10. 部署配置

- [ ] GitHub Actions CI/CD 配置
- [ ] Vercel 前端部署配置
- [ ] Railway/Fly.io 后端部署配置
- [ ] 生产环境变量配置

## 开发顺序建议

1. **第一阶段：基础架构**
   - 初始化前端和后端项目
   - 配置数据库和 Prisma
   - 实现用户认证模块

2. **第二阶段：核心功能**
   - 实现打卡模块
   - 实现积分和经验系统
   - 实现段位系统

3. **第三阶段：激励系统**
   - 实现勋章系统
   - 实现抽奖系统
   - 实现活动系统

4. **第四阶段：在线编码**
   - 集成 Monaco Editor
   - 实现文件管理
   - 实现代码保存

5. **第五阶段：UI 优化**
   - 完善前端页面
   - 响应式设计
   - 性能优化

6. **第六阶段：测试和部署**
   - 编写测试
   - 配置 CI/CD
   - 部署到生产环境

## 注意事项

1. **代码规范**：遵循项目规则文件中的代码规范
2. **文档更新**：及时更新相关文档
3. **版本管理**：遵循语义化版本规范
4. **Git 提交**：遵循 Git 提交规范
5. **时间更新**：更新时间时严格按照时间更新规范执行

## 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [React 19 文档](https://react.dev)
- [NestJS 文档](https://docs.nestjs.com)
- [Prisma 文档](https://www.prisma.io/docs)
- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [shadcn/ui 文档](https://ui.shadcn.com)

---

**祝开发顺利！** 🚀

