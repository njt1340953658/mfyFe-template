# Vue3 Admin Vite 🚀

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5.x-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646cff?logo=vite)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.x-409EFF?logo=element)

一个基于 Vue3 + TypeScript + Vite + Element Plus 的现代化后台管理系统模板

</div>

## ✨ 特性

- 🚀 **最新技术栈**: 使用 Vue 3、TypeScript、Vite 6 等前端前沿技术
- 🎨 **UI 组件**: 基于 Element Plus 2.x 组件库
- 🌈 **主题切换**: 支持亮色/暗色主题一键切换
- 🔐 **权限管理**: 完善的动态路由和按钮级权限控制
- 📦 **状态管理**: 使用 Pinia 管理应用状态
- 🛣️ **路由系统**: 基于 Vue Router 4，支持动态路由和懒加载
- 📱 **响应式布局**: 支持桌面端和移动端自适应
- 🎯 **TypeScript**: 完整的类型定义，提供更好的开发体验
- 🔧 **代码规范**: 集成 ESLint + Prettier + Husky，保证代码质量
- 📚 **完善文档**: 提供详细的开发文档和技能文档
- 🔄 **自动更新**: 内置版本检测和自动刷新功能

## 📦 技术栈

- **框架**: Vue 3.5.x
- **语言**: TypeScript 5.x
- **构建工具**: Vite 6.x
- **路由**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **UI 框架**: Element Plus 2.x
- **HTTP 请求**: Axios
- **CSS 预处理**: Sass
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky + Lint-staged

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- pnpm >= 8.x (推荐) 或 npm >= 7.x

### 安装依赖

```bash
# 进入项目目录
cd vue3-admin-vite/Project

# 安装依赖（推荐使用 pnpm）
pnpm install

# 或使用 npm
npm install
```

### 开发运行

```bash
# 启动开发服务器
npm run dev
```

浏览器自动打开 http://localhost:3001

### 生产构建

```bash
# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod
```

### 代码检查

```bash
# ESLint 检查和自动修复
npm run lint

# Prettier 格式化
npm run lint:prettier
```

## 📁 项目结构

```text
vue3-admin-vite/
├── AI/                          # 需求文档和版本管理
│   └── v1.0.0/
│       ├── infra.md            # 基础架构说明
│       ├── spec/               # 需求规格文档
│       ├── tech_solution/      # 技术方案文档
│       └── tasks/              # 任务拆解文档
├── comSkills/                   # 技能文档集合
│   ├── README.md
│   ├── vue3-composition-api.md # Vue 3 Composition API
│   ├── vue-router.md           # Vue Router 配置
│   ├── pinia.md                # Pinia 状态管理
│   ├── element-plus.md         # Element Plus 使用规范
│   └── ...
├── Config/                      # 配置和规范文档
│   ├── README.md
│   ├── coding-standards.md     # 编码规范
│   ├── git-commit-guide.md     # Git 提交规范
│   ├── development-workflow.md # 开发流程
│   └── env-config.md           # 环境变量配置
├── Project/                     # 项目源代码
│   ├── public/                 # 静态资源（不经过构建）
│   │   ├── app-loading.css
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/                # API 接口定义
│   │   ├── assets/             # 静态资源（经过构建）
│   │   ├── components/         # 全局组件
│   │   │   ├── icons/         # 图标组件
│   │   │   ├── layout/        # 布局组件
│   │   │   ├── Screenfull/    # 全屏组件
│   │   │   ├── SvgIcon/       # SVG 图标
│   │   │   └── ThemeSwitch/   # 主题切换
│   │   ├── config/             # 配置文件
│   │   │   ├── async-route.ts # 异步路由配置
│   │   │   ├── layout.ts      # 布局配置
│   │   │   ├── theme.ts       # 主题配置
│   │   │   └── white-list.ts  # 路由白名单
│   │   ├── directives/         # 自定义指令
│   │   │   └── permission/    # 权限指令
│   │   ├── router/             # 路由配置
│   │   │   ├── index.ts       # 路由主入口
│   │   │   ├── interface/     # 路由类型定义
│   │   │   └── router/        # 路由模块
│   │   ├── store/              # Pinia 状态管理
│   │   │   ├── index.ts       # Store 主入口
│   │   │   └── modules/       # 状态模块
│   │   │       ├── app.ts
│   │   │       ├── permission.ts
│   │   │       ├── settings.ts
│   │   │       ├── tags-view.ts
│   │   │       └── user.ts
│   │   ├── styles/             # 全局样式
│   │   │   ├── index.scss     # 样式入口
│   │   │   ├── theme/         # 主题样式
│   │   │   └── transition.scss # 过渡动画
│   │   ├── utils/              # 工具函数
│   │   │   ├── service.ts     # Axios 封装
│   │   │   ├── cookies.ts     # Cookie 操作
│   │   │   ├── permission.ts  # 权限判断
│   │   │   └── autoUpdate.ts  # 自动更新
│   │   ├── views/              # 页面组件
│   │   │   ├── dashboard/     # 仪表盘
│   │   │   ├── login/         # 登录页
│   │   │   ├── permission/    # 权限测试
│   │   │   └── error-page/    # 错误页面
│   │   ├── App.vue             # 根组件
│   │   └── main.ts             # 应用入口
│   ├── types/                  # 全局类型声明
│   ├── .eslintrc.js            # ESLint 配置
│   ├── prettier.config.js      # Prettier 配置
│   ├── index.html              # HTML 模板
│   ├── package.json            # 项目依赖
│   ├── tsconfig.json           # TypeScript 配置
│   └── vite.config.ts          # Vite 配置
├── .gitignore                  # Git 忽略文件
├── LICENSE                     # MIT 许可证
└── README.md                   # 项目说明文档
```

