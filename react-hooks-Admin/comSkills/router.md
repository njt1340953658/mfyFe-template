# React Router 配置指南

## 项目路由架构

### 路由模式
项目支持两种路由模式，通过环境变量 `VITE_ROUTER_MODE` 控制：
- **Hash 模式**: 适用于不支持 History API 的环境
- **History 模式**: 适用于现代浏览器和服务器配置正确的环境

```typescript
// App.tsx
const isHashRouter = import.meta.env.VITE_ROUTER_MODE === 'hash'
const RouterComponent = isHashRouter ? HashRouter : BrowserRouter
```

## 路由配置

### 1. 基础路由结构
```typescript
// routers/index.tsx
import { Navigate, useRoutes } from 'react-router-dom'
import { RouteObject } from '@/routers/interface'
import Login from '@/views/login/index'
import { LayoutIndex } from '@/components/layouts/lazyLoad'

// 动态加载路由模块
const metaRouters = import.meta.glob('./router/*.tsx', { 
  import: 'default', 
  eager: true 
})

export const routerArray = Object.values(metaRouters).flat()

export const rootRouter: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" />
  },
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
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
]

const Router = () => {
  const routes = useRoutes(rootRouter as [])
  return routes
}

export default Router
```

### 2. 路由模块定义
```typescript
// routers/router/home.tsx
import { lazy } from 'react'
import { RouteObject } from '@/routers/interface'

const Home = lazy(() => import('@/views/home/index'))

const homeRouter: RouteObject[] = [
  {
    path: '/home',
    element: <Home />,
    meta: {
      title: '首页',
      key: 'home',
      requireAuth: true
    }
  }
]

export default homeRouter
```

### 3. 嵌套路由配置
```typescript
// routers/router/system.tsx
import { lazy } from 'react'
import { RouteObject } from '@/routers/interface'
import { LayoutIndex } from '@/components/layouts/lazyLoad'

const UserManage = lazy(() => import('@/views/system/user'))
const RoleManage = lazy(() => import('@/views/system/role'))

const systemRouter: RouteObject[] = [
  {
    path: '/system',
    element: <LayoutIndex />,
    meta: {
      title: '系统管理',
      key: 'system',
      icon: 'SettingOutlined'
    },
    children: [
      {
        path: '/system/user',
        element: <UserManage />,
        meta: {
          title: '用户管理',
          key: 'system:user',
          requireAuth: true,
          permission: 'system:user:view'
        }
      },
      {
        path: '/system/role',
        element: <RoleManage />,
        meta: {
          title: '角色管理',
          key: 'system:role',
          requireAuth: true,
          permission: 'system:role:view'
        }
      }
    ]
  }
]

export default systemRouter
```

## 路由懒加载

### 1. 懒加载组件
```typescript
// components/layouts/lazyLoad/index.tsx
import { lazy, Suspense } from 'react'
import Loading from '@/components/Loading'

export const lazyLoad = (importFn: () => Promise<any>) => {
  const Component = lazy(importFn)
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  )
}

// 使用示例
const Home = lazy(() => import('@/views/home'))
```

### 2. 布局懒加载
```typescript
// components/layouts/lazyLoad/lazyLoad.tsx
import { Suspense } from 'react'
import Loading from '@/components/Loading'

export const LayoutIndex = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Layout />
    </Suspense>
  )
}
```

## 路由鉴权

### 1. 鉴权组件
```typescript
// routers/authRouter.tsx
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'
import { rootRouter } from './index'

interface AuthRouterProps {
  children: React.ReactNode
}

const AuthRouter: React.FC<AuthRouterProps> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // 查找当前路由配置
    const route = findRouteByPath(rootRouter, location.pathname)
    
    // 需要登录但未登录
    if (route?.meta?.requireAuth && !token) {
      navigate('/login', { replace: true })
      return
    }
    
    // 已登录访问登录页，重定向到首页
    if (location.pathname === '/login' && token) {
      navigate('/home', { replace: true })
      return
    }
    
    // 权限校验
    if (route?.meta?.permission && !hasPermission(route.meta.permission)) {
      navigate('/403', { replace: true })
      return
    }
  }, [location.pathname, token, navigate])

  return <>{children}</>
}

// 递归查找路由
const findRouteByPath = (routes: RouteObject[], path: string): RouteObject | null => {
  for (const route of routes) {
    if (route.path === path) return route
    if (route.children) {
      const found = findRouteByPath(route.children, path)
      if (found) return found
    }
  }
  return null
}

export default AuthRouter
```

