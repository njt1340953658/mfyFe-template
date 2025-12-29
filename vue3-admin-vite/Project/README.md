# Vue3 Admin Vite - 项目源代码

这是 Vue3 Admin Vite 的项目源代码目录。

## 📁 目录结构

```
Project/
├── public/                  # 静态资源
├── src/                     # 源代码
│   ├── api/                # API 接口定义
│   ├── assets/             # 资源文件（图片、样式等）
│   ├── components/         # 全局组件
│   ├── config/             # 配置文件
│   ├── directives/         # 自定义指令
│   ├── router/             # 路由配置
│   ├── store/              # 状态管理 (Pinia)
│   ├── styles/             # 全局样式
│   ├── utils/              # 工具函数
│   ├── views/              # 页面组件
│   ├── App.vue             # 根组件
│   └── main.ts             # 应用入口
├── types/                   # TypeScript 类型定义
├── package.json            # 项目依赖
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
└── README.md               # 本文件
```

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 启动开发服务器
npm run dev

# 或指定端口
npm run dev -- --port 3000
```

访问 http://localhost:5173

### 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

### 类型检查

```bash
npm run type-check
```

---

## 🛠 技术栈

- **Vue 3.5**: 渐进式 JavaScript 框架
- **TypeScript 5**: JavaScript 超集
- **Vite 6**: 下一代前端构建工具
- **Element Plus 2**: Vue 3 UI 组件库
- **Pinia**: Vue 状态管理库
- **Vue Router 4**: Vue 官方路由
- **Axios**: HTTP 请求库
- **SCSS**: CSS 预处理器

---

## 📖 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/router/` 下添加路由配置
3. 在 Layout 中添加菜单项（如需要）

### 添加 API 接口

1. 在 `src/api/` 下创建或编辑 API 文件
2. 定义接口类型
3. 使用 `request` 工具发送请求

示例：

```typescript
// src/api/user.ts
import request from '@/utils/service';

export interface User {
  id: number;
  name: string;
}

export const getUserList = (params: any) => {
  return request<User[]>({
    url: '/api/users',
    method: 'get',
    params
  });
};
```

### 添加全局组件

1. 在 `src/components/` 下创建组件
2. 在 `src/components/index.ts` 中注册（可选）

### 状态管理

使用 Pinia 进行状态管理：

```typescript
// src/store/modules/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
    }
  }
});
```

---

## ⚙️ 环境变量

创建 `.env.*` 文件配置环境变量：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 📏 代码规范

项目使用 ESLint 和 Prettier 进行代码规范检查：

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix
```

---

## 🔗 相关文档

- [项目 README](../README.md)
- [基础架构](../AI/v1.0.0/infra.md)
- [编码规范](../Config/coding-standards.md)
- [开发流程](../Config/development-workflow.md)
- [技能文档](../comSkills/README.md)

---

## 📮 问题反馈

如有问题，请提交 Issue 或联系开发团队。

