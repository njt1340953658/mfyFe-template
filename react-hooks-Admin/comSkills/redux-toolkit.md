# Redux Toolkit 使用指南

## 基本概念
Redux Toolkit 是 Redux 官方推荐的工具集，简化了 Redux 的使用，提供了最佳实践的默认配置。

## Store 配置

### 1. 创建 Store
```typescript
// redux/index.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './modules/auth'
import globalReducer from './modules/global'
import menuReducer from './modules/menu'
import breadcrumbReducer from './modules/breadcrumb'

// 合并 reducer
const rootReducer = combineReducers({
  auth: authReducer,
  global: globalReducer,
  menu: menuReducer,
  breadcrumb: breadcrumbReducer
})

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'global'] // 只持久化这些 reducer
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// 创建 store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
      }
    })
})

export const persistor = persistStore(store)

// 导出类型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 2. 在应用中使用
```typescript
// main.tsx
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/redux'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
```

## 创建 Slice

### 1. 基础 Slice
```typescript
// redux/modules/auth.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar: string
  } | null
  permissions: string[]
}

const initialState: AuthState = {
  token: '',
  userInfo: null,
  permissions: []
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 设置 token
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    
    // 设置用户信息
    setUserInfo: (state, action: PayloadAction<AuthState['userInfo']>) => {
      state.userInfo = action.payload
    },
    
    // 设置权限
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload
    },
    
    // 登出
    logout: (state) => {
      state.token = ''
      state.userInfo = null
      state.permissions = []
    }
  }
})

export const { setToken, setUserInfo, setPermissions, logout } = authSlice.actions
export default authSlice.reducer
```

### 2. 在组件中使用
```typescript
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux'
import { setToken, logout } from '@/redux/modules/auth'

const MyComponent = () => {
  // 读取状态
  const { token, userInfo } = useSelector((state: RootState) => state.auth)
  
  // 获取 dispatch
  const dispatch = useDispatch()
  
  // 更新状态
  const handleLogin = () => {
    dispatch(setToken('your-token'))
  }
  
  const handleLogout = () => {
    dispatch(logout())
  }
  
  return (
    <div>
      <div>用户名: {userInfo?.username}</div>
      <Button onClick={handleLogout}>登出</Button>
    </div>
  )
}
```

## 异步 Actions (Thunk)

### 1. 创建异步 Action
```typescript
// redux/modules/auth.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi, getUserInfo as getUserInfoApi } from '@/api/login'

// 异步 thunk：登录
export const login = createAsyncThunk(
  'auth/login',
  async (params: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginApi(params)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

// 异步 thunk：获取用户信息
export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserInfoApi()
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ... 同步 actions
  },
  extraReducers: (builder) => {
    // 登录
    builder
      .addCase(login.pending, (state) => {
        // 处理 loading 状态
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        // 处理错误
        console.error(action.payload)
      })
    
    // 获取用户信息
    builder
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.userInfo = action.payload.userInfo
        state.permissions = action.payload.permissions
      })
  }
})
```

### 2. 在组件中使用异步 Action
```typescript
import { useDispatch } from 'react-redux'
import { login, getUserInfo } from '@/redux/modules/auth'
import { AppDispatch } from '@/redux'

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      // 登录
      const result = await dispatch(login(values)).unwrap()
      message.success('登录成功')
      
      // 获取用户信息
      await dispatch(getUserInfo()).unwrap()
      
      // 跳转到首页
      navigate('/home')
    } catch (error: any) {
      message.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return <Form onFinish={handleSubmit}>...</Form>
}
```

## 自定义 Hooks

### 1. 类型安全的 Hooks
```typescript
// redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './index'

// 使用类型化的 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

### 2. 在组件中使用
```typescript
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { setToken } from '@/redux/modules/auth'

const MyComponent = () => {
  // 自动类型推导
  const token = useAppSelector((state) => state.auth.token)
  const dispatch = useAppDispatch()
  
  const handleClick = () => {
    dispatch(setToken('new-token'))
  }
  
  return <div>{token}</div>
}
```

## 模块示例

### 1. Global 全局配置模块
```typescript
// redux/modules/global.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GlobalState {
  theme: 'light' | 'dark'
  assemblySize: 'small' | 'middle' | 'large'
  language: 'zh-CN' | 'en-US'
  collapsed: boolean
}

const initialState: GlobalState = {
  theme: 'light',
  assemblySize: 'middle',
  language: 'zh-CN',
  collapsed: false
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<GlobalState['theme']>) => {
      state.theme = action.payload
    },
    setAssemblySize: (state, action: PayloadAction<GlobalState['assemblySize']>) => {
      state.assemblySize = action.payload
    },
    setLanguage: (state, action: PayloadAction<GlobalState['language']>) => {
      state.language = action.payload
    },
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed
    },
    setCollapsed: (state, action: PayloadAction<boolean>) => {
      state.collapsed = action.payload
    }
  }
})

export const {
  setTheme,
  setAssemblySize,
  setLanguage,
  toggleCollapsed,
  setCollapsed
} = globalSlice.actions

export default globalSlice.reducer
```

### 2. Menu 菜单模块
```typescript
// redux/modules/menu.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface MenuItem {
  key: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
}

interface MenuState {
  menuList: MenuItem[]
  selectedKeys: string[]
  openKeys: string[]
}

const initialState: MenuState = {
  menuList: [],
  selectedKeys: [],
  openKeys: []
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuList: (state, action: PayloadAction<MenuItem[]>) => {
      state.menuList = action.payload
    },
    setSelectedKeys: (state, action: PayloadAction<string[]>) => {
      state.selectedKeys = action.payload
    },
    setOpenKeys: (state, action: PayloadAction<string[]>) => {
      state.openKeys = action.payload
    }
  }
})

export const { setMenuList, setSelectedKeys, setOpenKeys } = menuSlice.actions
export default menuSlice.reducer
```

