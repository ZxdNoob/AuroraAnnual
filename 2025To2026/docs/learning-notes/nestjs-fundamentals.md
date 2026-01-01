# NestJS 基础学习笔记

## 概述

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。它使用 TypeScript 构建，并完全支持 TypeScript。

## 核心概念

### 1. 模块（Modules）

模块是 NestJS 应用的基本构建块。每个应用至少有一个根模块（AppModule）。

```typescript
@Module({
  imports: [OtherModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
```

**关键点**：
- `imports`：导入其他模块
- `controllers`：注册控制器
- `providers`：注册服务提供者
- `exports`：导出服务供其他模块使用

### 2. 控制器（Controllers）

控制器负责处理传入的请求并返回响应。

```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return 'This action returns all users';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} user`;
  }
}
```

### 3. 服务（Services）

服务包含业务逻辑，可以被控制器或其他服务注入使用。

```typescript
@Injectable()
export class UsersService {
  private users = [];

  findAll() {
    return this.users;
  }

  create(user: CreateUserDto) {
    this.users.push(user);
    return user;
  }
}
```

### 4. 依赖注入（Dependency Injection）

NestJS 使用依赖注入来管理依赖关系。

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // NestJS 会自动注入 UsersService
}
```

## 装饰器

### 请求装饰器

- `@Body()`：获取请求体
- `@Param()`：获取路由参数
- `@Query()`：获取查询参数
- `@Headers()`：获取请求头

### HTTP 方法装饰器

- `@Get()`：GET 请求
- `@Post()`：POST 请求
- `@Put()`：PUT 请求
- `@Delete()`：DELETE 请求
- `@Patch()`：PATCH 请求

## 守卫（Guards）

守卫用于在路由处理程序执行前进行权限检查。

```typescript
@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // 检查 JWT Token
    return true;
  }
}
```

## 管道（Pipes）

管道用于数据转换和验证。

```typescript
@Post()
create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

## 拦截器（Interceptors）

拦截器可以在方法执行前后添加额外逻辑。

```typescript
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    return next.handle().pipe(
      tap(() => console.log('After...'))
    );
  }
}
```

## 最佳实践

1. **模块化设计**：将功能拆分为独立的模块
2. **服务层分离**：业务逻辑放在服务中，控制器只负责处理请求
3. **DTO 验证**：使用 class-validator 进行数据验证
4. **异常处理**：使用异常过滤器统一处理异常
5. **环境配置**：使用 ConfigModule 管理环境变量

## 参考资料

- [NestJS 官方文档](https://docs.nestjs.com)
- [NestJS GitHub](https://github.com/nestjs/nest)

---

**最后更新时间**：2026-01-01 14:46:07

