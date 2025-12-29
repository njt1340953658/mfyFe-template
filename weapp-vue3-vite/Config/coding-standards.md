# 编码规范

## 一、代码风格

### 1.1 缩进和空格
- 使用 2 个空格缩进，不使用 Tab
- 文件末尾保留一个空行
- 行尾不留空格

### 1.2 行宽
- 单行代码长度建议不超过 100 个字符
- 超过长度应适当换行

### 1.3 引号
- 字符串统一使用单引号 `'`
- JSX 属性使用双引号 `"`
- 模板字符串使用反引号 `` ` ``

```typescript
// ✅ 正确
const name = 'Alice'
const element = <div className="container">Hello</div>
const greeting = `Hello, ${name}!`

// ❌ 错误
const name = "Alice"
const element = <div className='container'>Hello</div>
```

### 1.4 分号
- 语句结尾必须添加分号

```typescript
// ✅ 正确
const name = 'Alice';
console.log(name);

// ❌ 错误
const name = 'Alice'
console.log(name)
```

## 二、命名规范

### 2.1 文件命名
- **组件文件**: 大驼峰命名 `UserList.tsx`
- **工具文件**: 小驼峰命名 `utilTool.ts`
- **样式文件**: 小驼峰命名 `index.less`
- **类型文件**: 小驼峰命名 `user.d.ts`

### 2.2 变量命名
- **普通变量**: 小驼峰命名 `userName`, `userList`
- **常量**: 全大写下划线分隔 `MAX_COUNT`, `API_URL`
- **布尔值**: 使用 `is`, `has`, `can` 等前缀 `isLoading`, `hasPermission`, `canEdit`

```typescript
// ✅ 正确
const userName = 'Alice'
const MAX_COUNT = 100
const isLoading = false
const hasPermission = true

// ❌ 错误
const UserName = 'Alice'
const maxCount = 100
const loading = false
```

### 2.3 函数命名
- 使用小驼峰命名
- 使用动词或动词短语
- 事件处理函数使用 `handle` 前缀

```typescript
// ✅ 正确
function getUserInfo() {}
function fetchData() {}
function handleClick() {}
function handleSubmit() {}

// ❌ 错误
function user_info() {}
function data() {}
function clickHandler() {}
```

### 2.4 组件命名
- 使用大驼峰命名（PascalCase）
- 名称应具有描述性

```typescript
// ✅ 正确
const UserList = () => {}
const UserForm = () => {}
const LoginPage = () => {}

// ❌ 错误
const userlist = () => {}
const Form1 = () => {}
const page = () => {}
```

### 2.5 接口/类型命名
- 接口使用大驼峰命名，可选 `I` 前缀
- 类型别名使用大驼峰命名

```typescript
// ✅ 正确
interface UserInfo {}
interface IUser {}
type UserList = User[]

// ❌ 错误
interface user_info {}
interface iUser {}
type userList = User[]
```

## 三、TypeScript 规范

### 3.1 类型定义
- 明确定义函数参数和返回值类型
- 避免使用 `any`，使用 `unknown` 替代
- 使用接口定义对象类型

```typescript
// ✅ 正确
interface User {
  id: number
  name: string
}

function getUser(id: number): Promise<User> {
  return api.getUser(id)
}

// ❌ 错误
function getUser(id: any): any {
  return api.getUser(id)
}
```

### 3.2 可选属性
- 使用 `?` 标记可选属性
- 使用 `Partial` 工具类型

```typescript
// ✅ 正确
interface User {
  id: number
  name: string
  email?: string
  phone?: string
}

type PartialUser = Partial<User>

// ❌ 错误
interface User {
  id: number
  name: string
  email: string | undefined
}
```

### 3.3 枚举
- 使用枚举定义一组相关常量
- 优先使用字符串枚举

```typescript
// ✅ 正确
enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending'
}

// 或使用常量对象
const UserStatus = {
  Active: 'active',
  Inactive: 'inactive',
  Pending: 'pending'
} as const
```

## 四、React 规范

### 4.1 组件定义
- 使用函数组件和 Hooks
- Props 使用接口定义
- 组件导出使用 `export default`

```typescript
// ✅ 正确
interface UserListProps {
  data: User[]
  loading?: boolean
  onEdit: (user: User) => void
}

const UserList: React.FC<UserListProps> = ({ data, loading, onEdit }) => {
  // ...
  return <div>...</div>
}

export default UserList
```

### 4.2 Hooks 使用
- Hooks 必须在顶层调用
- 自定义 Hook 以 `use` 开头
- 正确声明 useEffect 依赖项

```typescript
// ✅ 正确
function useUserList() {
  const [list, setList] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchUserList()
  }, [])
  
  return { list, loading }
}

// ❌ 错误
function getUserList() {
  const [list, setList] = useState([]) // 不在组件/Hook中调用
}
```

### 4.3 事件处理
- 事件处理函数使用 `handle` 前缀
- 使用箭头函数或 useCallback

```typescript
// ✅ 正确
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // ...
}

