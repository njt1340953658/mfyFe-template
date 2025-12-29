# UniApp Vue3 Vite 微信小程序 - 项目源代码

这是 UniApp Vue3 Vite 微信小程序的项目源代码目录。

## 📁 目录结构

```
Project/
├── conf/                    # 构建配置
│   ├── update-version.js   # 版本更新脚本
│   └── upload.js           # 上传脚本
├── dist/                    # 构建输出
│   └── dev/
│       └── mp-weixin/      # 微信小程序输出
├── src/                     # 源代码
│   ├── api/                # API 接口定义
│   ├── components/         # 公共组件
│   ├── constants/          # 常量定义
│   ├── pages/              # 页面（主包）
│   ├── subPages/           # 子页面（分包）
│   ├── stores/             # 状态管理 (Pinia)
│   ├── utils/              # 工具函数
│   ├── static/             # 静态资源
│   ├── App.vue             # 应用根组件
│   ├── main.ts             # 应用入口
│   ├── pages.json          # 页面配置
│   ├── manifest.json       # 应用配置
│   └── uni.scss            # 全局样式变量
├── package.json            # 项目依赖
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── README.md               # 本文件
```

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- pnpm >= 8.0.0
- 微信开发者工具（最新稳定版）

### 安装依赖

```bash
pnpm install
```

### 开发

```bash
# 微信小程序开发
npm run dev

# H5 开发
npm run dev:h5
```

### 在微信开发者工具中预览

1. 打开微信开发者工具
2. 导入项目，选择 `dist/dev/mp-weixin` 目录
3. 开始开发

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

## 🛠 技术栈

- **Vue 3.4+**: 渐进式 JavaScript 框架
- **TypeScript 4.9+**: JavaScript 超集
- **Vite 5.4+**: 下一代前端构建工具
- **UniApp 3.0+**: 跨端开发框架
- **Pinia 2.0+**: Vue 状态管理库
- **SCSS**: CSS 预处理器

---

## 📖 开发指南

### 添加新页面

#### 主包页面

1. 在 `src/pages/` 下创建页面文件夹
2. 在 `src/pages.json` 中配置页面路由

```json
{
  "pages": [
    {
      "path": "pages/user/index",
      "style": {
        "navigationBarTitleText": "用户中心"
      }
    }
  ]
}
```

#### 分包页面

1. 在 `src/subPages/` 下创建页面
2. 在 `src/pages.json` 的 `subPackages` 中配置

```json
{
  "subPackages": [
    {
      "root": "subPages",
      "pages": [
        {
          "path": "user/list",
          "style": {
            "navigationBarTitleText": "用户列表"
          }
        }
      ]
    }
  ]
}
```

### 添加 API 接口

在 `src/api/` 下创建 API 文件：

```typescript
// src/api/user.ts
import { request } from '@/utils/request';

export interface User {
  id: number;
  name: string;
}

export const getUserList = (params: any) => {
  return request<User[]>({
    url: '/api/users',
    method: 'GET',
    data: params
  });
};
```

### 路由跳转

使用封装的路由工具：

```typescript
import { navigateTo, redirectTo, switchTab } from '@/utils/uniRouter';

// 普通跳转
navigateTo({
  url: '/pages/detail/index',
  params: { id: 1 }
});

// 重定向
redirectTo({
  url: '/pages/login/index'
});

// Tab 切换
switchTab({
  url: '/pages/index/index'
});
```

### 状态管理

使用 Pinia 进行状态管理：

```typescript
// src/stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: null
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      uni.setStorageSync('token', token);
    }
  }
});
```

### 数据存储

```typescript
// 存储数据
uni.setStorageSync('key', 'value');

// 读取数据
const value = uni.getStorageSync('key');

// 删除数据
uni.removeStorageSync('key');

// 清空所有数据
uni.clearStorageSync();
```

---

## ⚙️ 环境配置

创建环境变量文件（已移动到 Project 目录外）：

```bash
# ../.env.development
VITE_API_BASE_URL=https://dev-api.example.com

# ../.env.production
VITE_API_BASE_URL=https://api.example.com
```

在代码中使用：

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## 📱 配置说明

### manifest.json（应用配置）

配置小程序的基本信息：

```json
{
  "name": "小程序名称",
  "appid": "微信小程序 AppID",
  "mp-weixin": {
    "appid": "wxxxxxxxxxxx",
    "setting": {
      "urlCheck": false
    }
  }
}
```

### pages.json（页面配置）

配置页面路由和全局样式：

```json
{
  "pages": [...],
  "globalStyle": {
    "navigationBarBackgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "list": [...]
  }
}
```

---

## 🎨 样式开发

### 使用 rpx 单位

```vue
<style lang="scss" scoped>
.container {
  padding: 30rpx;  /* 相对单位，自动适配不同屏幕 */
  font-size: 28rpx;
}
</style>
```

### 全局样式变量

在 `src/uni.scss` 中定义全局样式变量：

```scss
$primary-color: #07C160;
$text-color: #333;
```

---

## 🔧 条件编译

针对不同平台编写特定代码：

```vue
<template>
  <!-- #ifdef MP-WEIXIN -->
  <view>仅在微信小程序显示</view>
  <!-- #endif -->
  
  <!-- #ifdef H5 -->
  <view>仅在 H5 显示</view>
  <!-- #endif -->
</template>

<script>
// #ifdef MP-WEIXIN
console.log('微信小程序');
// #endif
</script>
```

---

## 📏 代码规范

项目使用 Git Hooks 进行代码规范检查：

- 提交前自动检查代码格式
- 遵循统一的编码规范
- 详见 [编码规范](../Config/coding-standards.md)

---

## 🔗 相关文档

- [项目 README](../README.md)
- [基础架构](../AI/v1.0.0/infra.md)
- [UniApp 开发指南](../comSkills/uniapp-guide.md)
- [Vue3 Composition API](../comSkills/vue3-composition-api.md)
- [Pinia 状态管理](../comSkills/pinia.md)
- [编码规范](../Config/coding-standards.md)

---

## 📮 问题反馈

如有问题，请提交 Issue 或联系开发团队。

