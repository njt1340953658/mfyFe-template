# 用户管理模块前端技术方案

## 1. 需求与目标
- 基于 React 18 + TypeScript + Ant Design 5 实现用户管理模块的前端页面
- 提供用户列表查询、新增、编辑、删除、状态切换等完整功能
- 与后端 RESTful API（`/api/v1/users`）对接，实现数据的增删改查
- 遵循项目现有架构规范，复用全局组件和工具函数

## 2. 技术栈
- **UI 框架**: Ant Design 5.x (Table, Form, Modal, Input, Button, Tag, Switch 等)
- **状态管理**: React Hooks (useState, useEffect, useCallback) + Redux (如需全局状态)
- **HTTP 请求**: 基于项目的 Axios 封装 (`utils/service`)
- **表单验证**: Ant Design Form 内置校验 + 自定义校验规则
- **路由**: React Router v6 动态路由配置
- **类型定义**: TypeScript 接口定义

## 3. 目录结构
```
src/
├── views/
│   └── system/                      # 系统管理模块
│       └── user/                    # 用户管理
│           ├── index.tsx           # 主页面组件
│           ├── index.less          # 页面样式
│           └── components/         # 子组件
│               ├── UserForm.tsx   # 用户表单（新增/编辑复用）
│               └── UserSearch.tsx # 搜索表单
├── api/
│   └── user.ts                     # 用户相关 API 接口
├── types/
│   └── user.d.ts                   # 用户相关类型定义
└── routers/
    └── router/
        └── system.tsx              # 系统管理路由配置
```

## 4. 核心组件设计

### 4.1 主页面组件 (views/system/user/index.tsx)

#### 职责
- 整合搜索区、操作区、数据表格
- 管理列表数据状态、分页状态、筛选条件
- 调用 API 获取数据并渲染
- 处理新增、编辑、删除等操作

#### 状态管理
```typescript
interface UserPageState {
  // 列表数据
  dataSource: UserItem[]
  total: number
  loading: boolean
  
  // 分页
  pagination: {
    current: number
    pageSize: number
  }
  
  // 筛选条件
  filters: {
    keyword?: string
    status?: 0 | 1
    createdFrom?: string
    createdTo?: string
  }
  
  // 排序
  sorter: {
    sortBy?: 'created_at' | 'username'
    order?: 'asc' | 'desc'
  }
  
  // 弹窗状态
  modalVisible: boolean
  modalType: 'add' | 'edit'
  currentRecord?: UserItem
}
```

#### 核心方法
```typescript
// 获取用户列表
const fetchUserList = useCallback(async () => {
  setLoading(true)
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
      ...sorter
    }
    const res = await getUserList(params)
    setDataSource(res.data.list)
    setTotal(res.data.total)
  } catch (error) {
    message.error('获取用户列表失败')
  } finally {
    setLoading(false)
  }
}, [pagination, filters, sorter])

// 处理分页变化
const handleTableChange = (
  pagination: TablePaginationConfig,
  filters: Record<string, any>,
  sorter: SorterResult<UserItem>
) => {
  setPagination({
    current: pagination.current!,
    pageSize: pagination.pageSize!
  })
  setSorter({
    sortBy: sorter.field as any,
    order: sorter.order === 'ascend' ? 'asc' : 'desc'
  })
}

// 搜索
const handleSearch = (values: any) => {
  setFilters(values)
  setPagination({ current: 1, pageSize: 20 }) // 重置分页
}

// 重置搜索
const handleReset = () => {
  setFilters({})
  setPagination({ current: 1, pageSize: 20 })
}

// 打开新增弹窗
const handleAdd = () => {
  setModalType('add')
  setCurrentRecord(undefined)
  setModalVisible(true)
}

// 打开编辑弹窗
const handleEdit = (record: UserItem) => {
  setModalType('edit')
  setCurrentRecord(record)
  setModalVisible(true)
}

// 删除用户
const handleDelete = (record: UserItem) => {
  Modal.confirm({
    title: '删除确认',
    content: `确定要删除用户「${record.username}」吗？此操作不可恢复。`,
    onOk: async () => {
      try {
        await deleteUser(record.id)
        message.success('删除用户成功')
        fetchUserList()
      } catch (error: any) {
        message.error(error.message || '删除失败')
      }
    }
  })
}

// 切换用户状态
const handleStatusChange = async (record: UserItem, checked: boolean) => {
  try {
    await updateUser(record.id, { status: checked ? 0 : 1 })
    message.success('状态修改成功')
    fetchUserList()
  } catch (error: any) {
    message.error(error.message || '状态修改失败')
  }
}

// 表单提交成功回调
const handleFormSuccess = () => {
  setModalVisible(false)
  message.success(`${modalType === 'add' ? '新增' : '编辑'}用户成功`)
  fetchUserList()
}
```

