# 前端项目模板集合 (mfyFe-template)

<div align="center">

一个包含多种前端技术栈的后台管理系统模板集合

</div>

## 📦 项目列表

### 1. React Hooks Admin
基于 **React 18 + TypeScript + Vite + Ant Design** 的现代化后台管理系统

- 🚀 最新技术栈：React 18、TypeScript 5、Vite 7
- 🎨 UI 组件：Ant Design 5.x
- 📦 状态管理：Redux Toolkit + Redux Persist
- 🛣️ 路由系统：React Router v6
- 📚 完善文档：AI 需求文档、技能文档、配置规范

**项目路径**: `react-hooks-Admin/`

[查看详细文档 →](./react-hooks-Admin/README.md)

### 2. Vue3 Admin Vite
基于 **Vue 3 + TypeScript + Vite + Element Plus** 的现代化后台管理系统

- 🚀 最新技术栈：Vue 3.5、TypeScript 5、Vite 6
- 🎨 UI 组件：Element Plus 2.x
- 📦 状态管理：Pinia
- 🛣️ 路由系统：Vue Router 4
- 📚 完善文档：AI 需求文档、技能文档、配置规范

**项目路径**: `vue3-admin-vite/`

[查看详细文档 →](./vue3-admin-vite/README.md)

### 3. 微信小程序模板 (Weapp Vue3 Vite)
基于 **uni-app + Vue 3 + TypeScript + Vite** 的微信小程序模板

- 🚀 技术栈：uni-app、Vue 3、TypeScript、Vite 5
- 📱 跨平台：支持微信小程序、H5、App
- 📦 状态管理：Pinia
- 📚 完善文档：AI 需求文档、技能文档、配置规范

**项目路径**: `weapp-vue3-vite/`

[查看详细文档 →](./weapp-vue3-vite/README.md)

## 📁 整体项目结构

```text
mfyFe-template/
│
├── react-hooks-Admin/           # React 后台管理系统
│   ├── AI/                      # 需求文档和版本管理
│   │   └── v1.0.0/
│   │       ├── infra.md        # 基础架构说明
│   │       ├── spec/           # 需求规格文档
│   │       ├── tech_solution/  # 技术方案文档
│   │       └── tasks/          # 任务拆解文档
│   ├── comSkills/               # 技能文档集合
│   │   ├── react-hooks.md
│   │   ├── router.md
│   │   ├── redux-toolkit.md
│   │   ├── axios.md
│   │   └── antd.md
│   ├── Config/                  # 配置和规范文档
│   │   ├── coding-standards.md
│   │   ├── git-commit-guide.md
│   │   ├── development-workflow.md
│   │   └── env-config.md
│   ├── Project/                 # 项目源代码
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── redux/
│   │   │   ├── routers/
│   │   │   ├── styles/
│   │   │   ├── utils/
│   │   │   ├── views/
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── types/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.mts
│   ├── .gitignore
│   ├── LICENSE
│   └── README.md
│
├── vue3-admin-vite/             # Vue3 后台管理系统
│   ├── AI/                      # 需求文档和版本管理
│   │   └── v1.0.0/
│   │       ├── infra.md        # 基础架构说明
│   │       ├── spec/           # 需求规格文档
│   │       ├── tech_solution/  # 技术方案文档
│   │       └── tasks/          # 任务拆解文档
│   ├── comSkills/               # 技能文档集合
│   │   ├── vue3-composition-api.md
│   │   ├── vue-router.md
│   │   ├── pinia.md
│   │   ├── element-plus.md
│   │   └── axios.md
│   ├── Config/                  # 配置和规范文档
│   │   ├── coding-standards.md
│   │   ├── git-commit-guide.md
│   │   ├── development-workflow.md
│   │   └── env-config.md
│   ├── Project/                 # 项目源代码
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── config/
│   │   │   ├── directives/
│   │   │   ├── router/
│   │   │   ├── store/
│   │   │   ├── styles/
│   │   │   ├── utils/
│   │   │   ├── views/
│   │   │   ├── App.vue
│   │   │   └── main.ts
│   │   ├── types/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── .gitignore
│   ├── LICENSE
│   └── README.md
│
├── weapp-vue3-vite/             # 微信小程序模板
│   ├── AI/                      # 需求文档和版本管理
│   │   ├── 编码规范/            # 旧版编码规范（待迁移）
│   │   │   ├── workflow.md
│   │   │   └── 编码规范.md
│   │   ├── 需求文档/            # 旧版需求文档（待迁移）
│   │   └── v1.0.0/
│   │       ├── infra.md        # 基础架构说明
│   │       ├── spec/           # 需求规格文档
│   │       ├── tech_solution/  # 技术方案文档
│   │       └── tasks/          # 任务拆解文档
│   ├── comSkills/               # 技能文档集合
│   │   ├── vue3-composition-api.md
│   │   ├── uniapp-guide.md
│   │   └── pinia.md
│   ├── Config/                  # 配置和规范文档
│   │   ├── coding-standards.md
│   │   ├── git-commit-guide.md
│   │   ├── development-workflow.md
│   │   └── env-config.md
│   ├── Project/                 # 项目源代码
│   │   ├── conf/               # 构建配置
│   │   ├── dist/               # 构建输出
│   │   ├── src/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── constants/
│   │   │   ├── pages/
│   │   │   ├── subPages/
│   │   │   ├── stores/
│   │   │   ├── utils/
│   │   │   ├── static/
│   │   │   ├── App.vue
│   │   │   ├── main.ts
│   │   │   ├── pages.json
│   │   │   ├── manifest.json
│   │   │   └── uni.scss
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── vite.config.ts
│   ├── .gitignore
│   ├── LICENSE
│   └── README.md
│
└── README.md                    # 本文件：项目集合说明
```

