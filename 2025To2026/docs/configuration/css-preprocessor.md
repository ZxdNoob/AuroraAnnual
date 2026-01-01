# CSS 预编译语言配置说明

## 项目使用的 CSS 预编译语言

**本项目使用 SCSS (Sass) 作为 CSS 预编译语言**

### 选择原因

1. **语法清晰**：SCSS 完全兼容 CSS 语法，使用 `{}` 和 `;`，学习成本低
2. **功能强大**：支持变量、嵌套、混合（Mixin）、函数等高级特性
3. **生态完善**：与 Tailwind CSS 兼容良好，工具链完善
4. **社区活跃**：使用广泛，文档和资源丰富

## 工具配置

### 安装依赖

```bash
pnpm add -D sass
```

### Next.js 配置

Next.js 14+ 内置支持 SCSS，无需额外配置。只需安装 `sass` 包即可。

### 文件使用

- **全局样式**：`src/app/globals.scss`
- **组件样式**：`src/components/**/*.scss`
- **模块样式**：`src/modules/**/*.module.scss`

## SCSS 使用规范

### 变量定义

```scss
// 颜色变量
$primary-color: #007bff;
$secondary-color: #6c757d;

// 尺寸变量
$container-width: 1200px;
$spacing-unit: 8px;
```

### 嵌套规则

```scss
// 嵌套深度建议不超过 3 层
.container {
  width: $container-width;
  
  .header {
    padding: $spacing-unit * 2;
    
    .title {
      font-size: 24px;
    }
  }
}
```

### 混合（Mixin）

```scss
// 定义混合
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 使用混合
.card {
  @include flex-center;
  padding: 20px;
}
```

### 导入其他 SCSS 文件

```scss
// 导入变量文件
@import './variables';

// 导入混合文件
@import './mixins';

// 导入组件样式
@import './components/button';
```

## 与 Tailwind CSS 的配合

本项目同时使用 Tailwind CSS 和 SCSS：

- **Tailwind CSS**：用于工具类样式（如 `flex`、`p-4` 等）
- **SCSS**：用于自定义样式、变量、混合等

### 在 SCSS 中使用 Tailwind

```scss
// 使用 @apply 指令应用 Tailwind 类
.button {
  @apply px-4 py-2 rounded-lg;
  
  // 可以结合自定义样式
  background-color: $primary-color;
}
```

## 文件组织

```
frontend/src/
├── app/
│   └── globals.scss          # 全局样式
├── styles/
│   ├── variables.scss        # 变量定义
│   ├── mixins.scss           # 混合定义
│   └── components/           # 组件样式
│       ├── button.scss
│       └── card.scss
└── components/
    └── Button/
        ├── Button.tsx
        └── Button.module.scss # 组件模块样式
```

## 格式化工具

### Prettier 配置

Prettier 支持 SCSS 格式化，无需额外配置：

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

### stylelint 配置（可选）

如果需要使用 stylelint 检查 SCSS 代码：

```json
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "indentation": 2,
    "max-nesting-depth": 3
  }
}
```

## 注意事项

1. **统一使用 SCSS**：项目中所有样式文件必须使用 `.scss` 扩展名
2. **不允许使用原生 CSS**：不允许创建 `.css` 文件（第三方库除外）
3. **嵌套深度**：建议嵌套深度不超过 3 层，保持代码可读性
4. **变量命名**：使用有意义的变量名，遵循命名规范

## 参考资源

- [Sass 官方文档](https://sass-lang.com/documentation)
- [Next.js CSS 支持](https://nextjs.org/docs/app/building-your-application/styling)
- [Tailwind CSS 与 SCSS 配合使用](https://tailwindcss.com/docs/using-with-preprocessors)

