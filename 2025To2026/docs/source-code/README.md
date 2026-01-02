# 源码解读文档索引

## 概述

本文档目录包含项目核心代码的逐行解读，帮助深入理解代码实现原理、设计思想和最佳实践。

## 文档分类

### 前端源码解读

- [认证上下文（AuthContext）](./frontend/auth-context.md) - 前端认证状态管理实现，详细解读 AuthProvider 和 useAuth Hook
- [路由保护组件（RequireAuth）](./frontend/require-auth.md) - 路由保护组件实现，详细解读认证检查和重定向逻辑
- [Header 组件](./frontend/header-component.md) - Header 组件实现，详细解读导航菜单、用户操作、移动端菜单等
- [API 工具函数](./frontend/api-utils.md) - API 请求工具函数，详细解读 GET、POST、PUT、DELETE 等 HTTP 方法
- [用户资料 Hook（useUserProfile）](./frontend/use-user-profile.md) - 用户资料获取 Hook，详细解读 React Query 数据获取和缓存
- [登录页面](./frontend/login-page.md) - 登录页面实现，详细解读表单验证、提交处理、重定向逻辑
- [注册页面](./frontend/register-page.md) - 注册页面实现，详细解读表单验证、密码确认、提交处理
- [汉堡菜单图标（HamburgerIcon）](./frontend/hamburger-icon.md) - 汉堡菜单图标组件，详细解读动画实现和性能优化

### 后端源码解读

- [认证服务（AuthService）](./backend/auth-service.md) - 后端认证服务实现，详细解读用户注册、登录、JWT Token 生成
- [认证控制器（AuthController）](./backend/auth-controller.md) - 认证 API 控制器实现，详细解读路由定义和 Swagger 文档生成
- [用户服务（UsersService）](./backend/users-service.md) - 用户管理服务实现，详细解读用户信息和用户资料获取
- [用户控制器（UsersController）](./backend/users-controller.md) - 用户 API 控制器实现，详细解读路由保护和用户信息获取
- [Prisma 服务（PrismaService）](./backend/prisma-service.md) - Prisma 数据库服务实现，详细解读数据库连接生命周期管理
- [JWT 策略（JwtStrategy）](./backend/jwt-strategy.md) - JWT 认证策略实现，详细解读 Token 验证和用户信息提取
- [JWT 认证守卫（JwtAuthGuard）](./backend/jwt-auth-guard.md) - JWT 认证守卫实现，详细解读路由保护机制
- [当前用户装饰器（CurrentUser）](./backend/current-user-decorator.md) - 当前用户装饰器实现，详细解读参数提取机制
- [DTO 验证（RegisterDto 和 LoginDto）](./backend/dto-validation.md) - DTO 数据验证实现，详细解读数据验证和 Swagger 文档生成

## 文档格式说明

每个源码解读文档包含：

1. **文件概述**：文件的作用和重要性
2. **导入语句解读**：每个导入的作用和原因
3. **类型定义解读**：接口和类型的详细说明
4. **函数/方法逐行解读**：每个函数/方法的详细实现说明
5. **设计模式分析**：使用的设计模式及其应用场景
6. **性能优化点**：性能优化的具体实现
7. **最佳实践**：代码中的最佳实践和注意事项

## 覆盖情况

当前文档覆盖情况请查看：[覆盖情况报告](./coverage-report.md)

**已创建文档**：21 个
- 前端源码解读：8 个
- 后端源码解读：9 个
- 配置解读：4 个

**遗漏的重要文件**：9 个
- 前端核心文件：4 个（高优先级）
- 后端核心文件：2 个（高优先级）

## 阅读建议

1. **按模块阅读**：先阅读架构文档，了解整体设计
2. **结合代码阅读**：边看文档边看代码，加深理解
3. **实践验证**：修改代码验证理解是否正确
4. **深入思考**：思考为什么这样设计，有什么优缺点

