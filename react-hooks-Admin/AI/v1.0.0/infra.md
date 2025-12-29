# React Hooks Admin 前端项目基础架构

## 系统背景
- 这是一个基于 React18 + TypeScript 的现代化后台管理系统前端项目
- 使用 React-Router v6 进行路由管理，Redux Toolkit 进行状态管理
- 采用 Ant Design 5.x 作为 UI 组件库，Vite 作为构建工具
- 支持主题切换、权限控制、路由懒加载等企业级功能

## 技术栈
- **框架**: React 18.x + TypeScript 5.x
- **构建工具**: Vite 7.x
- **路由**: React Router v6.x (支持 Hash 和 History 模式)
- **状态管理**: Redux Toolkit + Redux Persist
- **UI 框架**: Ant Design 5.x
- **HTTP 请求**: Axios
- **代码规范**: ESLint + Prettier + Husky
- **样式方案**: Less + PostCSS

## 项目架构模式
```
表现层 (Views) 
   ↓
布局层 (Layouts)
   ↓
路由层 (Routers) ← 鉴权中间件 (AuthRouter)
   ↓
状态层 (Redux Store)
   ↓
服务层 (API + Utils)
   ↓
网络层 (Axios Service)
```

## 目录结构
```
Project/
├── public/                    # 静态资源（不经过构建）
│   └── favicon.ico
├── src/
│   ├── api/                   # API 接口定义
│   │   ├── login.ts          # 登录相关接口
│   │   └── user.ts           # 用户相关接口
│   ├── assets/               # 静态资源（经过构建）
│   │   └── images/          # 图片资源
│   ├── components/           # 全局组件
│   │   ├── ErrorMessage/    # 错误页面组件 (403/404/500)
│   │   ├── layouts/         # 布局组件
│   │   │   ├── Header/      # 顶部栏（头像、面包屑、全屏等）
│   │   │   ├── Menu/        # 侧边菜单
│   │   │   └── lazyLoad/    # 路由懒加载
│   │   ├── Loading/         # 加载动画
│   │   └── svgIcon/         # SVG 图标组件
│   ├── hooks/                # 自定义 Hooks
│   │   └── useTheme.ts      # 主题切换 Hook
│   ├── redux/                # Redux 状态管理
│   │   ├── modules/         # 状态模块
│   │   │   ├── auth.ts      # 认证状态
│   │   │   ├── breadcrumb.ts # 面包屑状态
│   │   │   ├── global.ts    # 全局配置状态
│   │   │   └── menu.ts      # 菜单状态
│   │   ├── interface/       # Redux 类型定义
│   │   └── index.ts         # Store 配置
│   ├── routers/              # 路由配置
│   │   ├── router/          # 路由模块
│   │   │   ├── home.tsx    # 首页路由
│   │   │   └── error.tsx   # 错误页路由
│   │   ├── authRouter.tsx   # 路由鉴权组件
│   │   └── index.tsx        # 路由主入口
│   ├── styles/               # 全局样式
│   │   ├── reset.less       # 样式重置
│   │   ├── common.less      # 公共样式
│   │   └── styles.css       # 全局样式
│   ├── utils/                # 工具函数
│   │   ├── service/         # HTTP 服务封装
│   │   │   ├── index.ts     # Axios 实例配置
│   │   │   └── helper/      # 辅助工具
│   │   │       ├── axiosCancel.ts  # 请求取消
│   │   │       └── checkStatus.ts  # 状态码处理
│   │   ├── nprogress.ts     # 进度条配置
│   │   └── utilTool.ts      # 通用工具函数
│   ├── views/                # 页面组件
│   │   ├── login/           # 登录页
│   │   └── home/            # 首页
│   ├── App.tsx               # 根组件
│   └── main.tsx              # 应用入口
├── types/                    # 全局类型声明
│   ├── global.d.ts          # 全局类型
│   ├── window.d.ts          # Window 扩展
│   └── vite-env.d.ts        # Vite 环境变量类型
├── eslint.config.mjs         # ESLint 配置
├── prettier.config.js        # Prettier 配置
├── postcss.config.js         # PostCSS 配置
├── tsconfig.json             # TypeScript 配置
├── vite.config.mts           # Vite 配置
└── package.json              # 项目依赖
```

## 核心功能模块

