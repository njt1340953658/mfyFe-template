# Hooks-Admin 项目编码规范与开发指南

## 项目概述

本项目是基于 React 19 + TypeScript + Vite 7 + Redux Toolkit + Ant Design 5 的后台管理系统框架。

### 技术栈
- **框架**: React 19.1.0
- **语言**: TypeScript 5.8.3
- **构建工具**: Vite 7.1.7
- **状态管理**: Redux Toolkit 2.8.2 + Redux Persist 6.0.0
- **UI 组件库**: Ant Design 5.27.4
- **路由**: React Router v7.6.3
- **样式**: Less 4.3.0
- **代码规范**: ESLint 9.31.0 + Prettier 3.6.2

---

## 文件命名与组织规范

### 文件命名
- **组件文件**: 使用 PascalCase，如 `LoginForm.tsx`、`AvatarIcon.tsx`
- **工具函数文件**: 使用 camelCase，如 `utilTool.ts`、`nprogress.ts`
- **样式文件**: 与组件同名，使用 `index.less`，如组件 `Header/index.tsx` 对应 `Header/index.less`
- **类型定义文件**: 使用 `index.ts` 统一导出，如 `redux/interface/index.ts`
- **路由文件**: 使用小写，如 `home.tsx`、`error.tsx`

### 目录结构
```
src/
├── api/              # API 接口管理，按模块划分
├── assets/           # 静态资源（图片、图标等）
├── components/       # 全局公共组件
│   ├── layouts/     # 布局组件
│   └── [Component]/ # 组件目录，包含 index.tsx 和 index.less
├── hooks/           # 自定义 Hooks
├── redux/           # Redux 状态管理
│   ├── modules/     # Redux slices
│   └── interface/   # TypeScript 类型定义
├── routers/         # 路由配置
│   ├── router/      # 路由模块文件
│   └── interface/   # 路由类型定义
├── styles/          # 全局样式文件
├── utils/           # 工具函数库
└── views/           # 页面组件
```

### 导入顺序规范
1. React 相关库
2. 第三方库（antd、react-router-dom 等）
3. 项目内部模块（使用 `@/` 别名）
4. 类型定义
5. 样式文件（最后导入）

示例：
```typescript
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '@/api/login'
import { HOME_URL } from '@/routers'
import { setToken } from '@/redux/modules/global'
import { useDispatch } from '@/redux'
import './index.less'
```

---

## 代码风格规范

### 基本规则
- **引号**: 使用单引号 `'`，不使用双引号
- **分号**: 不使用分号（Prettier 配置 `semi: false`）
- **缩进**: 使用 2 个空格，不使用 Tab
- **行宽**: 最大 130 个字符（Prettier 配置 `printWidth: 130`）
- **尾随逗号**: 不使用尾随逗号（`trailingComma: 'none'`）
- **箭头函数**: 参数必须使用括号包裹（`arrowParens: 'always'`）

### 变量命名
- **组件名**: PascalCase，如 `LoginForm`、`LayoutHeader`
- **变量/函数名**: camelCase，如 `userInfo`、`getMenuList`
- **常量**: 全大写下划线，如 `HOME_URL`、`PORT1`
- **类型/接口**: PascalCase，如 `AuthState`、`RouteObject`
- **私有属性**: 使用下划线前缀（如需要），如 `_object`

### 代码格式示例
```typescript
// ✅ 正确
const getUserInfo = async (id: number) => {
  const { data } = await getUserApi(id)
  return data
}

// ❌ 错误
const getUserInfo = async id => {
  const { data } = await getUserApi(id);
  return data;
}
```

---

## TypeScript 使用规范

### 类型定义
- **接口定义**: 使用 `interface` 定义对象类型，统一放在 `interface/index.ts` 中
- **类型导出**: 使用 `export interface` 导出类型
- **类型导入**: 使用 `import type` 导入纯类型
- **any 使用**: 项目中允许使用 `any`，但应尽量使用具体类型

### 类型定义示例
```typescript
// ✅ 正确 - 接口定义
export interface AuthState {
  authButtons: {
    [propName: string]: any
  }
  authRouter: string[]
}

// ✅ 正确 - 类型导入
import type { SizeType } from 'antd/lib/config-provider/SizeContext'

// ✅ 正确 - 函数类型
const onFinish = async (loginForm: any) => {
  // ...
}
```

### TypeScript 配置
- **strict 模式**: 关闭（`strict: false`）
- **路径别名**: 使用 `@` 指向 `src` 目录
- **JSX**: 使用 `react-jsx` 模式，无需导入 React

---

## React 组件编写规范

### 组件结构
1. **函数式组件**: 统一使用函数式组件和 Hooks
2. **默认导出**: 组件使用 `export default` 导出
3. **组件命名**: 组件名与文件名保持一致
4. **Props 类型**: 使用 TypeScript 接口定义 Props（如需要）

