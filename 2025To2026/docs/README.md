# 文档目录索引

## 概述

本文档目录包含了 2025To2026 项目的完整技术文档，涵盖架构设计、API 接口、功能实现、学习笔记、配置解读、问题记录、底层原理和版本更新等各个方面。

**文档目录结构**：

```
docs/
├── README.md                    # 本文档（文档索引）
├── architecture/                # 架构文档
├── api/                         # API 文档
├── features/                    # 功能文档
├── learning-notes/              # 学习笔记
├── configuration/               # 配置解读
├── troubleshooting/             # 踩坑记录
├── deep-dive/                   # 底层原理
└── version-updates/           # 版本更新
```

## 文档分类说明

### 1. 架构文档（`architecture/`）

**目录说明**：包含系统架构设计、技术栈选型、数据库设计等架构相关的文档。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `overview.md` | 系统架构概览，包括整体架构设计、模块划分、数据流等 |
| `technology-stack.md` | 技术栈选型说明，详细说明为什么选择这些技术，技术对比分析 |
| `database-design.md` | 数据库设计文档，包括数据模型、表结构、关系设计等 |

**适用场景**：
- 了解系统整体架构
- 理解技术选型原因
- 查看数据库设计

**快速链接**：
- [系统架构概览](./architecture/overview.md)
- [技术栈选型](./architecture/technology-stack.md)
- [数据库设计](./architecture/database-design.md)

---

### 2. API 文档（`api/`）

**目录说明**：包含所有 API 接口的详细文档，包括请求参数、响应格式、使用示例等。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `api-overview.md` | API 文档概览，包括 API 基础路径、认证方式、响应格式、状态码说明等 |
| `authentication.md` | 认证相关 API，包括用户注册、登录、JWT Token 使用等 |
| `checkin.md` | 打卡相关 API，包括用户打卡、打卡历史记录查询等 |
| `points.md` | 积分相关 API，包括积分排行榜、积分统计、积分历史记录等 |
| `ranks.md` | 段位相关 API，包括段位信息查询、段位排行榜等 |
| `badges.md` | 勋章相关 API，包括勋章列表、用户勋章、勋章统计等 |
| `lottery.md` | 抽奖相关 API，包括抽奖、抽奖历史、抽奖统计等 |
| `code.md` | 在线编码相关 API，包括文件管理、代码保存等 |
| `items.md` | 道具相关 API，包括道具列表、道具使用、道具效果等 |
| `activities.md` | 活动相关 API，包括活动管理、活动参与等 |

**适用场景**：
- 前端开发时查看 API 接口
- 接口联调和测试
- 理解 API 使用方式

**快速链接**：
- [API 概览](./api/api-overview.md)
- [认证 API](./api/authentication.md)
- [打卡 API](./api/checkin.md)
- [积分 API](./api/points.md)
- [段位 API](./api/ranks.md)
- [勋章 API](./api/badges.md)
- [抽奖 API](./api/lottery.md)
- [在线编码 API](./api/code.md)
- [道具 API](./api/items.md)
- [活动 API](./api/activities.md)

---

### 3. 功能文档（`features/`）

**目录说明**：包含功能设计、实现方案、使用示例等功能相关的文档。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `development-progress.md` | 开发进度总结，详细记录所有已完成的核心模块、功能实现、API 接口等 |
| `initialization-summary.md` | 项目初始化完成总结，包括已完成的工作、下一步计划等 |
| `project-initialization-guide.md` | 项目初始化指南，包括安装步骤、环境配置、数据库初始化等 |
| `rank-system.md` | 段位系统详细文档，包括段位等级、晋升规则、赛季机制等 |

**适用场景**：
- 了解项目开发进度
- 查看功能实现细节
- 理解功能设计思路

**快速链接**：
- [开发进度总结](./features/development-progress.md)
- [项目初始化总结](./features/initialization-summary.md)
- [项目初始化指南](./features/project-initialization-guide.md)
- [段位系统文档](./features/rank-system.md)

---

### 4. 学习笔记（`learning-notes/`）

