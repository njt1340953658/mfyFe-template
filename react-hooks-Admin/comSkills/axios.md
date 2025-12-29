# Axios 封装使用指南

## 基础配置

### 1. Axios 实例创建
```typescript
// utils/service/index.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import NProgress from 'nprogress'
import { store } from '@/redux'
import { setToken } from '@/redux/modules/auth'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})

export default service
```

### 2. 请求拦截器
```typescript
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 开始 loading
    NProgress.start()
    
    // 添加 token
    const state = store.getState()
    const token = state.auth.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 添加请求 ID
    config.headers['X-Request-Id'] = generateRequestId()
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      }
    }
    
    return config
  },
  (error) => {
    NProgress.done()
    message.error('请求失败')
    return Promise.reject(error)
  }
)
```

### 3. 响应拦截器
```typescript
// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done()
    
    const { code, message: msg, data } = response.data
    
    // 成功响应
    if (code === 0) {
      return data
    }
    
    // 业务错误处理
    switch (code) {
      case 401:
        // 未授权，清除 token 并跳转登录
        store.dispatch(setToken(''))
        message.error('登录已过期，请重新登录')
        window.location.href = '/login'
        break
      case 403:
        message.error('无权限访问')
        break
      case 404:
        message.error('请求的资源不存在')
        break
      case 40001:
        message.error(msg || '参数错误')
        break
      case 40901:
        message.error(msg || '数据冲突')
        break
      case 50000:
        message.error(msg || '服务器错误')
        break
      default:
        message.error(msg || '请求失败')
    }
    
    return Promise.reject(new Error(msg || '请求失败'))
  },
  (error) => {
    NProgress.done()
    
    // 网络错误处理
    if (error.code === 'ECONNABORTED') {
      message.error('请求超时，请稍后重试')
    } else if (error.message === 'Network Error') {
      message.error('网络连接失败，请检查网络')
    } else if (error.response) {
      // 服务器响应错误
      const { status } = error.response
      switch (status) {
        case 400:
          message.error('请求参数错误')
          break
        case 401:
          message.error('未授权，请登录')
          break
        case 403:
          message.error('拒绝访问')
          break
        case 404:
          message.error('请求地址不存在')
          break
        case 500:
          message.error('服务器内部错误')
          break
        case 502:
          message.error('网关错误')
          break
        case 503:
          message.error('服务不可用')
          break
        default:
          message.error(`请求失败: ${status}`)
      }
    } else {
      message.error('请求失败')
    }
    
    return Promise.reject(error)
  }
)
```

## 请求封装

### 1. 统一响应类型
```typescript
// types/api.d.ts
declare namespace API {
  // 统一响应结构
  interface Response<T = any> {
    code: number
    message: string
    data: T
  }
  
  // 分页请求参数
  interface PageParams {
    page?: number
    pageSize?: number
  }
  
  // 分页响应数据
  interface PageData<T> {
    list: T[]
    total: number
    page: number
    pageSize: number
  }
}
```

### 2. 请求方法封装
```typescript
// utils/service/request.ts
import service from './index'
import type { AxiosRequestConfig } from 'axios'

// GET 请求
export const get = <T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.get(url, { params, ...config })
}

// POST 请求
export const post = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.post(url, data, config)
}

// PUT 请求
export const put = <T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.put(url, data, config)
}

// DELETE 请求
export const del = <T = any>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  return service.delete(url, { params, ...config })
}

// 文件上传
export const upload = <T = any>(
  url: string,
  file: File,
  config?: AxiosRequestConfig
): Promise<T> => {
  const formData = new FormData()
  formData.append('file', file)
  return service.post(url, formData, {
    ...config,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 文件下载
export const download = (
  url: string,
  params?: any,
  filename?: string
): Promise<void> => {
  return service.get(url, {
    params,
    responseType: 'blob'
  }).then((blob: Blob) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || 'download'
    link.click()
    window.URL.revokeObjectURL(url)
  })
}
```

## API 模块化

