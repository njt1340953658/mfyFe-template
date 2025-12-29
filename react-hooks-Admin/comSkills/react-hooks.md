# React Hooks 使用规范

## 基本概念
React Hooks 是 React 16.8 引入的新特性，允许在函数组件中使用状态和其他 React 特性。

## 常用 Hooks

### 1. useState - 状态管理

#### 基本用法
```typescript
import { useState } from 'react'

const [count, setCount] = useState<number>(0)
const [user, setUser] = useState<User | null>(null)
const [list, setList] = useState<Item[]>([])
```

#### 最佳实践
```typescript
// ✅ 推荐：使用函数式更新
setCount(prev => prev + 1)

// ❌ 避免：直接修改对象
const [user, setUser] = useState({ name: 'Alice' })
user.name = 'Bob' // 错误！
setUser(user) // 不会触发更新

// ✅ 推荐：创建新对象
setUser({ ...user, name: 'Bob' })
```

### 2. useEffect - 副作用处理

#### 基本用法
```typescript
// 组件挂载时执行一次
useEffect(() => {
  fetchData()
}, [])

// 依赖项变化时执行
useEffect(() => {
  fetchData(id)
}, [id])

// 清理副作用
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  return () => {
    clearInterval(timer)
  }
}, [])
```

#### 最佳实践
```typescript
// ✅ 推荐：正确声明依赖项
useEffect(() => {
  fetchData(params)
}, [params])

// ❌ 避免：遗漏依赖项
useEffect(() => {
  fetchData(params) // ESLint 会警告
}, [])

// ✅ 推荐：异步操作使用 async/await
useEffect(() => {
  const loadData = async () => {
    try {
      const data = await fetchData()
      setData(data)
    } catch (error) {
      console.error(error)
    }
  }
  loadData()
}, [])
```

### 3. useCallback - 函数缓存

#### 基本用法
```typescript
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])

const handleSubmit = useCallback((values: any) => {
  submitForm(values)
}, [submitForm])
```

#### 最佳实践
```typescript
// ✅ 推荐：缓存传递给子组件的回调函数
const handleDelete = useCallback((id: number) => {
  deleteItem(id)
}, [deleteItem])

// 传递给子组件
<ChildComponent onDelete={handleDelete} />

// ✅ 推荐：正确声明依赖项
const handleUpdate = useCallback((id: number, data: any) => {
  updateItem(id, data, config)
}, [config])
```

### 4. useMemo - 值缓存

#### 基本用法
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

const filteredList = useMemo(() => {
  return list.filter(item => item.active)
}, [list])
```

#### 最佳实践
```typescript
// ✅ 推荐：缓存复杂计算结果
const sortedList = useMemo(() => {
  return [...list].sort((a, b) => a.name.localeCompare(b.name))
}, [list])

// ✅ 推荐：缓存组件配置
const columns = useMemo<ColumnsType<Item>>(() => [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => handleEdit(record)}>编辑</Button>
    )
  }
], [handleEdit])
```

### 5. useRef - 引用管理

#### 基本用法
```typescript
const inputRef = useRef<HTMLInputElement>(null)
const countRef = useRef<number>(0)

// 访问 DOM 元素
useEffect(() => {
  inputRef.current?.focus()
}, [])

// 存储不触发渲染的值
countRef.current = count
```

#### 最佳实践
```typescript
// ✅ 推荐：访问 DOM 元素
const inputRef = useRef<HTMLInputElement>(null)
<Input ref={inputRef} />

// ✅ 推荐：存储定时器 ID
const timerRef = useRef<NodeJS.Timeout>()

useEffect(() => {
  timerRef.current = setInterval(() => {
    console.log('tick')
  }, 1000)
  
  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }
}, [])
```

## 自定义 Hooks

### 创建自定义 Hook
```typescript
// hooks/useRequest.ts
import { useState, useCallback } from 'react'

interface UseRequestOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useRequest<T>(
  requestFn: (...args: any[]) => Promise<T>,
  options?: UseRequestOptions<T>
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)

  const run = useCallback(async (...args: any[]) => {
    setLoading(true)
    setError(null)
    try {
      const result = await requestFn(...args)
      setData(result)
      options?.onSuccess?.(result)
      return result
    } catch (err) {
      const error = err as Error
      setError(error)
      options?.onError?.(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [requestFn, options])

  return { loading, error, data, run }
}

// 使用示例
const { loading, data, run } = useRequest(getUserList, {
  onSuccess: (data) => {
    message.success('加载成功')
  },
  onError: (error) => {
    message.error(error.message)
  }
})

useEffect(() => {
  run({ page: 1, pageSize: 20 })
}, [run])
```

### 常用自定义 Hooks 示例

#### useToggle - 布尔值切换
```typescript
import { useState, useCallback } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => {
    setValue(v => !v)
  }, [])
  
  const setTrue = useCallback(() => {
    setValue(true)
  }, [])
  
  const setFalse = useCallback(() => {
    setValue(false)
  }, [])
  
  return { value, toggle, setTrue, setFalse }
}