**目录说明**：包含技术学习笔记、实践总结等学习相关的文档。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `nestjs-fundamentals.md` | NestJS 基础学习笔记，包括核心概念、装饰器、守卫、管道、拦截器等 |
| `nextjs-app-router.md` | Next.js App Router 学习笔记，包括文件系统路由、服务端组件、客户端组件等 |
| `prisma-orm.md` | Prisma ORM 学习笔记，包括 Schema 定义、查询、关系等 |
| `jwt-authentication.md` | JWT 认证学习笔记，包括 JWT 结构、工作流程、安全考虑等 |

**适用场景**：
- 学习新技术
- 理解技术原理
- 查找技术最佳实践

**快速链接**：
- [NestJS 基础](./learning-notes/nestjs-fundamentals.md)
- [Next.js App Router](./learning-notes/nextjs-app-router.md)
- [Prisma ORM](./learning-notes/prisma-orm.md)
- [JWT 认证](./learning-notes/jwt-authentication.md)

---

### 5. 配置解读（`configuration/`）

**目录说明**：包含配置文件逐行解读，站在学习者角度解释每一行配置的作用、原因和关联关系。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `css-preprocessor.md` | CSS 预编译语言配置说明，详细介绍 SCSS 配置和使用规范 |

**适用场景**：
- 理解配置文件的作用
- 学习配置的最佳实践
- 解决配置相关问题

**快速链接**：
- [CSS 预编译语言配置](./configuration/css-preprocessor.md)

---

### 6. 踩坑记录（`troubleshooting/`）

**目录说明**：包含开发过程中遇到的问题、分析过程和解决方案。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `common-issues.md` | 常见问题记录，包括 Prisma Client 未生成、数据库连接失败、JWT Token 验证失败等问题和解决方案 |
| `2026-01-01-project-startup-issues.md` | 项目启动问题详细记录，包括 Tailwind CSS 配置错误、前端服务无法访问等问题和解决方案 |
| `2026-01-01-typescript-compilation-errors.md` | TypeScript 编译错误详细记录，包括装饰器使用错误、类型不匹配、缺失导入等问题和解决方案 |

**适用场景**：
- 遇到问题时查找解决方案
- 了解常见问题和解决方法
- 记录新遇到的问题

**快速链接**：
- [常见问题记录](./troubleshooting/common-issues.md)

---

### 7. 底层原理（`deep-dive/`）

**目录说明**：包含技术原理深入分析，包括算法实现、设计思想、性能优化等。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `points-calculation-algorithm.md` | 积分计算算法原理，详细分析积分计算公式、实现代码、设计考虑等 |
| `experience-calculation-algorithm.md` | 经验值计算算法原理，详细分析经验值计算公式、实现代码、设计考虑等 |
| `rank-promotion-algorithm.md` | 段位晋升算法原理，详细分析段位系统、晋升规则、算法实现等 |
| `lottery-algorithm.md` | 抽奖算法原理，详细分析加权随机算法、奖品配置、算法特点等 |

**适用场景**：
- 深入理解核心算法
- 学习算法设计思想
- 优化算法性能

**快速链接**：
- [积分计算算法](./deep-dive/points-calculation-algorithm.md)
- [经验值计算算法](./deep-dive/experience-calculation-algorithm.md)
- [段位晋升算法](./deep-dive/rank-promotion-algorithm.md)
- [抽奖算法](./deep-dive/lottery-algorithm.md)

---

### 8. 版本更新（`version-updates/`）

**目录说明**：包含版本更新和依赖变更文档，详细记录每次版本更新的内容、原因和影响。

**文档列表**：

| 文件名 | 内容说明 |
|--------|---------|
| `v0.2.1-ui-redesign.md` | 版本 0.2.1 UI 重新设计文档，包括配色系统优化、布局修复、响应式改进等 |
| `v0.2.0-logo-and-ui-optimization.md` | 版本 0.2.0 Logo 和 UI 优化文档，包括 Logo 设计、favicon 创建、Hydration 错误修复、UI 样式优化等 |
| `v0.1.0-initialization.md` | 版本 0.1.0 初始化文档，包括更新内容、依赖变更、升级指南等 |