### Hooks 使用规范
- **useState**: 明确指定类型，如 `const [loading, setLoading] = useState<boolean>(false)`
- **useSelector**: 使用项目封装的 `useSelector`，需要指定 `RootState` 类型
- **useDispatch**: 使用项目封装的 `useDispatch`
- **自定义 Hooks**: 以 `use` 开头，如 `useTheme`

### 组件示例
```typescript
// ✅ 正确 - 函数式组件
const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async (loginForm: any) => {
    try {
      setLoading(true)
      const { data } = await loginApi(loginForm)
      dispatch(setToken(data!.access_token))
      message.success('登录成功！')
      navigate(HOME_URL)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} onFinish={onFinish}>
      {/* ... */}
    </Form>
  )
}

export default LoginForm
```

### 组件最佳实践
- **条件渲染**: 使用三元运算符或 `&&` 操作符
- **列表渲染**: 使用 `map` 方法，必须提供 `key` 属性
- **事件处理**: 使用箭头函数或 `useCallback` 优化
- **副作用**: 使用 `useEffect` 处理副作用，注意依赖项

---

## Redux 状态管理规范

### Redux Toolkit 使用
- **Slice 定义**: 使用 `createSlice` 创建 Redux slice
- **Action 导出**: 使用解构导出 actions，如 `export const { setAuthButtons } = authSlice.actions`
- **Reducer 导出**: 使用默认导出 reducer
- **状态类型**: 在 `redux/interface/index.ts` 中定义状态接口

### Redux 示例
```typescript
// ✅ 正确 - Redux Slice
import { AuthState } from '@/redux/interface'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const authState: AuthState = {
  authButtons: {},
  authRouter: []
}

const authSlice = createSlice({
  name: 'auth',
  initialState: authState,
  reducers: {
    setAuthButtons(state: AuthState, { payload }: PayloadAction<{ [propName: string]: any }>) {
      state.authButtons = payload
    },
    setAuthRouter(state: AuthState, { payload }: PayloadAction<string[]>) {
      state.authRouter = payload
    }
  }
})

export const { setAuthButtons, setAuthRouter } = authSlice.actions
export default authSlice.reducer
```

### Redux 使用规范
- **状态选择**: 使用 `useSelector` 选择状态，必须指定 `RootState` 类型
- **派发 Action**: 使用 `useDispatch` 派发 action
- **类型安全**: 使用项目提供的类型化 hooks（`useSelector`、`useDispatch`）

---

## API 接口管理规范

### API 文件组织
- **按模块划分**: 每个业务模块一个文件，如 `login.ts`、`user.ts`
- **端口常量**: 定义微服务端口常量，如 `export const PORT1 = '/hooks'`
- **接口命名**: 使用 camelCase + `Api` 后缀，如 `loginApi`、`getMenuList`

### API 调用示例
```typescript
// ✅ 正确 - API 定义
import http from '@/utils/service'

export const PORT1 = '/hooks'

export const loginApi = (params: any) => http.post(PORT1 + `/login`, params)
export const getMenuList = () => http.get(PORT1 + `/menu/list`)

// ✅ 正确 - API 调用
const { data } = await loginApi(loginForm)
```

### 错误处理
- **统一处理**: 在 `utils/service/index.ts` 的拦截器中统一处理错误
- **成功提示**: 在组件中处理成功提示，如 `message.success('操作成功！')`
- **错误提示**: 错误信息由拦截器统一处理，组件中无需重复处理

---

## 样式编写规范

### Less 使用规范
- **文件命名**: 组件样式文件统一命名为 `index.less`
- **类名命名**: 使用 kebab-case，如 `login-container`、`header-lf`
- **样式导入**: 在组件文件最后导入样式文件
- **全局样式**: 在 `styles/` 目录下定义全局样式

### 样式示例
```less
// ✅ 正确 - Less 样式
.login-container {
  width: 100%;
  height: 100vh;
  
  .login-box {
    display: flex;
    align-items: center;
  }
}
```

### 样式最佳实践
- **避免内联样式**: 尽量使用 className，避免内联 style
- **使用 Ant Design 主题**: 通过 `ConfigProvider` 配置主题
- **响应式设计**: 使用 Less 变量和媒体查询实现响应式

---

## 路由管理规范

### 路由配置
- **路由文件**: 在 `routers/router/` 目录下按模块划分
- **路由类型**: 使用 `RouteObject` 接口定义路由
- **路由元信息**: 使用 `meta` 字段存储路由元信息（标题、权限等）
- **路由懒加载**: 使用 `lazyLoad` 组件实现路由懒加载

