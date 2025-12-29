# Vue3 Admin Vite 前端项目基础架构

## 系统背景
- 这是一个基于 Vue3 + TypeScript 的现代化后台管理系统前端项目
- 使用 Vue Router 4 进行路由管理，Pinia 进行状态管理
- 采用 Element Plus 2.x 作为 UI 组件库，Vite 作为构建工具
- 支持主题切换、权限控制、动态路由等企业级功能

## 技术栈
- **框架**: Vue 3.5.x + TypeScript 5.x
- **构建工具**: Vite 6.x
- **路由**: Vue Router 4.x
- **状态管理**: Pinia 2.x
- **UI 框架**: Element Plus 2.x
- **HTTP 请求**: Axios
- **代码规范**: ESLint + Prettier + Husky
- **样式方案**: Sass + normalize.css

## 项目架构模式
```
表现层 (Views) 
   ↓
布局层 (Layout Components)
   ↓
路由层 (Vue Router) ← 路由守卫 (Permission Guard)
   ↓
状态层 (Pinia Store)
   ↓
服务层 (API + Utils)
   ↓
网络层 (Axios Service)
```

## 目录结构
```
vue3-admin-vite/
├── public/                    # 静态资源（不经过构建）
│   ├── app-loading.css       # 应用加载样式
│   └── favicon.ico
├── src/
│   ├── api/                   # API 接口定义
│   │   └── login.ts          # 登录相关接口
│   ├── assets/               # 静态资源（经过构建）
│   │   ├── docs/            # 文档图片
│   │   └── layout/          # 布局相关图片
│   ├── components/           # 全局组件
│   │   ├── icons/           # 图标组件
│   │   ├── layout/          # 布局组件
│   │   │   ├── components/  # 布局子组件
│   │   │   │   ├── AppMain.vue        # 主内容区
│   │   │   │   ├── BreadCrumb/        # 面包屑导航
│   │   │   │   ├── Hamburger/         # 菜单折叠按钮
│   │   │   │   ├── NavigationBar/     # 顶部导航栏
│   │   │   │   ├── Sidebar/           # 侧边栏菜单
│   │   │   │   ├── TagsView/          # 标签页导航
│   │   │   │   ├── Settings/          # 设置面板
│   │   │   │   └── RightPanel/        # 右侧面板
│   │   │   ├── index.vue    # 布局主组件
│   │   │   └── useResize.ts # 响应式布局 Hook
│   │   ├── Screenfull/      # 全屏组件
│   │   ├── SvgIcon/         # SVG 图标组件
│   │   ├── ThemeSwitch/     # 主题切换组件
│   │   ├── SearchForm/      # 搜索表单组件
│   │   ├── TableList/       # 表格列表组件
│   │   └── v-charts/        # 图表组件
│   ├── config/               # 配置文件
│   │   ├── async-route.ts   # 异步路由配置
│   │   ├── layout.ts        # 布局配置
│   │   ├── theme.ts         # 主题配置
│   │   └── white-list.ts    # 路由白名单
│   ├── constant/             # 常量定义
│   │   └── key.ts           # 存储键名常量
│   ├── directives/           # 自定义指令
│   │   ├── index.ts
│   │   └── permission/      # 权限指令
│   ├── router/               # 路由配置
│   │   ├── index.ts         # 路由主入口
│   │   ├── interface/       # 路由类型定义
│   │   ├── router/          # 路由模块
│   │   │   ├── dashboard.ts # 首页路由
│   │   │   ├── login.ts     # 登录路由
│   │   │   └── permission.ts # 权限测试路由
│   │   └── RouterLogic.ts   # 路由逻辑处理
│   ├── store/                # Pinia 状态管理
│   │   ├── index.ts         # Store 主入口
│   │   └── modules/         # 状态模块
│   │       ├── app.ts       # 应用状态
│   │       ├── permission.ts # 权限状态
│   │       ├── settings.ts  # 设置状态
│   │       ├── tags-view.ts # 标签页状态
│   │       └── user.ts      # 用户状态
│   ├── styles/               # 全局样式
│   │   ├── index.scss       # 样式入口
│   │   ├── mixins.scss      # Sass 混入
│   │   ├── transition.scss  # 过渡动画
│   │   └── theme/           # 主题样式
│   │       ├── dark/        # 暗色主题
│   │       ├── register.scss # 主题注册
│   │       └── theme.scss   # 主题变量
│   ├── utils/                # 工具函数
│   │   ├── service.ts       # Axios 封装
│   │   ├── cookies.ts       # Cookie 操作
│   │   ├── permission.ts    # 权限判断
│   │   ├── validate.ts      # 表单校验
│   │   ├── utilTool.ts      # 通用工具
│   │   ├── autoUpdate.ts    # 自动更新检测
│   │   └── index.ts         # 工具函数入口
│   ├── views/                # 页面组件
│   │   ├── dashboard/       # 仪表盘
│   │   │   ├── admin/       # 管理员首页
│   │   │   ├── editor/      # 编辑者首页
│   │   │   └── index.vue    # 首页主组件
│   │   ├── login/           # 登录页
│   │   ├── permission/      # 权限测试页
│   │   ├── error-page/      # 错误页面
│   │   │   ├── 401.vue
│   │   │   ├── 403.vue
│   │   │   └── 404.vue
│   │   └── redirect/        # 重定向页面
│   ├── App.vue               # 根组件
│   └── main.ts               # 应用入口
├── types/                    # 全局类型声明
│   ├── auto-imports.d.ts    # 自动导入类型
│   ├── components.d.ts      # 组件类型
│   ├── env.d.ts             # 环境变量类型
│   └── shims-vue.d.ts       # Vue 类型声明
├── .eslintrc.js              # ESLint 配置
├── .prettierrc.js            # Prettier 配置
├── index.html                # HTML 模板
├── package.json              # 项目依赖
├── tsconfig.json             # TypeScript 配置
└── vite.config.ts            # Vite 配置
```