**适用场景**：
- 了解版本更新内容
- 查看依赖变更情况
- 升级项目版本

**快速链接**：
- [版本 0.2.1 UI 重新设计](./version-updates/v0.2.1-ui-redesign.md)
- [版本 0.2.0 Logo 和 UI 优化](./version-updates/v0.2.0-logo-and-ui-optimization.md)
- [版本 0.1.0 初始化](./version-updates/v0.1.0-initialization.md)

---

## 文档使用指南

### 按需求查找文档

#### 1. 想要了解系统架构
- 查看 [架构文档](./architecture/)
- 重点阅读：[系统架构概览](./architecture/overview.md)、[技术栈选型](./architecture/technology-stack.md)

#### 2. 想要开发前端功能
- 查看 [API 文档](./api/)
- 重点阅读：[API 概览](./api/api-overview.md)、相关功能模块的 API 文档

#### 3. 想要学习技术栈
- 查看 [学习笔记](./learning-notes/)
- 重点阅读：相关技术的学习笔记

#### 4. 想要理解核心算法
- 查看 [底层原理](./deep-dive/)
- 重点阅读：相关算法的原理文档

#### 5. 遇到问题需要解决
- 查看 [踩坑记录](./troubleshooting/)
- 重点阅读：[常见问题记录](./troubleshooting/common-issues.md)

#### 6. 想要了解项目进度
- 查看 [功能文档](./features/)
- 重点阅读：[开发进度总结](./features/development-progress.md)

#### 7. 想要配置项目
- 查看 [配置解读](./configuration/)
- 重点阅读：相关配置文件的解读文档

#### 8. 想要升级项目版本
- 查看 [版本更新](./version-updates/)
- 重点阅读：相关版本的更新文档

---

## 文档维护规范

### 文档更新时机

1. **代码变更时**：代码变更后及时更新相关文档
2. **问题解决后**：解决问题后立即记录踩坑文档
3. **学习完成后**：学习新技术后及时整理学习笔记
4. **版本更新时**：版本号更新时必须创建版本更新文档
5. **依赖变更时**：依赖项变化时必须创建依赖变更文档

### 文档质量要求

1. **准确性**：文档内容必须准确，与实际代码一致
2. **完整性**：文档内容必须完整，不遗漏重要信息
3. **可读性**：文档必须易于理解，使用清晰的表达
4. **时效性**：文档必须及时更新，保持最新状态

---

## 文档统计

### 文档数量统计

- **架构文档**：3 个
- **API 文档**：10 个
- **功能文档**：4 个
- **学习笔记**：4 个
- **配置解读**：1 个
- **踩坑记录**：3 个
- **底层原理**：4 个
- **版本更新**：3 个

**总计**：32 个文档文件

### 文档覆盖范围

- ✅ 系统架构设计
- ✅ API 接口文档
- ✅ 功能实现说明
- ✅ 技术学习笔记
- ✅ 配置解读说明
- ✅ 问题解决方案
- ✅ 算法原理分析
- ✅ 版本更新记录

---

## 快速导航

### 新手入门

1. [项目初始化指南](./features/project-initialization-guide.md) - 了解如何开始项目
2. [系统架构概览](./architecture/overview.md) - 了解系统整体架构
3. [API 概览](./api/api-overview.md) - 了解 API 接口

### 开发参考

1. [开发进度总结](./features/development-progress.md) - 了解已完成的功能
2. [API 文档](./api/) - 查看所有 API 接口
3. [常见问题记录](./troubleshooting/common-issues.md) - 查找问题解决方案

### 深入学习

1. [学习笔记](./learning-notes/) - 学习技术栈知识
2. [底层原理](./deep-dive/) - 理解核心算法
3. [配置解读](./configuration/) - 理解配置文件

---

## 贡献指南

欢迎贡献文档！在添加或更新文档时，请确保：

1. 文档内容准确、完整
2. 遵循文档格式规范
3. 及时更新文档索引
4. 添加最后更新时间

---

**最后更新时间**：2026-01-01 23:32:16