#### 表格列配置
```typescript
const columns: ColumnsType<UserItem> = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 80,
    render: (_, __, index) => {
      return (pagination.current - 1) * pagination.pageSize + index + 1
    }
  },
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 120,
    sorter: true
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 120
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 180,
    responsive: ['lg'] // 小屏隐藏
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 120,
    render: (phone: string) => {
      // 脱敏处理：138****0000
      if (!phone) return '-'
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
    render: (status: number, record: UserItem) => (
      <Switch
        checked={status === 0}
        onChange={(checked) => handleStatusChange(record, checked)}
        checkedChildren="启用"
        unCheckedChildren="禁用"
      />
    )
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 160,
    sorter: true,
    responsive: ['lg'], // 小屏隐藏
    render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (_, record: UserItem) => (
      <Space>
        <Button
          type="link"
          size="small"
          onClick={() => handleEdit(record)}
          // 权限控制
          disabled={!hasPermission('system:user:edit')}
        >
          编辑
        </Button>
        <Button
          type="link"
          size="small"
          danger
          onClick={() => handleDelete(record)}
          // 权限控制
          disabled={!hasPermission('system:user:delete')}
        >
          删除
        </Button>
      </Space>
    )
  }
]
```

### 4.2 用户表单组件 (components/UserForm.tsx)

#### 职责
- 复用于新增和编辑场景
- 表单字段渲染和校验
- 处理表单提交

#### Props 接口
```typescript
interface UserFormProps {
  visible: boolean
  type: 'add' | 'edit'
  initialValues?: Partial<UserItem>
  onSuccess: () => void
  onCancel: () => void
}
```