### 1. 路由系统
- **动态路由加载**: 使用 `import.meta.glob` 自动加载路由模块
- **路由懒加载**: 通过 `React.lazy` + `Suspense` 实现按需加载
- **路由鉴权**: `AuthRouter` 组件进行登录状态检查和权限验证
- **路由模式**: 支持 Hash 和 History 两种模式，通过环境变量切换

### 2. 状态管理
- **Redux Toolkit**: 简化 Redux 使用，提供现代化的状态管理方案
- **Redux Persist**: 状态持久化，刷新页面保持登录状态
- **模块化设计**: 按功能划分不同的 slice（auth、menu、global 等）

### 3. 请求封装
- **Axios 拦截器**: 统一处理请求/响应拦截
- **请求取消**: 防止重复请求和页面切换时取消未完成的请求
- **错误处理**: 统一的错误码处理和提示
- **Loading 状态**: 自动显示/隐藏加载动画
- **Progress Bar**: 使用 nprogress 显示页面加载进度

### 4. 布局系统
- **Layout 组件**: 包含 Header、Menu、Content 的完整布局
- **响应式设计**: 支持移动端和桌面端自适应
- **菜单折叠**: 侧边栏展开/收起功能
- **面包屑导航**: 自动根据路由生成面包屑

### 5. 主题系统
- **动态主题切换**: 支持亮色/暗色主题
- **Ant Design 主题配置**: 通过 ConfigProvider 全局配置
- **样式变量**: 使用 Less 变量统一管理主题色

### 6. 权限控制
- **路由级权限**: 通过 `AuthRouter` 控制页面访问
- **组件级权限**: 预留权限指令用于按钮级控制
- **菜单权限**: 根据用户权限动态生成菜单

## 配置与环境变量
- **开发环境**: `.env.development`
- **生产环境**: `.env.production`
- **关键环境变量**:
  - `VITE_API_URL`: API 基础地址
  - `VITE_ROUTER_MODE`: 路由模式 (hash/history)
  - `VITE_PUBLIC_PATH`: 公共路径
  - `VITE_PORT`: 开发服务器端口
  - `VITE_OPEN`: 是否自动打开浏览器
  - `VITE_BUILD_COMPRESS`: 构建压缩方式 (gzip)
  - `VITE_REPORT`: 是否生成构建分析报告

## 构建优化
- **代码分割**: 按路由和第三方库进行分包
  - `react-vendor`: React 相关库
  - `redux-vendor`: Redux 相关库
  - `ui-vendor`: Ant Design UI 库
  - `utils-vendor`: 工具库
- **Tree Shaking**: 自动移除未使用的代码
- **资源压缩**: Gzip 压缩和代码混淆
- **构建分析**: Rollup Visualizer 可视化分析

## 代码规范
- **ESLint**: 基于 TypeScript 和 React 规则
- **Prettier**: 统一代码格式化
- **Husky + Lint-staged**: Git 提交前自动检查和格式化
- **TypeScript**: 严格类型检查

## 开发工作流
1. **开发**: `npm run dev` 启动开发服务器
2. **构建**: `npm run build` 或 `npm run build:dev/prod` 指定环境
3. **预览**: `npm run preview` 预览构建结果
4. **代码检查**: `npm run lint` 检查代码规范
5. **格式化**: `npm run lint:prettier` 格式化代码

## AI 文档结构
```
AI/
├── v1.0.0/                   # 当前版本
│   ├── infra.md             # 本文件：基础架构说明
│   ├── spec/                # 需求规格说明
│   │   └── baixs/          # 按业务模块组织
│   │       └── user_spec.md
│   ├── tech_solution/       # 技术方案
│   │   └── baixs/
│   │       └── user_solution.md
│   └── tasks/               # 任务拆解
│       └── baixs/
│           └── user_task.md
└── v1.0.1/                  # 后续版本（按需创建）
```

## 扩展建议
1. **国际化 (i18n)**: 可集成 `react-i18next` 实现多语言
2. **Mock 数据**: 可集成 `msw` 或 `mockjs` 进行接口模拟
3. **单元测试**: 可使用 Vitest + React Testing Library
4. **E2E 测试**: 可使用 Playwright 或 Cypress
5. **性能监控**: 可集成 `web-vitals` 监控核心指标
6. **错误追踪**: 可集成 Sentry 进行错误监控