### 1. API 接口定义
```typescript
// api/user.ts
import { get, post, put, del } from '@/utils/service/request'

// 用户信息类型
export interface UserInfo {
  id: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  status: 0 | 1
  createdAt: string
  updatedAt: string
}

// 用户列表参数
export interface UserListParams extends API.PageParams {
  keyword?: string
  status?: 0 | 1
  createdFrom?: string
  createdTo?: string
  sortBy?: 'created_at' | 'username'
  order?: 'asc' | 'desc'
}

// 创建用户参数
export interface CreateUserParams {
  username: string
  password: string
  passwordConfirm: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  status: 0 | 1
}

// 更新用户参数
export interface UpdateUserParams {
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  status?: 0 | 1
  password?: string
  passwordConfirm?: string
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return get<API.PageData<UserInfo>>('/api/v1/users', params)
}

// 获取用户详情
export const getUserDetail = (id: number) => {
  return get<UserInfo>(`/api/v1/users/${id}`)
}

// 创建用户
export const createUser = (data: CreateUserParams) => {
  return post<{ id: number }>('/api/v1/users', data)
}

// 更新用户
export const updateUser = (id: number, data: UpdateUserParams) => {
  return put(`/api/v1/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id: number) => {
  return del(`/api/v1/users/${id}`)
}
```

### 2. 登录 API
```typescript
// api/login.ts
import { post } from '@/utils/service/request'

// 登录参数
export interface LoginParams {
  username: string
  password: string
  captcha?: string
}

// 登录响应
export interface LoginResponse {
  token: string
  userInfo: {
    id: number
    username: string
    nickname: string
    avatar: string
  }
  permissions: string[]
}

// 登录
export const login = (data: LoginParams) => {
  return post<LoginResponse>('/api/v1/auth/login', data)
}

// 登出
export const logout = () => {
  return post('/api/v1/auth/logout')
}

// 获取用户信息
export const getUserInfo = () => {
  return post<LoginResponse>('/api/v1/auth/userinfo')
}
```

## 高级功能

### 1. 请求取消
```typescript
// utils/service/helper/axiosCancel.ts
import axios, { AxiosRequestConfig, Canceler } from 'axios'

// 存储请求取消函数
const pendingMap = new Map<string, Canceler>()

// 生成请求 key
const getPendingKey = (config: AxiosRequestConfig) => {
  const { url, method, params, data } = config
  return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

// 添加请求
export const addPending = (config: AxiosRequestConfig) => {
  const key = getPendingKey(config)
  
  // 如果已存在，先取消之前的请求
  removePending(config)
  
  config.cancelToken = new axios.CancelToken((cancel) => {
    if (!pendingMap.has(key)) {
      pendingMap.set(key, cancel)
    }
  })
}

// 移除请求
export const removePending = (config: AxiosRequestConfig) => {
  const key = getPendingKey(config)
  
  if (pendingMap.has(key)) {
    const cancel = pendingMap.get(key)
    cancel?.(key)
    pendingMap.delete(key)
  }
}

// 清空所有请求
export const clearPending = () => {
  pendingMap.forEach((cancel) => {
    cancel('Route changed')
  })
  pendingMap.clear()
}

// 在请求拦截器中使用
service.interceptors.request.use((config) => {
  addPending(config)
  return config
})

// 在响应拦截器中使用
service.interceptors.response.use(
  (response) => {
    removePending(response.config)
    return response
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message)
    }
    return Promise.reject(error)
  }
)
```

### 2. 请求重试
```typescript
// utils/service/helper/retry.ts
import axios, { AxiosError } from 'axios'

export interface RetryConfig {
  retries: number  // 重试次数
  retryDelay: number  // 重试延迟（毫秒）
  retryCondition?: (error: AxiosError) => boolean  // 重试条件
}

export const retryRequest = (error: AxiosError, config: RetryConfig) => {
  const { retries, retryDelay, retryCondition } = config
  
  // 判断是否需要重试
  if (retryCondition && !retryCondition(error)) {
    return Promise.reject(error)
  }
  
  // 获取当前重试次数
  const currentRetry = (error.config as any).__retryCount || 0
  
  // 超过重试次数
  if (currentRetry >= retries) {
    return Promise.reject(error)
  }
  
  // 增加重试计数
  (error.config as any).__retryCount = currentRetry + 1
  
  // 延迟重试
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(axios(error.config!))
    }, retryDelay)
  })
}

// 在响应拦截器中使用
service.interceptors.response.use(
  (response) => response,
  (error) => {
    // 网络错误或超时错误才重试
    const shouldRetry = (err: AxiosError) => {
      return err.code === 'ECONNABORTED' || err.message === 'Network Error'
    }
    
    return retryRequest(error, {
      retries: 3,
      retryDelay: 1000,
      retryCondition: shouldRetry
    })
  }
)
```

### 3. 并发请求
```typescript
// 批量请求
export const batchRequest = <T = any>(
  requests: Promise<any>[]
): Promise<T[]> => {
  return Promise.all(requests)
}