#### 表单字段配置
```typescript
const UserForm: React.FC<UserFormProps> = ({
  visible,
  type,
  initialValues,
  onSuccess,
  onCancel
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  // 提交处理
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      if (type === 'add') {
        await createUser(values)
      } else {
        await updateUser(initialValues!.id, values)
      }
      onSuccess()
      form.resetFields()
    } catch (error: any) {
      message.error(error.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  // 取消处理
  const handleCancel = () => {
    Modal.confirm({
      title: '确认放弃',
      content: '确认放弃填写的内容吗？',
      onOk: () => {
        form.resetFields()
        onCancel()
      }
    })
  }

  return (
    <Modal
      title={type === 'add' ? '新增用户' : '编辑用户'}
      open={visible}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        {/* 用户名 */}
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 4, max: 32, message: '用户名长度为4-32个字符' },
            { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字、下划线' }
          ]}
        >
          <Input
            placeholder="请输入用户名"
            disabled={type === 'edit'}
          />
        </Form.Item>

        {/* 密码（新增时必填，编辑时可选） */}
        {type === 'add' && (
          <>
            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 8, max: 32, message: '密码长度为8-32个字符' },
                { pattern: /^(?=.*[A-Za-z])(?=.*\d)/, message: '密码必须包含字母和数字' }
              ]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="passwordConfirm"
              dependencies={['password']}
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次密码输入不一致'))
                  }
                })
              ]}
            >
              <Input.Password placeholder="请再次输入密码" />
            </Form.Item>
          </>
        )}

        {/* 编辑时的重置密码（可折叠） */}
        {type === 'edit' && (
          <Form.Item label="重置密码">
            <Collapse
              ghost
              onChange={(keys) => setShowPasswordReset(keys.includes('password'))}
            >
              <Collapse.Panel header="点击展开重置密码" key="password">
                <Form.Item
                  name="password"
                  rules={[
                    { min: 8, max: 32, message: '密码长度为8-32个字符' },
                    { pattern: /^(?=.*[A-Za-z])(?=.*\d)/, message: '密码必须包含字母和数字' }
                  ]}
                  noStyle
                >
                  <Input.Password placeholder="请输入新密码" />
                </Form.Item>
                <Form.Item
                  name="passwordConfirm"
                  dependencies={['password']}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(new Error('两次密码输入不一致'))
                      }
                    })
                  ]}
                  noStyle
                  style={{ marginTop: 8 }}
                >
                  <Input.Password placeholder="请再次输入新密码" />
                </Form.Item>
              </Collapse.Panel>
            </Collapse>
          </Form.Item>
        )}

        {/* 昵称 */}
        <Form.Item
          label="昵称"
          name="nickname"
          rules={[
            { max: 64, message: '昵称最多64个字符' }
          ]}
        >
          <Input placeholder="请输入昵称" />
        </Form.Item>

        {/* 邮箱 */}
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { type: 'email', message: '邮箱格式不正确' }
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        {/* 手机号 */}
        <Form.Item
          label="手机号"
          name="phone"
          rules={[
            { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>

        {/* 头像 */}
        <Form.Item
          label="头像"
          name="avatar"
        >
          <Upload
            listType="picture-card"
            maxCount={1}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isImage) {
                message.error('只能上传图片文件')
              }
              if (!isLt2M) {
                message.error('图片大小不能超过2MB')
              }
              return isImage && isLt2M
            }}
            customRequest={async ({ file, onSuccess, onError }) => {
              try {
                // 调用上传接口
                const url = await uploadFile(file)
                onSuccess?.(url)
                form.setFieldValue('avatar', url)
              } catch (error) {
                onError?.(error as Error)
              }
            }}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传头像</div>
            </div>
          </Upload>
        </Form.Item>

        {/* 状态 */}
        <Form.Item
          label="状态"
          name="status"
          initialValue={0}
        >
          <Radio.Group>
            <Radio value={0}>启用</Radio>
            <Radio value={1}>禁用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
```

### 4.3 搜索表单组件 (components/UserSearch.tsx)

```typescript
interface UserSearchProps {
  onSearch: (values: any) => void
  onReset: () => void
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch, onReset }) => {
  const [form] = Form.useForm()

  const handleSearch = () => {
    const values = form.getFieldsValue()
    onSearch(values)
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Form form={form} layout="inline">
      <Form.Item name="keyword">
        <Input
          placeholder="用户名/昵称/邮箱/手机号"
          style={{ width: 200 }}
          allowClear
        />
      </Form.Item>

      <Form.Item name="status">
        <Select
          placeholder="状态"
          style={{ width: 120 }}
          allowClear
        >
          <Select.Option value={0}>启用</Select.Option>
          <Select.Option value={1}>禁用</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="createdRange">
        <RangePicker
          placeholder={['创建起始时间', '创建结束时间']}
        />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
```

## 5. API 接口封装 (api/user.ts)

```typescript
import request from '@/utils/service'

// 类型定义
export interface UserItem {
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

export interface UserListParams {
  page?: number
  pageSize?: number
  keyword?: string
  status?: 0 | 1
  createdFrom?: string
  createdTo?: string
  sortBy?: 'created_at' | 'username'
  order?: 'asc' | 'desc'
}

export interface UserListResponse {
  list: UserItem[]
  total: number
  page: number
  pageSize: number
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return request.get<UserListResponse>('/api/v1/users', { params })
}

// 创建用户
export const createUser = (data: any) => {
  return request.post('/api/v1/users', data)
}

// 更新用户
export const updateUser = (id: number, data: any) => {
  return request.put(`/api/v1/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/api/v1/users/${id}`)
}

// 上传文件
export const uploadFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<string>('/api/v1/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
```