return <Button onClick={handleClick}>Click</Button>

// ❌ 错误
return <Button onClick={() => console.log('clicked')}>Click</Button>
```

### 4.4 条件渲染
- 使用三元运算符或 && 运算符
- 复杂条件抽取为变量或函数

```typescript
// ✅ 正确
return (
  <div>
    {loading ? <Spin /> : <List data={data} />}
    {hasPermission && <Button>编辑</Button>}
  </div>
)

// 复杂条件
const canEdit = hasPermission('edit') && isOwner
return canEdit && <Button>编辑</Button>
```

## 五、注释规范

### 5.1 文件注释
```typescript
/**
 * 用户管理页面
 * @author SunnyRun
 * @date 2024-01-01
 */
```

### 5.2 函数注释
```typescript
/**
 * 获取用户列表
 * @param params - 查询参数
 * @returns 用户列表数据
 */
async function getUserList(params: UserListParams): Promise<UserListResponse> {
  // ...
}
```

### 5.3 复杂逻辑注释
```typescript
// 计算分页序号：(当前页 - 1) * 每页条数 + 索引 + 1
const index = (current - 1) * pageSize + i + 1
```

### 5.4 TODO 注释
```typescript
// TODO: 优化性能
// FIXME: 修复边界情况
// HACK: 临时方案，待优化
```

## 六、代码组织

### 6.1 导入顺序
```typescript
// 1. React 相关
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// 2. 第三方库
import { Button, Table } from 'antd'
import dayjs from 'dayjs'

// 3. 项目内部
import { getUserList } from '@/api/user'
import { usePermission } from '@/hooks/usePermission'
import type { User } from '@/types/user'

// 4. 样式
import './index.less'
```

### 6.2 组件结构
```typescript
const MyComponent: React.FC<Props> = () => {
  // 1. Hooks
  const navigate = useNavigate()
  const [state, setState] = useState()
  
  // 2. 副作用
  useEffect(() => {
    // ...
  }, [])
  
  // 3. 事件处理函数
  const handleClick = () => {
    // ...
  }
  
  // 4. 渲染函数
  const renderItem = (item: Item) => {
    return <div>{item.name}</div>
  }
  
  // 5. 条件判断
  if (loading) return <Spin />
  
  // 6. 返回 JSX
  return (
    <div>
      {/* ... */}
    </div>
  )
}
```

## 七、性能优化

### 7.1 避免不必要的渲染
```typescript
// ✅ 使用 React.memo
const MemoComponent = React.memo(MyComponent)

// ✅ 使用 useCallback
const handleClick = useCallback(() => {
  doSomething()
}, [])

// ✅ 使用 useMemo
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])
```

### 7.2 列表渲染
```typescript
// ✅ 正确：使用唯一 key
{list.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// ❌ 错误：使用 index 作为 key
{list.map((item, index) => (
  <div key={index}>{item.name}</div>
))}
```

## 八、错误处理

### 8.1 异步错误处理
```typescript
// ✅ 正确
const fetchData = async () => {
  try {
    const data = await api.getData()
    setData(data)
  } catch (error: any) {
    message.error(error.message)
    console.error('获取数据失败:', error)
  } finally {
    setLoading(false)
  }
}
```

### 8.2 边界情况处理
```typescript
// ✅ 正确：检查空值
if (!user || !user.name) {
  return null
}

// 使用可选链
const userName = user?.name ?? '未知用户'
```

## 九、代码检查

### 9.1 ESLint
- 提交前必须通过 ESLint 检查
- 不允许使用 `eslint-disable` 注释（除非有充分理由）

### 9.2 TypeScript
- 提交前必须通过 TypeScript 类型检查
- 不允许使用 `@ts-ignore` 注释（除非有充分理由）

### 9.3 Prettier
- 提交前自动格式化代码
- 统一代码风格

## 十、最佳实践

### 10.1 单一职责
- 一个函数只做一件事
- 一个组件只负责一个功能模块

### 10.2 DRY 原则
- 不要重复自己（Don't Repeat Yourself）
- 抽取公共逻辑为函数或 Hook

### 10.3 代码可读性
- 变量名要有意义
- 函数名要描述清楚功能
- 复杂逻辑要添加注释

### 10.4 保持简单
- 避免过度设计
- 优先使用简单方案
- 必要时才抽象

## 检查清单

提交代码前请确认：
- [ ] 代码符合命名规范
- [ ] 类型定义完整，无 `any` 类型
- [ ] 通过 ESLint 检查
- [ ] 通过 TypeScript 类型检查
- [ ] 代码已格式化（Prettier）
- [ ] 复杂逻辑已添加注释
- [ ] 无 console.log 等调试代码
- [ ] 组件和函数职责单一
- [ ] 性能优化（必要时使用 memo/useCallback/useMemo）