### 2. 权限判断
```typescript
// utils/permission.ts
import { RootState, store } from '@/redux'

export const hasPermission = (permissionCode: string): boolean => {
  const state = store.getState() as RootState
  const { permissions } = state.auth
  return permissions.includes(permissionCode)
}

// 在组件中使用
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'

const MyComponent = () => {
  const { permissions } = useSelector((state: RootState) => state.auth)
  const canEdit = permissions.includes('system:user:edit')
  
  return (
    <div>
      {canEdit && <Button>编辑</Button>}
    </div>
  )
}
```

## 路由跳转

### 1. 声明式导航
```typescript
import { Link, NavLink } from 'react-router-dom'

// Link 组件
<Link to="/home">首页</Link>
<Link to="/user/123">用户详情</Link>

// NavLink 组件（带激活状态）
<NavLink
  to="/home"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  首页
</NavLink>
```

### 2. 编程式导航
```typescript
import { useNavigate } from 'react-router-dom'

const MyComponent = () => {
  const navigate = useNavigate()
  
  const handleGoHome = () => {
    // 跳转到首页
    navigate('/home')
  }
  
  const handleGoBack = () => {
    // 返回上一页
    navigate(-1)
  }
  
  const handleGoForward = () => {
    // 前进一页
    navigate(1)
  }
  
  const handleReplace = () => {
    // 替换当前历史记录
    navigate('/home', { replace: true })
  }
  
  const handleWithState = () => {
    // 携带状态跳转
    navigate('/user/123', { state: { from: 'list' } })
  }
  
  return (
    <div>
      <Button onClick={handleGoHome}>首页</Button>
      <Button onClick={handleGoBack}>返回</Button>
    </div>
  )
}
```

### 3. 获取路由参数
```typescript
import { useParams, useSearchParams, useLocation } from 'react-router-dom'

const MyComponent = () => {
  // 路径参数：/user/:id
  const { id } = useParams<{ id: string }>()
  
  // 查询参数：/user?name=张三&age=20
  const [searchParams, setSearchParams] = useSearchParams()
  const name = searchParams.get('name')
  const age = searchParams.get('age')
  
  // 更新查询参数
  const handleUpdateParams = () => {
    setSearchParams({ name: '李四', age: '25' })
  }
  
  // 获取 location 对象
  const location = useLocation()
  console.log(location.pathname) // 当前路径
  console.log(location.search)   // 查询字符串
  console.log(location.state)    // 导航时传递的状态
  
  return <div>用户ID: {id}</div>
}
```

## 路由元信息

### 1. 定义路由接口
```typescript
// routers/interface/index.ts
import { ReactNode } from 'react'

export interface MetaProps {
  title: string
  key: string
  icon?: string
  requireAuth?: boolean
  permission?: string
  keepAlive?: boolean
  hidden?: boolean
}

export interface RouteObject {
  path?: string
  element?: ReactNode
  children?: RouteObject[]
  meta?: MetaProps
}
```

### 2. 使用元信息
```typescript
// 在鉴权中使用
if (route?.meta?.requireAuth && !token) {
  navigate('/login')
}

// 在面包屑中使用
const breadcrumbItems = routes.map(route => ({
  title: route.meta?.title,
  path: route.path
}))

// 在菜单中使用
const menuItems = routes
  .filter(route => !route.meta?.hidden)
  .map(route => ({
    key: route.meta?.key,
    label: route.meta?.title,
    icon: route.meta?.icon
  }))
```