## 📖 文档说明

### AI 文档（需求版本管理）
位于 `AI/` 目录，用于管理需求文档和版本：
- **infra.md**: 项目基础架构说明
- **spec/**: 需求规格文档
- **tech_solution/**: 技术方案文档
- **tasks/**: 任务拆解文档

每个版本建立独立文件夹（如 v1.0.0、v1.0.1），便于追溯和管理。

### comSkills 文档（技能文档）
位于 `comSkills/` 目录，提供开发技能参考：
- Vue 3 Composition API 使用规范
- Vue Router 配置和权限控制
- Pinia 状态管理
- Element Plus 组件使用规范
- Axios 请求封装

### Config 文档（配置和规范）
位于 `Config/` 目录，团队协作规范：
- 编码规范
- Git 提交规范
- 开发流程
- 环境变量配置说明

## 🔧 配置说明

### 环境变量

主要配置项：
```bash
# 应用标题
VITE_APP_TITLE=后台管理系统

# API 基础地址
VITE_BASE_API=http://localhost:3000

# 公共路径
VITE_PUBLIC_PATH=/
```

详细配置说明请查看 [环境变量配置文档](./Config/env-config.md)

## 📝 开发指南

### 新成员入职
1. 阅读 [编码规范](./Config/coding-standards.md)
2. 了解 [开发流程](./Config/development-workflow.md)
3. 熟悉 [Git 提交规范](./Config/git-commit-guide.md)

### 开始新功能
1. 参考 [开发流程](./Config/development-workflow.md) 创建功能分支
2. 查看 [技能文档](./comSkills/README.md) 了解技术栈使用
3. 按照 [编码规范](./Config/coding-standards.md) 编写代码
4. 遵循 [Git 提交规范](./Config/git-commit-guide.md) 提交代码

## 🛠️ 核心功能

- ✅ 用户登录/登出
- ✅ 动态路由
- ✅ 路由懒加载
- ✅ 路由权限控制
- ✅ 页面级权限
- ✅ 指令级权限
- ✅ 权限函数
- ✅ 主题切换（亮色/暗色）
- ✅ 菜单收起/展开
- ✅ 面包屑导航
- ✅ 标签页导航
- ✅ 全屏功能
- ✅ 响应式布局
- ✅ SVG 图标
- ✅ 自动更新检测

## Git 提交规范

- `feat` - 增加新功能
- `fix` - 修复问题/BUG
- `docs` - 文档/注释
- `style` - 代码风格相关无影响运行结果的
- `refactor` - 重构
- `perf` - 优化/性能提升
- `test` - 测试相关
- `chore` - 依赖更新/脚手架配置修改等
- `revert` - 撤销修改
- `wip` - 开发中

详细说明请查看 [Git 提交规范文档](./Config/git-commit-guide.md)

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

提交前请确保：
- 代码符合 [编码规范](./Config/coding-standards.md)
- 提交信息符合 [Git 提交规范](./Config/git-commit-guide.md)
- 通过 ESLint 检查

## 📄 许可证

[MIT](LICENSE)

## 👨‍💻 作者

SunnyRun

---

如果这个项目对你有帮助，欢迎 Star ⭐️