// 使用
const { value: visible, setTrue: open, setFalse: close } = useToggle()
```

#### useDebounce - 防抖
```typescript
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

// 使用
const [keyword, setKeyword] = useState('')
const debouncedKeyword = useDebounce(keyword, 500)

useEffect(() => {
  if (debouncedKeyword) {
    search(debouncedKeyword)
  }
}, [debouncedKeyword])
```

#### useLocalStorage - 本地存储
```typescript
import { useState, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}

// 使用
const [theme, setTheme] = useLocalStorage('theme', 'light')
```

## Hooks 使用规则

### 规则 1：只在顶层调用 Hooks
```typescript
// ❌ 错误：在条件语句中调用
if (condition) {
  const [state, setState] = useState(0)
}

// ✅ 正确：在顶层调用
const [state, setState] = useState(0)
if (condition) {
  // 使用 state
}
```

### 规则 2：只在 React 函数中调用 Hooks
```typescript
// ❌ 错误：在普通函数中调用
function notAComponent() {
  const [state, setState] = useState(0)
}

// ✅ 正确：在组件或自定义 Hook 中调用
function MyComponent() {
  const [state, setState] = useState(0)
  return <div>{state}</div>
}

function useMyHook() {
  const [state, setState] = useState(0)
  return state
}
```

## 性能优化技巧

### 1. 避免不必要的渲染
```typescript
// 使用 React.memo 包裹组件
const MemoizedComponent = React.memo(MyComponent)

// 使用 useCallback 缓存回调
const handleClick = useCallback(() => {
  doSomething()
}, [])

// 使用 useMemo 缓存计算结果
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

### 2. 合理拆分状态
```typescript
// ❌ 避免：将所有状态放在一个对象中
const [state, setState] = useState({
  name: '',
  age: 0,
  address: ''
})

// ✅ 推荐：拆分独立的状态
const [name, setName] = useState('')
const [age, setAge] = useState(0)
const [address, setAddress] = useState('')
```

### 3. 使用 useTransition 处理非紧急更新
```typescript
import { useState, useTransition } from 'react'

const [isPending, startTransition] = useTransition()
const [filter, setFilter] = useState('')

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  // 紧急更新：输入框立即响应
  const value = e.target.value
  
  // 非紧急更新：筛选结果可以延迟
  startTransition(() => {
    setFilter(value)
  })
}
```

## 常见问题

### 问题 1：useEffect 无限循环
```typescript
// ❌ 错误：依赖项是对象，每次都创建新对象
useEffect(() => {
  fetchData(params)
}, [params]) // params 是对象

// ✅ 解决方案 1：使用 useMemo 缓存对象
const params = useMemo(() => ({
  page: 1,
  pageSize: 20
}), [])

// ✅ 解决方案 2：只依赖具体属性
useEffect(() => {
  fetchData({ page, pageSize })
}, [page, pageSize])
```

### 问题 2：获取不到最新的 state
```typescript
// ❌ 错误：闭包问题
const [count, setCount] = useState(0)

useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1) // count 始终是 0
  }, 1000)
  return () => clearInterval(timer)
}, [])

// ✅ 解决方案 1：使用函数式更新
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1)
  }, 1000)
  return () => clearInterval(timer)
}, [])

// ✅ 解决方案 2：使用 useRef
const countRef = useRef(count)
countRef.current = count

useEffect(() => {
  const timer = setInterval(() => {
    setCount(countRef.current + 1)
  }, 1000)
  return () => clearInterval(timer)
}, [])
```

## 最佳实践总结
1. ✅ 合理拆分状态，避免大对象
2. ✅ 使用 useCallback 缓存传递给子组件的回调
3. ✅ 使用 useMemo 缓存复杂计算和组件配置
4. ✅ 正确声明 useEffect 的依赖项
5. ✅ 抽取自定义 Hook 复用逻辑
6. ✅ 使用 TypeScript 增强类型安全
7. ✅ 遵循 Hooks 调用规则
8. ✅ 注意闭包陷阱，使用函数式更新

