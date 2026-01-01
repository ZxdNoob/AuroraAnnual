# 在线编码 API 文档

## 概述

在线编码模块提供文件管理、代码保存等功能。

**路径前缀**：`/api/code`

**认证**：所有接口都需要 JWT 认证

## 接口列表

### 1. 创建文件或文件夹

**接口**：`POST /api/code`

**描述**：创建文件或文件夹

**请求体**：

```json
{
  "name": "example.ts",
  "type": "FILE",
  "content": "console.log('Hello World');",
  "parentId": null
}
```

### 2. 获取文件树

**接口**：`GET /api/code`

**描述**：获取当前用户的文件树结构

### 3. 获取文件内容

**接口**：`GET /api/code/:fileId`

**描述**：获取指定文件的内容

### 4. 更新文件

**接口**：`PUT /api/code/:fileId`

**描述**：更新文件内容

### 5. 删除文件或文件夹

**接口**：`DELETE /api/code/:fileId`

**描述**：删除文件或文件夹

### 6. 重命名文件或文件夹

**接口**：`PATCH /api/code/:fileId/rename`

**描述**：重命名文件或文件夹

### 7. 移动文件或文件夹

**接口**：`PATCH /api/code/:fileId/move`

**描述**：移动文件或文件夹

---

**最后更新时间**：2026-01-01 14:46:07

