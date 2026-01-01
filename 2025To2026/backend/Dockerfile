# 生产环境 Dockerfile
FROM node:20-alpine AS base

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS build

# 复制源代码
COPY . .

# 生成 Prisma Client
RUN pnpm prisma generate

# 构建应用
RUN pnpm run build

# 生产阶段
FROM node:20-alpine AS production

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package.json pnpm-lock.yaml* ./

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 复制 Prisma schema 和生成的 client
COPY prisma ./prisma
RUN pnpm prisma generate

# 从构建阶段复制构建产物
COPY --from=build /app/dist ./dist

# 暴露端口
EXPOSE 4000

# 启动应用
CMD ["node", "dist/main.js"]