## 🚀 快速开始

### 使用 React 模板
```bash
cd react-hooks-Admin/Project
pnpm install
npm run dev
```

### 使用 Vue3 模板
```bash
cd vue3-admin-vite/Project
pnpm install
npm run dev
```

### 使用小程序模板
```bash
cd weapp-vue3-vite/Project
pnpm install
npm run dev
```

## ✨ 共同特性

### 文档体系
所有项目都包含三大文档体系：

1. **AI 文档（需求版本管理）**
   - 基础架构说明（infra.md）
   - 需求规格文档（spec/）
   - 技术方案文档（tech_solution/）
   - 任务拆解文档（tasks/）

2. **comSkills 文档（技能文档）**
   - 框架使用规范（React Hooks / Vue3 Composition API）
   - 路由配置指南
   - 状态管理最佳实践
   - UI 组件库使用规范
   - HTTP 请求封装

3. **Config 文档（配置和规范）**
   - 编码规范
   - Git 提交规范
   - 开发流程
   - 环境变量配置

### 代码规范
- ✅ TypeScript 严格类型检查
- ✅ ESLint 代码检查
- ✅ Prettier 代码格式化
- ✅ Husky + Lint-staged Git 提交检查
- ✅ 统一的 Git 提交规范

### 构建工具
- ✅ Vite 快速构建
- ✅ 代码分割和懒加载
- ✅ 生产环境优化
- ✅ 开发服务器热更新

## 📖 使用说明

### 选择合适的模板

- **React 生态**: 选择 `react-hooks-Admin`
  - 适合：熟悉 React 生态，需要使用 Ant Design 的项目
  - 特点：JSX、Hooks、Redux Toolkit

- **Vue 生态**: 选择 `vue3-admin-vite`
  - 适合：熟悉 Vue 生态，需要使用 Element Plus 的项目
  - 特点：SFC、Composition API、Pinia

- **小程序**: 选择 `weapp-vue3-vite`
  - 适合：开发微信小程序、跨平台应用
  - 特点：uni-app、多端编译

### 文档阅读顺序

1. 先阅读项目的 README.md 了解项目概况
2. 查看 AI/v1.0.0/infra.md 了解项目架构
3. 阅读 Config/ 目录下的规范文档
4. 参考 comSkills/ 目录学习技术栈使用
5. 查看 AI/v1.0.0/spec/ 了解具体需求示例

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

提交前请确保：
- 代码符合各项目的编码规范
- 提交信息符合 Git 提交规范
- 通过 ESLint 和 TypeScript 检查
- 更新相关文档

## 📄 许可证

所有项目均采用 [MIT](LICENSE) 许可证

## 👨‍💻 作者

SunnyRun

---

如果这些模板对你有帮助，欢迎 Star ⭐️