// 使用示例
const fetchData = async () => {
  try {
    const [users, roles, permissions] = await batchRequest([
      getUserList({ page: 1, pageSize: 20 }),
      getRoleList(),
      getPermissionList()
    ])
    
    console.log(users, roles, permissions)
  } catch (error) {
    console.error(error)
  }
}
```

### 4. 请求缓存
```typescript
// utils/service/helper/cache.ts
const cacheMap = new Map<string, { data: any; expireTime: number }>()

// 生成缓存 key
const getCacheKey = (url: string, params?: any) => {
  return `${url}?${JSON.stringify(params || {})}`
}

// 获取缓存
export const getCache = (url: string, params?: any) => {
  const key = getCacheKey(url, params)
  const cache = cacheMap.get(key)
  
  if (cache && cache.expireTime > Date.now()) {
    return cache.data
  }
  
  cacheMap.delete(key)
  return null
}

// 设置缓存
export const setCache = (
  url: string,
  params: any,
  data: any,
  ttl = 60000 // 默认缓存 1 分钟
) => {
  const key = getCacheKey(url, params)
  cacheMap.set(key, {
    data,
    expireTime: Date.now() + ttl
  })
}

// 清除缓存
export const clearCache = (url?: string, params?: any) => {
  if (url) {
    const key = getCacheKey(url, params)
    cacheMap.delete(key)
  } else {
    cacheMap.clear()
  }
}

// 在请求拦截器中使用
service.interceptors.request.use((config) => {
  // 只缓存 GET 请求
  if (config.method === 'get' && config.cache) {
    const cache = getCache(config.url!, config.params)
    if (cache) {
      return Promise.reject({
        __CACHE__: true,
        data: cache
      })
    }
  }
  return config
})

// 在响应拦截器中使用
service.interceptors.response.use(
  (response) => {
    // 缓存 GET 请求的响应
    if (response.config.method === 'get' && response.config.cache) {
      setCache(
        response.config.url!,
        response.config.params,
        response.data,
        response.config.cacheTTL
      )
    }
    return response
  },
  (error) => {
    // 返回缓存数据
    if (error.__CACHE__) {
      return Promise.resolve({ data: error.data })
    }
    return Promise.reject(error)
  }
)
```

## 最佳实践

### 1. 环境配置
```typescript
// .env.development
VITE_API_URL=http://localhost:3000

// .env.production
VITE_API_URL=https://api.example.com
```

### 2. 类型安全
```typescript
// ✅ 推荐：为每个 API 定义类型
export const getUserList = (params: UserListParams) => {
  return get<API.PageData<UserInfo>>('/api/v1/users', params)
}

// ❌ 避免：使用 any 类型
export const getUserList = (params: any) => {
  return get<any>('/api/v1/users', params)
}
```

### 3. 错误处理
```typescript
// 在组件中使用 try-catch
const fetchData = async () => {
  try {
    const data = await getUserList({ page: 1, pageSize: 20 })
    setList(data.list)
  } catch (error: any) {
    // 错误已在拦截器中处理，这里可以做额外处理
    console.error('获取用户列表失败:', error.message)
  }
}
```

### 4. Loading 状态管理
```typescript
const [loading, setLoading] = useState(false)

const fetchData = async () => {
  setLoading(true)
  try {
    const data = await getUserList({ page: 1, pageSize: 20 })
    setList(data.list)
  } catch (error) {
    // 处理错误
  } finally {
    setLoading(false)
  }
}
```

## 常见问题

### 问题 1：跨域问题
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### 问题 2：请求超时
```typescript
// 全局超时
const service = axios.create({
  timeout: 10000
})

// 单个请求超时
get('/api/users', {}, { timeout: 5000 })
```

### 问题 3：取消重复请求
```typescript
// 使用请求取消功能
import { addPending, removePending } from '@/utils/service/helper/axiosCancel'

// 在路由切换时取消所有请求
useEffect(() => {
  return () => {
    clearPending()
  }
}, [location.pathname])
```

## 总结
1. ✅ 创建独立的 axios 实例
2. ✅ 使用请求/响应拦截器统一处理
3. ✅ 模块化组织 API 接口
4. ✅ 使用 TypeScript 增强类型安全
5. ✅ 实现请求取消、重试、缓存等高级功能
6. ✅ 合理处理错误和 Loading 状态
7. ✅ 配置开发环境代理解决跨域问题