## 6. 类型定义 (types/user.d.ts)

```typescript
declare namespace User {
  // 用户信息
  interface UserItem {
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

  // 查询参数
  interface ListParams {
    page?: number
    pageSize?: number
    keyword?: string
    status?: 0 | 1
    createdFrom?: string
    createdTo?: string
    sortBy?: 'created_at' | 'username'
    order?: 'asc' | 'desc'
  }

  // 列表响应
  interface ListResponse {
    list: UserItem[]
    total: number
    page: number
    pageSize: number
  }

  // 创建用户参数
  interface CreateParams {
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
  interface UpdateParams {
    nickname?: string
    email?: string
    phone?: string
    avatar?: string
    status?: 0 | 1
    password?: string
    passwordConfirm?: string
  }
}
```

## 7. 路由配置 (routers/router/system.tsx)

```typescript
import { lazy } from 'react'
import { RouteObject } from '@/routers/interface'
import { LayoutIndex } from '@/components/layouts/lazyLoad'

const UserManage = lazy(() => import('@/views/system/user'))

const systemRouter: RouteObject[] = [
  {
    path: '/system',
    element: <LayoutIndex />,
    meta: {
      title: '系统管理',
      key: 'system'
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
      }
    ]
  }
]

export default systemRouter
```

## 8. 权限控制

### 自定义 Hook (hooks/usePermission.ts)
```typescript
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'

export const usePermission = (permissionCode: string): boolean => {
  const { permissions } = useSelector((state: RootState) => state.auth)
  return permissions.includes(permissionCode)
}

// 使用示例
const hasEditPermission = usePermission('system:user:edit')
```

## 9. 性能优化

### 防抖搜索
```typescript
import { useMemo } from 'react'
import { debounce } from 'lodash-es'

const debouncedSearch = useMemo(
  () => debounce((values: any) => {
    fetchUserList(values)
  }, 500),
  []
)
```

### 组件缓存
```typescript
const UserSearch = React.memo(UserSearchComponent)
const UserForm = React.memo(UserFormComponent)
```

### 虚拟滚动
```typescript
// 当数据量超过 1000 条时使用虚拟滚动
import { Table } from 'antd'

<Table
  virtual={total > 1000}
  scroll={{ y: 600 }}
  // ...
/>
```

## 10. 错误处理

### 统一错误处理（已在 service/index.ts 中实现）
```typescript
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, message, data } = response.data
    if (code !== 0) {
      message.error(message || '请求失败')
      return Promise.reject(new Error(message))
    }
    return data
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      message.error(data.message || `请求失败: ${status}`)
    } else {
      message.error('网络错误，请检查网络连接')
    }
    return Promise.reject(error)
  }
)
```

## 11. 测试建议

### 单元测试
- 使用 Vitest + React Testing Library
- 测试组件渲染、交互、表单校验

### E2E 测试
- 使用 Playwright
- 测试完整的用户操作流程

## 12. 交付物清单
- ✅ 用户管理主页面 (`views/system/user/index.tsx`)
- ✅ 用户表单组件 (`views/system/user/components/UserForm.tsx`)
- ✅ 搜索表单组件 (`views/system/user/components/UserSearch.tsx`)
- ✅ 用户 API 接口 (`api/user.ts`)
- ✅ 类型定义文件 (`types/user.d.ts`)
- ✅ 路由配置 (`routers/router/system.tsx`)
- ✅ 权限 Hook (`hooks/usePermission.ts`)
- ✅ 页面样式文件 (`views/system/user/index.less`)