## 核心功能模块

### 1. 路由系统
- **动态路由加载**: 根据用户权限动态生成路由
- **路由懒加载**: 通过 Vite 的动态 import 实现按需加载
- **路由守卫**: 全局前置守卫进行登录状态检查和权限验证
- **白名单机制**: 无需登录即可访问的页面配置

### 2. 状态管理
- **Pinia**: Vue 3 推荐的状态管理方案
- **模块化设计**: 按功能划分不同的 Store（app、user、permission 等）
- **持久化**: 使用 localStorage/sessionStorage 保持登录状态
- **TypeScript 支持**: 完整的类型推导

### 3. 请求封装
- **Axios 拦截器**: 统一处理请求/响应拦截
- **请求取消**: 防止重复请求和页面切换时取消未完成的请求
- **错误处理**: 统一的错误码处理和提示
- **Loading 状态**: 自动显示/隐藏加载动画
- **Progress Bar**: 使用 nprogress 显示页面加载进度

### 4. 布局系统
- **Layout 组件**: 包含 Sidebar、NavigationBar、AppMain、TagsView 的完整布局
- **响应式设计**: 支持移动端和桌面端自适应
- **菜单折叠**: 侧边栏展开/收起功能
- **面包屑导航**: 自动根据路由生成面包屑
- **标签页导航**: 多标签页快捷切换

### 5. 主题系统
- **动态主题切换**: 支持亮色/暗色主题
- **Element Plus 主题配置**: 通过 CSS 变量实现主题切换
- **样式变量**: 使用 Sass 变量统一管理主题色
- **持久化**: 主题设置持久化存储

### 6. 权限控制
- **路由级权限**: 通过路由守卫控制页面访问
- **指令级权限**: 自定义 v-permission 指令用于按钮级控制
- **函数级权限**: checkPermission 函数判断权限
- **动态菜单**: 根据用户权限动态生成菜单

## 配置与环境变量
- **开发环境**: `.env.development`
- **生产环境**: `.env.production`
- **测试环境**: `.env.staging`（可选）
- **关键环境变量**:
  - `VITE_APP_TITLE`: 应用标题
  - `VITE_BASE_API`: API 基础地址
  - `VITE_PUBLIC_PATH`: 公共路径
  - `VITE_PORT`: 开发服务器端口

## 构建优化
- **代码分割**: 按路由和第三方库进行分包
- **Tree Shaking**: 自动移除未使用的代码
- **资源压缩**: Esbuild 压缩和代码混淆
- **按需导入**: Element Plus 组件按需引入

## 代码规范
- **ESLint**: 基于 TypeScript 和 Vue 3 规则
- **Prettier**: 统一代码格式化
- **Husky + Lint-staged**: Git 提交前自动检查和格式化
- **TypeScript**: 严格类型检查

## 开发工作流
1. **开发**: `npm run dev` 启动开发服务器
2. **构建**: `npm run build:test` 或 `npm run build:prod` 指定环境
3. **预览**: `npm run preview:prod` 预览构建结果
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
1. **国际化 (i18n)**: 可集成 `vue-i18n` 实现多语言
2. **Mock 数据**: 可使用 Vite Mock Plugin 进行接口模拟
3. **单元测试**: 可使用 Vitest + Vue Test Utils
4. **E2E 测试**: 可使用 Playwright 或 Cypress
5. **性能监控**: 可集成 `web-vitals` 监控核心指标
6. **错误追踪**: 可集成 Sentry 进行错误监控
7. **自动更新**: 已集成版本检测和自动刷新功能