### 路由示例
```typescript
// ✅ 正确 - 路由定义
export const rootRouter: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
    meta: {
      title: '登录页',
      key: 'login'
    }
  },
  {
    element: <LayoutIndex />,
    children: [...routerArray]
  }
]
```

### 路由使用
- **导航**: 使用 `useNavigate` hook 进行编程式导航
- **路由参数**: 使用 `useParams`、`useSearchParams` 获取路由参数
- **路由守卫**: 使用 `AuthRouter` 组件实现路由权限控制

---

## 工具函数规范

### 工具函数组织
- **文件命名**: 使用 camelCase，如 `utilTool.ts`
- **函数导出**: 使用命名导出 `export const functionName`
- **函数注释**: 使用 JSDoc 格式注释，包含 `@description`、`@param`、`@return`

### 工具函数示例
```typescript
/**
 * @description 获取localStorage
 * @param {String} key Storage名称
 * @return string
 */
export const localGet = (key: string) => {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key) as string)
  } catch (error) {
    return value
  }
}
```

### 工具函数分类
- **存储工具**: `localGet`、`localSet`、`localRemove`、`localClear`
- **路由工具**: `getOpenKeys`、`searchRoute`、`getBreadcrumbList`
- **数据处理**: `convertParams`、`deepCopy`、`stringify`
- **时间工具**: `formatDateTime`
- **其他工具**: `isType`、`pollingHttp`

---

## 代码质量规范

### ESLint 规则
- **未使用变量**: 关闭检查（`@typescript-eslint/no-unused-vars: 'off'`）
- **any 类型**: 允许使用（`@typescript-eslint/no-explicit-any: 'off'`）
- **React Hooks**: 关闭严格检查（`react-hooks/rules-of-hooks: 'off'`）
- **Prettier 集成**: 使用 `prettier/prettier` 规则

### 代码提交规范
- **Git Hooks**: 使用 Husky + lint-staged 在提交前自动格式化
- **Lint 检查**: 提交前自动运行 ESLint 和 Prettier
- **类型检查**: 使用 `npm run type-check` 进行类型检查

### 性能优化
- **代码分割**: 使用路由懒加载和动态导入
- **打包优化**: 配置 Vite 的 `manualChunks` 进行代码分割
- **资源优化**: 使用 `vite-plugin-compression` 进行资源压缩

---

## 最佳实践与注意事项

### 组件开发
1. **单一职责**: 每个组件只负责一个功能
2. **组件复用**: 提取公共逻辑到自定义 Hooks 或工具函数
3. **性能优化**: 合理使用 `useMemo`、`useCallback` 优化性能
4. **错误边界**: 使用 ErrorBoundary 捕获组件错误

### 状态管理
1. **状态提升**: 将共享状态提升到最近的公共父组件或 Redux
2. **避免过度使用 Redux**: 局部状态使用 `useState`，全局状态使用 Redux
3. **状态持久化**: 使用 Redux Persist 持久化重要状态

### 类型安全
1. **类型定义**: 为所有函数参数和返回值定义类型
2. **接口优先**: 优先使用 `interface` 而非 `type`
3. **类型导入**: 纯类型使用 `import type` 导入

### 代码注释
1. **函数注释**: 所有公共函数使用 JSDoc 格式注释
2. **复杂逻辑**: 对复杂业务逻辑添加注释说明
3. **TODO 标记**: 使用 `// TODO:` 标记待完成功能

### 错误处理
1. **异步错误**: 使用 `try-catch` 处理异步操作错误
2. **用户提示**: 使用 `message` 组件提示用户操作结果
3. **错误日志**: 重要错误记录到控制台或错误监控系统

### 安全规范
1. **XSS 防护**: 避免直接渲染用户输入内容
2. **敏感信息**: 不在代码中硬编码敏感信息（API Key、Token 等）
3. **权限控制**: 使用路由守卫和按钮权限控制功能访问

---

## 开发工作流

### 开发流程
1. **创建分支**: 从 `main` 分支创建功能分支
2. **编写代码**: 遵循本规范编写代码
3. **代码检查**: 运行 `npm run lint` 检查代码规范
4. **类型检查**: 运行 `npm run type-check` 检查类型错误
5. **提交代码**: 提交前自动运行 lint-staged 格式化代码

### 常用命令
```bash
# 开发
npm run dev

# 构建
npm run build
npm run build:dev
npm run build:prod

# 代码检查
npm run lint
npm run lint:check
npm run lint:prettier

# 类型检查
npm run type-check
```

---

## 总结

本规范文档基于项目实际代码风格和最新最佳实践制定，旨在确保代码质量和团队协作效率。所有开发人员应严格遵循本规范，如有疑问或建议，请及时反馈。

**最后更新**: 2025年1月
**维护者**: SunnyRun

