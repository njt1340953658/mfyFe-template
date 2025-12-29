# React Hooks Admin 🚀

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-646cff?logo=vite)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-0170fe?logo=ant-design)

一个基于 React18 + TypeScript + Vite + Ant Design 的现代化后台管理系统模板

</div>

## ✨ 特性

- 🚀 **最新技术栈**: 使用 React 18、TypeScript、Vite 7 等前端前沿技术
- 🎨 **UI 组件**: 基于 Ant Design 5.x 组件库
- 🌈 **主题切换**: 支持亮色/暗色主题一键切换
- 🔐 **权限管理**: 完善的路由权限和按钮级权限控制
- 📦 **状态管理**: 使用 Redux Toolkit + Redux Persist 管理状态
- 🛣️ **路由系统**: 基于 React Router v6，支持动态路由和懒加载
- 📱 **响应式布局**: 支持桌面端和移动端自适应
- 🎯 **TypeScript**: 完整的类型定义，提供更好的开发体验
- 🔧 **代码规范**: 集成 ESLint + Prettier + Husky，保证代码质量
- 📚 **完善文档**: 提供详细的开发文档和技能文档

## 📦 技术栈

- **框架**: React 18.x
- **语言**: TypeScript 5.x
- **构建工具**: Vite 7.x
- **路由**: React Router v6
- **状态管理**: Redux Toolkit + Redux Persist
- **UI 框架**: Ant Design 5.x
- **HTTP 请求**: Axios
- **CSS 预处理**: Less
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky + Lint-staged

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- pnpm >= 8.x (推荐) 或 npm >= 7.x

### 安装依赖

```bash
# 进入项目目录
cd react-hooks-Admin/Project

# 安装依赖（推荐使用 pnpm）
pnpm install

# 或使用 npm
npm install
```

### 开发运行

```bash
# 启动开发服务器
npm run dev

# 或
npm run serve
```

浏览器自动打开 http://localhost:5173

### 生产构建

```bash
# 开发环境构建
npm run build:dev

# 生产环境构建
npm run build:prod

# 或
npm run build
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# Prettier 格式化
npm run lint:prettier

# TypeScript 类型检查
npm run type-check
```

## 📁 项目结构

```text
react-hooks-Admin/
├── AI/                          # 需求文档和版本管理
│   └── v1.0.0/
│       ├── infra.md            # 基础架构说明
│       ├── spec/               # 需求规格文档
│       │   └── baixs/
│       │       └── user_spec.md
│       ├── tech_solution/      # 技术方案文档
│       │   └── baixs/
│       │       └── user_solution.md
│       └── tasks/              # 任务拆解文档
│           └── baixs/
│               └── user_task.md
├── comSkills/                   # 技能文档集合
│   ├── README.md
│   ├── react-hooks.md          # React Hooks 使用规范
│   ├── router.md               # React Router 配置指南
│   ├── redux-toolkit.md        # Redux Toolkit 使用指南
│   ├── axios.md                # Axios 封装使用指南
│   └── antd.md                 # Ant Design 使用规范
├── Config/                      # 配置和规范文档
│   ├── README.md
│   ├── coding-standards.md     # 编码规范
│   ├── git-commit-guide.md     # Git 提交规范
│   ├── development-workflow.md # 开发流程
│   └── env-config.md           # 环境变量配置说明
├── Project/                     # 项目源代码
│   ├── public/                 # 静态资源文件（不经过构建）
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/                # API 接口定义
│   │   │   ├── login.ts
│   │   │   └── user.ts
│   │   ├── assets/             # 静态资源（经过构建）
│   │   │   └── images/
│   │   ├── components/         # 全局组件
│   │   │   ├── ErrorMessage/  # 错误页面组件
│   │   │   ├── layouts/       # 布局组件
│   │   │   ├── Loading/       # 加载组件
│   │   │   └── svgIcon/       # SVG 图标组件
│   │   ├── hooks/              # 自定义 Hooks
│   │   │   └── useTheme.ts
│   │   ├── redux/              # Redux 状态管理
│   │   │   ├── index.ts       # Store 配置
│   │   │   ├── interface/     # 类型定义
│   │   │   └── modules/       # 状态模块
│   │   │       ├── auth.ts
│   │   │       ├── breadcrumb.ts
│   │   │       ├── global.ts
│   │   │       └── menu.ts
│   │   ├── routers/            # 路由配置
│   │   │   ├── authRouter.tsx # 路由鉴权
│   │   │   ├── index.tsx      # 路由主入口
│   │   │   ├── interface/     # 路由类型定义
│   │   │   └── router/        # 路由模块
│   │   │       ├── error.tsx
│   │   │       └── home.tsx
│   │   ├── styles/             # 全局样式
│   │   │   ├── common.less
│   │   │   ├── reset.less
│   │   │   └── styles.css
│   │   ├── utils/              # 工具函数
│   │   │   ├── service/       # HTTP 服务封装
│   │   │   ├── nprogress.ts   # 进度条配置
│   │   │   └── utilTool.ts    # 工具函数
│   │   ├── views/              # 页面组件
│   │   │   ├── home/          # 首页
│   │   │   └── login/         # 登录页
│   │   ├── App.tsx             # 根组件
│   │   └── main.tsx            # 应用入口
│   ├── types/                  # 全局类型声明
│   │   ├── global.d.ts
│   │   ├── vite-env.d.ts
│   │   └── window.d.ts
│   ├── .eslintrc.js            # ESLint 配置
│   ├── .prettierrc.js          # Prettier 配置
│   ├── index.html              # HTML 模板
│   ├── package.json            # 项目依赖
│   ├── tsconfig.json           # TypeScript 配置
│   └── vite.config.mts         # Vite 配置
├── .gitignore                  # Git 忽略文件
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
- React Hooks 使用规范和最佳实践
- React Router 配置和权限控制
- Redux Toolkit 状态管理
- Axios 请求封装
- Ant Design 组件使用规范

### Config 文档（配置和规范）
位于 `Config/` 目录，团队协作规范：
- 编码规范
- Git 提交规范
- 开发流程
- 环境变量配置说明

## 🔧 配置说明

### 环境变量

项目支持多环境配置，配置文件位于 `Project/` 目录：

- `.env.development` - 开发环境配置
- `.env.production` - 生产环境配置

主要配置项：
```bash
# API 基础地址
VITE_API_URL=http://localhost:3000

# 路由模式：hash | history
VITE_ROUTER_MODE=hash

# 开发服务器端口
VITE_PORT=5173
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

### 常见问题
请查看各文档中的"常见问题"章节，或联系项目负责人。

## 🛠️ 核心功能

- ✅ 用户登录/登出
- ✅ 动态路由
- ✅ 路由懒加载
- ✅ 路由权限控制
- ✅ 页面级权限
- ✅ 按钮级权限
- ✅ 主题切换（亮色/暗色）
- ✅ 菜单收起/展开
- ✅ 面包屑导航
- ✅ 全屏功能
- ✅ 状态持久化
- ✅ 响应式布局

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

提交前请确保：
- 代码符合 [编码规范](./Config/coding-standards.md)
- 提交信息符合 [Git 提交规范](./Config/git-commit-guide.md)
- 通过 ESLint 和 TypeScript 检查

## 📄 许可证

[MIT](LICENSE)

## 👨‍💻 作者

SunnyRun

---

如果这个项目对你有帮助，欢迎 Star ⭐️