### 3. Breadcrumb 面包屑模块
```typescript
// redux/modules/breadcrumb.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface BreadcrumbItem {
  title: string
  path?: string
}

interface BreadcrumbState {
  breadcrumbList: BreadcrumbItem[]
}

const initialState: BreadcrumbState = {
  breadcrumbList: []
}

const breadcrumbSlice = createSlice({
  name: 'breadcrumb',
  initialState,
  reducers: {
    setBreadcrumbList: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbList = action.payload
    }
  }
})

export const { setBreadcrumbList } = breadcrumbSlice.actions
export default breadcrumbSlice.reducer
```

## Redux Persist 配置

### 1. 基础持久化
```typescript
import storage from 'redux-persist/lib/storage' // localStorage
import sessionStorage from 'redux-persist/lib/storage/session' // sessionStorage

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'global'], // 只持久化这些
  blacklist: ['menu'] // 不持久化这些
}
```

### 2. 嵌套持久化
```typescript
import { persistReducer } from 'redux-persist'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'] // 只持久化 auth 中的 token
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  global: globalReducer
})
```

### 3. 清除持久化数据
```typescript
import { persistor } from '@/redux'

// 清除所有持久化数据
persistor.purge()

// 在登出时清除
const handleLogout = () => {
  dispatch(logout())
  persistor.purge()
}
```

## 性能优化

### 1. 使用 Reselect 创建 Memoized Selectors
```typescript
import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@/redux'

// 基础 selector
const selectAuth = (state: RootState) => state.auth
const selectMenuList = (state: RootState) => state.menu.menuList

// Memoized selector
export const selectUserPermissions = createSelector(
  [selectAuth],
  (auth) => auth.permissions
)

// 组合多个 selector
export const selectFilteredMenu = createSelector(
  [selectMenuList, selectUserPermissions],
  (menuList, permissions) => {
    return menuList.filter(menu => 
      !menu.permission || permissions.includes(menu.permission)
    )
  }
)
```

### 2. 拆分 Reducer
```typescript
// 避免单个大 reducer
// ❌ 不推荐
const appReducer = createSlice({
  name: 'app',
  initialState: {
    auth: {},
    user: {},
    menu: {},
    // ... 很多状态
  },
  reducers: {
    // ... 很多 actions
  }
})

// ✅ 推荐：拆分成多个 slice
// auth.ts
// user.ts
// menu.ts
```

### 3. 使用 Immer 的不可变更新
```typescript
// Redux Toolkit 内置了 Immer，可以直接修改 state
const userSlice = createSlice({
  name: 'user',
  initialState: { list: [] },
  reducers: {
    addUser: (state, action) => {
      // ✅ 可以直接 push，Immer 会处理不可变性
      state.list.push(action.payload)
    },
    updateUser: (state, action) => {
      // ✅ 可以直接修改
      const user = state.list.find(u => u.id === action.payload.id)
      if (user) {
        user.name = action.payload.name
      }
    }
  }
})
```

## 最佳实践

### 1. 状态设计原则
```typescript
// ✅ 推荐：扁平化状态结构
interface UserState {
  byId: Record<number, User>
  allIds: number[]
}

// ❌ 避免：深层嵌套
interface UserState {
  data: {
    users: {
      list: User[]
    }
  }
}
```

### 2. Action 命名规范
```typescript
// ✅ 推荐：动词 + 名词
setToken
updateUserInfo
fetchUserList
deleteUser

// ❌ 避免：不明确的命名
set
update
get
```

### 3. 错误处理
```typescript
const fetchData = createAsyncThunk(
  'data/fetch',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.getData(params)
      return response.data
    } catch (error: any) {
      // 返回自定义错误信息
      return rejectWithValue({
        message: error.message,
        code: error.code
      })
    }
  }
)

// 在 extraReducers 中处理
builder.addCase(fetchData.rejected, (state, action) => {
  state.error = action.payload
})
```

### 4. Loading 状态管理
```typescript
interface DataState {
  data: any[]
  loading: boolean
  error: string | null
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})
```

## 调试技巧

### 1. Redux DevTools
```typescript
// 已在 configureStore 中默认启用
const store = configureStore({
  reducer: rootReducer,
  // DevTools 自动集成
})
```

### 2. 日志中间件
```typescript
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'development'
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware()
})
```

## 常见问题

### 问题 1：状态未更新
```typescript
// ❌ 错误：直接返回新对象会覆盖整个 state
reducers: {
  setData: (state, action) => {
    return action.payload // 这会丢失其他状态
  }
}

// ✅ 正确：只更新需要的字段
reducers: {
  setData: (state, action) => {
    state.data = action.payload
  }
}
```

### 问题 2：异步 Action 类型错误
```typescript
// ✅ 使用 AppDispatch 类型
import { AppDispatch } from '@/redux'

const dispatch = useDispatch<AppDispatch>()

// 或使用自定义 hook
import { useAppDispatch } from '@/redux/hooks'
const dispatch = useAppDispatch()
```

## 总结
1. ✅ 使用 createSlice 简化 reducer 定义
2. ✅ 使用 createAsyncThunk 处理异步逻辑
3. ✅ 使用 Redux Persist 持久化状态
4. ✅ 使用 TypeScript 增强类型安全
5. ✅ 合理拆分 slice，避免单个大 reducer
6. ✅ 使用 Reselect 优化性能
7. ✅ 遵循不可变更新原则（Immer 自动处理）