## 动态路由

### 1. 根据权限生成路由
```typescript
// utils/generateRoutes.ts
import { RouteObject } from '@/routers/interface'

export const generateRoutes = (
  routes: RouteObject[],
  permissions: string[]
): RouteObject[] => {
  return routes
    .filter(route => {
      // 没有权限要求或用户有该权限
      if (!route.meta?.permission) return true
      return permissions.includes(route.meta.permission)
    })
    .map(route => ({
      ...route,
      children: route.children 
        ? generateRoutes(route.children, permissions)
        : undefined
    }))
}

// 使用
const userPermissions = ['system:user:view', 'system:role:view']
const allowedRoutes = generateRoutes(allRoutes, userPermissions)
```

## 路由监听

### 1. 监听路由变化
```typescript
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const MyComponent = () => {
  const location = useLocation()
  
  useEffect(() => {
    console.log('路由变化:', location.pathname)
    
    // 路由变化时的操作
    // 1. 更新页面标题
    document.title = getCurrentRouteTitle(location.pathname)
    
    // 2. 记录访问日志
    logPageView(location.pathname)
    
    // 3. 滚动到顶部
    window.scrollTo(0, 0)
    
  }, [location.pathname])
  
  return <div>...</div>
}
```

### 2. 路由离开守卫
```typescript
import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

const MyForm = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // 阻止路由跳转
  const blocker = useBlocker(hasUnsavedChanges)
  
  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmed = window.confirm('有未保存的更改，确定要离开吗？')
      if (confirmed) {
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker])
  
  return <div>...</div>
}
```

## 最佳实践

### 1. 路由组织
```
routers/
├── index.tsx              # 路由主入口
├── authRouter.tsx         # 鉴权组件
├── interface/
│   └── index.ts          # 路由类型定义
└── router/               # 路由模块
    ├── home.tsx          # 首页路由
    ├── system.tsx        # 系统管理路由
    └── error.tsx         # 错误页路由
```

### 2. 路由命名规范
- 路径使用小写字母和短横线：`/system/user-manage`
- 路由 key 使用冒号分隔：`system:user:view`
- 文件名使用小驼峰：`userManage.tsx`

### 3. 性能优化
```typescript
// ✅ 使用懒加载
const Home = lazy(() => import('@/views/home'))

// ✅ 路由配置使用 memo 缓存
const routes = useMemo(() => generateRoutes(allRoutes, permissions), [permissions])

// ✅ 预加载关键路由
const preloadRoute = () => {
  import('@/views/home')
}
```

### 4. SEO 优化
```typescript
// 在路由变化时更新页面标题和 meta
useEffect(() => {
  const route = findRouteByPath(routes, location.pathname)
  if (route?.meta?.title) {
    document.title = `${route.meta.title} - 后台管理系统`
  }
}, [location.pathname])
```

## 常见问题

### 问题 1：刷新 404
**原因**: History 模式下，服务器没有配置正确的回退路由。

**解决方案**:
```nginx
# Nginx 配置
location / {
  try_files $uri $uri/ /index.html;
}
```

### 问题 2：路由懒加载白屏
**原因**: 没有提供 Suspense 的 fallback。

**解决方案**:
```typescript
<Suspense fallback={<Loading />}>
  <Routes />
</Suspense>
```

### 问题 3：权限变化后路由未更新
**原因**: 路由没有响应权限变化。

**解决方案**:
```typescript
// 监听权限变化，重新生成路由
const routes = useMemo(
  () => generateRoutes(allRoutes, permissions),
  [permissions]
)
```

## 总结
1. ✅ 使用路由懒加载优化性能
2. ✅ 实现路由鉴权和权限控制
3. ✅ 合理组织路由模块
4. ✅ 使用元信息增强路由功能
5. ✅ 监听路由变化执行相关逻辑
6. ✅ 处理好 History 模式的服务器配置

