# 🚀 UniApp Vue3 Vite 微信小程序项目模板

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue](https://img.shields.io/badge/Vue-3.4+-brightgreen.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![UniApp](https://img.shields.io/badge/UniApp-3.0+-green.svg)](https://uniapp.dcloud.net.cn/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-purple.svg)](https://vitejs.dev/)

基于 **Vue 3 + TypeScript + Vite + UniApp** 的微信小程序开发模板，提供完整的工程化解决方案和最佳实践。

---

## ✨ 特性

- 🎯 **Vue 3.4+**: 使用最新的 Composition API
- 💪 **TypeScript**: 完整的类型支持
- 🚀 **Vite 5**: 极速的开发体验
- 📱 **UniApp 3.0**: 跨端开发能力
- 🗃️ **Pinia**: 轻量级状态管理
- 📦 **分包加载**: 优化小程序包体积
- 🔧 **完整工具链**: ESLint + Prettier + Git Hooks
- 📖 **详细文档**: AI 需求、技能文档、配置规范

---

## 🛠 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.4+ | 渐进式 JavaScript 框架 |
| TypeScript | 4.9+ | JavaScript 的超集 |
| Vite | 5.4+ | 下一代前端构建工具 |
| UniApp | 3.0+ | 跨端开发框架 |
| Pinia | 2.0+ | Vue 状态管理库 |
| SCSS | - | CSS 预处理器 |

---

## 📁 项目结构

```
weapp-vue3-vite/
├── AI/                          # 需求文档和版本管理
│   ├── 编码规范/                # 旧版编码规范（待迁移）
│   ├── 需求文档/                # 旧版需求文档（待迁移）
│   └── v1.0.0/                  # 版本化文档
│       ├── infra.md            # 基础架构文档
│       ├── spec/               # 需求规格说明
│       │   └── baixs/          # 按模块分类的需求
│       │       └── user_spec.md
│       ├── tech_solution/      # 技术方案
│       │   └── baixs/          # 按模块分类的技术方案
│       │       └── user_solution.md
│       └── tasks/              # 任务拆分
│           └── baixs/          # 按模块分类的任务
│               └── user_task.md
├── comSkills/                   # 技能文档集合
│   ├── README.md               # 技能文档索引
│   ├── vue3-composition-api.md # Vue 3 组合式 API
│   ├── uniapp-guide.md         # UniApp 开发指南
│   └── pinia.md                # Pinia 状态管理
├── Config/                      # 配置和规范文档
│   ├── README.md               # 配置文档索引
│   ├── coding-standards.md     # 编码规范
│   ├── git-commit-guide.md     # Git 提交规范
│   ├── development-workflow.md # 开发流程
│   └── env-config.md           # 环境配置
├── Project/                     # 项目源代码 ⭐
│   ├── conf/                   # 构建配置
│   │   ├── update-version.js  # 版本更新脚本
│   │   └── upload.js          # 上传脚本
│   ├── dist/                   # 构建输出
│   │   └── dev/               # 开发环境输出
│   │       └── mp-weixin/     # 微信小程序
│   ├── src/                    # 源代码
│   │   ├── api/               # API 接口定义
│   │   ├── components/        # 公共组件
│   │   ├── constants/         # 常量定义
│   │   ├── pages/             # 页面文件（主包）
│   │   │   └── index/         # 首页
│   │   │       └── index.vue
│   │   ├── subPages/          # 子页面（分包）
│   │   ├── stores/            # 状态管理 (Pinia)
│   │   │   ├── index.ts       # Pinia 实例
│   │   │   └── caching.ts     # 缓存 Store
│   │   ├── utils/             # 工具函数
│   │   │   ├── request.ts     # HTTP 请求封装
│   │   │   ├── uniRouter.ts   # 路由工具
│   │   │   └── utilsTool.ts   # 通用工具函数
│   │   ├── static/            # 静态资源
│   │   │   └── logo.png
│   │   ├── App.vue            # 应用根组件
│   │   ├── main.ts            # 应用入口
│   │   ├── pages.json         # 页面配置
│   │   ├── manifest.json      # 应用配置
│   │   ├── uni.scss           # 全局样式变量
│   │   ├── env.d.ts           # 环境类型定义
│   │   └── shime-uni.d.ts     # UniApp 类型声明
│   ├── package.json           # 项目依赖
│   ├── vite.config.ts         # Vite 配置
│   ├── tsconfig.json          # TypeScript 配置
│   ├── shims-uni.d.ts         # UniApp 类型声明
│   └── index.html             # HTML 模板
├── .gitignore                   # Git 忽略配置
├── LICENSE                      # 开源协议
└── README.md                    # 项目说明（本文件）
```

---

## 📚 文档说明

### AI 文档（需求管理）
存放项目需求、技术方案、任务拆分等文档，按版本管理。

- **infra.md**: 基础架构设计
- **spec/**: 需求规格说明书
- **tech_solution/**: 技术实现方案
- **tasks/**: 开发任务拆分

### comSkills（技能文档）
前端开发技能文档，包含 Vue 3、UniApp、Pinia 等技术的使用指南。

### Config（配置规范）
项目配置和开发规范文档。

---

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 16.0.0
- **pnpm**: >= 8.0.0
- **微信开发者工具**: 最新稳定版

### 安装依赖

```bash
# 进入项目目录
cd Project

# 安装依赖
pnpm install
```

### 开发

```bash
# 微信小程序开发
npm run dev

# H5 开发
npm run dev:h5
```

然后在微信开发者工具中打开 `Project/dist/dev/mp-weixin` 目录。

### 构建

```bash
# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod
```

### 上传

```bash
# 上传到微信测试环境
npm run upload:test

# 上传到微信生产环境
npm run upload:prod
```

---

## ⚙️ 环境配置

在 `Project` 目录下创建环境变量文件：

```bash
# .env.development（开发环境）
VITE_API_BASE_URL=https://dev-api.example.com

# .env.production（生产环境）
VITE_API_BASE_URL=https://api.example.com
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 💡 开发指南

### 页面配置

在 `Project/src/pages.json` 中配置页面路由：

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ]
}
```

### API 调用

```typescript
// Project/src/api/user.ts
import { request } from '@/utils/request';

export const getUserList = (params: any) => {
  return request({
    url: '/api/users',
    method: 'GET',
    data: params
  });
};
```

### 状态管理

```typescript
// Project/src/stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null
  }),
  actions: {
    setUserInfo(info: any) {
      this.userInfo = info;
    }
  }
});
```

### 页面开发

```vue
<template>
  <view class="container">
    <text>{{ message }}</text>
    <button @click="handleClick">点击</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const message = ref('Hello UniApp');

const handleClick = () => {
  uni.showToast({ title: '点击了', icon: 'success' });
};

onLoad((options) => {
  console.log('页面加载', options);
});
</script>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
}
</style>
```

---

## 🎨 核心功能

### 1. 路由跳转

```typescript
// 使用封装的路由工具
import { navigateTo } from '@/utils/uniRouter';

navigateTo({
  url: '/pages/detail/index',
  params: { id: 1 }
});
```

### 2. 请求封装

```typescript
// 自动添加 Token，统一错误处理
import { request } from '@/utils/request';

const res = await request({
  url: '/api/users',
  method: 'GET'
});
```

### 3. 数据缓存

```typescript
// 使用 Pinia 进行状态管理和持久化
import { useCachingStore } from '@/stores/caching';

const cachingStore = useCachingStore();
cachingStore.setToken('abc123');
```

---

## 📋 开发规范

### 代码风格

- 使用 **ESLint** 进行代码检查
- 使用 **Prettier** 进行代码格式化
- 使用 **Git Hooks** 自动检查提交代码

### 命名规范

- **页面文件**: 小写，如 `pages/index/index.vue`
- **组件文件**: PascalCase，如 `UserCard.vue`
- **工具函数**: camelCase，如 `utilsTool.ts`
- **常量**: UPPER_CASE，如 `API_BASE_URL`

### Git 提交规范

```bash
feat: 新增功能
fix: 修复 Bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具链相关
```

详见 [Git 提交规范](./Config/git-commit-guide.md)

---

## 🔧 常见问题

### 1. 微信开发者工具无法预览？

- 检查 `Project/src/manifest.json` 中的 `appid` 是否正确
- 确保已在微信公众平台配置开发者权限

### 2. 请求失败？

- 检查微信小程序后台是否配置了合法域名
- 开发时可在微信开发者工具中关闭域名校验

### 3. 样式不生效？

- 检查是否使用了 `rpx` 单位（推荐）
- 确保 `<style>` 标签有 `scoped` 属性

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Email**: your-email@example.com

---

## 🙏 鸣谢

感谢以下开源项目：

- [Vue.js](https://vuejs.org/)
- [UniApp](https://uniapp.dcloud.net.cn/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

**快速链接**:
- [需求文档](./AI/v1.0.0/infra.md)
- [技能文档](./comSkills/README.md)
- [配置规范](./Config/README.md)
- [开发指南](./Config/development-workflow.md)
