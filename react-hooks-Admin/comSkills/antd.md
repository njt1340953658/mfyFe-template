# Ant Design 使用规范

## 项目配置

### 1. 全局配置
```typescript
// App.tsx
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux'

const App = () => {
  const { assemblySize } = useSelector((state: RootState) => state.global)
  
  return (
    <ConfigProvider
      locale={zhCN}
      componentSize={assemblySize}  // 统一组件尺寸
      theme={{
        token: {
          colorPrimary: '#1890ff',  // 主题色
          borderRadius: 4,  // 圆角
        }
      }}
    >
      <YourApp />
    </ConfigProvider>
  )
}
```

### 2. 主题定制
```typescript
<ConfigProvider
  theme={{
    token: {
      // 颜色
      colorPrimary: '#1890ff',
      colorSuccess: '#52c41a',
      colorWarning: '#faad14',
      colorError: '#ff4d4f',
      colorInfo: '#1890ff',
      
      // 尺寸
      borderRadius: 4,
      fontSize: 14,
      
      // 间距
      marginXS: 8,
      marginSM: 12,
      marginMD: 16,
      marginLG: 24,
      marginXL: 32,
    },
    components: {
      Button: {
        primaryColor: '#1890ff',
      },
      Table: {
        headerBg: '#fafafa',
      }
    }
  }}
>
  <App />
</ConfigProvider>
```

## 常用组件

### 1. Table 表格
```typescript
import { Table, Button, Space } from 'antd'
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'

interface DataType {
  id: number
  name: string
  age: number
  address: string
}

const MyTable: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<DataType[]>([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  })

  // 列配置
  const columns: ColumnsType<DataType> = [
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
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      sorter: true,  // 排序
      ellipsis: true  // 超出省略
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      sorter: true
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      responsive: ['lg']  // 响应式：大屏显示
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      )
    }
  ]

  // 表格变化处理
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, any>,
    sorter: any
  ) => {
    setPagination({
      current: pagination.current!,
      pageSize: pagination.pageSize!,
      total: pagination.total!
    })
    // 请求数据...
  }

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={dataSource}
      columns={columns}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`
      }}
      onChange={handleTableChange}
      scroll={{ x: 1200, y: 600 }}
    />
  )
}
```

### 2. Form 表单
```typescript
import { Form, Input, Button, Select, DatePicker, Radio } from 'antd'
import type { FormInstance } from 'antd/es/form'

const MyForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      await submitForm(values)
      message.success('提交成功')
      form.resetFields()
    } catch (error) {
      message.error('提交失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      onFinish={handleSubmit}
      initialValues={{
        status: 0
      }}
    >
      {/* 必填项 */}
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 4, max: 32, message: '用户名长度为4-32个字符' },
          { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字、下划线' }
        ]}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>

      {/* 密码 */}
      <Form.Item
        label="密码"
        name="password"
        rules={[
          { required: true, message: '请输入密码' },
          { min: 8, message: '密码至少8个字符' }
        ]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      {/* 确认密码 */}
      <Form.Item
        label="确认密码"
        name="confirmPassword"
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

      {/* 下拉选择 */}
      <Form.Item
        label="角色"
        name="role"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select placeholder="请选择角色">
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="user">普通用户</Select.Option>
        </Select>
      </Form.Item>

      {/* 日期选择 */}
      <Form.Item
        label="生日"
        name="birthday"
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      {/* 单选 */}
      <Form.Item
        label="状态"
        name="status"
      >
        <Radio.Group>
          <Radio value={0}>启用</Radio>
          <Radio value={1}>禁用</Radio>
        </Radio.Group>
      </Form.Item>

      {/* 按钮 */}
      <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交
          </Button>
          <Button onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
```

### 3. Modal 弹窗
```typescript
import { Modal, Form, Input, message } from 'antd'

interface UserModalProps {
  visible: boolean
  type: 'add' | 'edit'
  initialValues?: any
  onSuccess: () => void
  onCancel: () => void
}

const UserModal: React.FC<UserModalProps> = ({
  visible,
  type,
  initialValues,
  onSuccess,
  onCancel
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      
      if (type === 'add') {
        await createUser(values)
      } else {
        await updateUser(initialValues.id, values)
      }
      
      message.success(`${type === 'add' ? '新增' : '编辑'}成功`)
      form.resetFields()
      onSuccess()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消吗？已填写的内容将丢失',
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
      onOk={handleOk}
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
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        {/* 其他表单项... */}
      </Form>
    </Modal>
  )
}
```

### 4. Message 消息提示
```typescript
import { message } from 'antd'

// 成功提示
message.success('操作成功')

// 错误提示
message.error('操作失败')

// 警告提示
message.warning('警告信息')

// 普通提示
message.info('提示信息')

// 加载中
const hide = message.loading('加载中...', 0)
// 关闭
hide()

// 自定义配置
message.config({
  duration: 3,  // 持续时间（秒）
  maxCount: 3,  // 最大显示数量
  top: 100,  // 距离顶部距离
})
```

### 5. Drawer 抽屉
```typescript
import { Drawer, Form, Input, Button, Space } from 'antd'

const MyDrawer: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      await submitForm(values)
      message.success('提交成功')
      setVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('提交失败')
    }
  }

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        打开抽屉
      </Button>
      
      <Drawer
        title="表单标题"
        placement="right"
        width={600}
        open={visible}
        onClose={() => setVisible(false)}
        extra={
          <Space>
            <Button onClick={() => setVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          {/* 其他表单项... */}
        </Form>
      </Drawer>
    </>
  )
}
```

### 6. Upload 文件上传
```typescript
import { Upload, Button, message } from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

// 普通上传
const NormalUpload: React.FC = () => {
  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/v1/upload',
    headers: {
      authorization: 'Bearer token'
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('文件大小不能超过2MB')
      }
      return isLt2M
    }
  }

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>点击上传</Button>
    </Upload>
  )
}

// 图片上传
const ImageUpload: React.FC = () => {
  const [fileList, setFileList] = useState([])

  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={({ fileList }) => setFileList(fileList)}
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
          const url = await uploadFile(file)
          onSuccess?.(url)
        } catch (error) {
          onError?.(error as Error)
        }
      }}
    >
      {fileList.length < 1 && (
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
      )}
    </Upload>
  )
}
```

## 布局组件

### 1. Layout 布局
```typescript
import { Layout, Menu } from 'antd'

const { Header, Sider, Content } = Layout

const MyLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={menuItems}
        />
      </Sider>
      
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          {/* 头部内容 */}
        </Header>
        
        <Content style={{ margin: '16px' }}>
          {/* 主要内容 */}
        </Content>
      </Layout>
    </Layout>
  )
}
```

### 2. Card 卡片
```typescript
import { Card, Row, Col } from 'antd'

const MyCard: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <Card title="卡片标题" bordered={false}>
          卡片内容
        </Card>
      </Col>
      
      <Col span={6}>
        <Card
          title="带操作的卡片"
          extra={<a href="#">更多</a>}
        >
          卡片内容
        </Card>
      </Col>
    </Row>
  )
}
```

## 反馈组件

### 1. Spin 加载中
```typescript
import { Spin } from 'antd'

// 全局加载
<Spin spinning={loading}>
  <div>内容</div>
</Spin>

// 居中加载
<div style={{ textAlign: 'center', padding: 50 }}>
  <Spin size="large" />
</div>
```

### 2. Modal.confirm 确认对话框
```typescript
import { Modal } from 'antd'

const handleDelete = (id: number) => {
  Modal.confirm({
    title: '删除确认',
    content: '确定要删除吗？此操作不可恢复',
    okText: '确定',
    cancelText: '取消',
    okType: 'danger',
    onOk: async () => {
      await deleteItem(id)
      message.success('删除成功')
    }
  })
}
```

## 最佳实践

### 1. 表单校验
```typescript
// ✅ 推荐：使用异步校验
<Form.Item
  name="username"
  rules={[
    { required: true, message: '请输入用户名' },
    {
      validator: async (_, value) => {
        if (!value) return
        const exists = await checkUsernameExists(value)
        if (exists) {
          throw new Error('用户名已存在')
        }
      }
    }
  ]}
>
  <Input />
</Form.Item>
```

### 2. 受控组件
```typescript
// ✅ 推荐：使用受控组件
const [value, setValue] = useState('')

<Input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

### 3. 性能优化
```typescript
// 表格虚拟滚动
<Table
  virtual
  scroll={{ y: 600 }}
  dataSource={largeDataSource}
/>

// 表单按需渲染
<Form.Item shouldUpdate={(prev, cur) => prev.type !== cur.type}>
  {({ getFieldValue }) => {
    const type = getFieldValue('type')
    return type === 'custom' ? <CustomInput /> : <Input />
  }}
</Form.Item>
```

## 常见问题

### 问题 1：表单重置不生效
```typescript
// ❌ 错误
<Form initialValues={data}>
  {/* form 不会因为 data 变化而更新 */}
</Form>

// ✅ 正确
useEffect(() => {
  form.setFieldsValue(data)
}, [data, form])
```

### 问题 2：Modal 中的表单不更新
```typescript
// ✅ 使用 destroyOnClose
<Modal destroyOnClose>
  <Form initialValues={data} />
</Modal>
```

## 总结
1. ✅ 使用 ConfigProvider 进行全局配置
2. ✅ 合理使用 Form 表单校验
3. ✅ 表格配置响应式和虚拟滚动
4. ✅ 弹窗使用 destroyOnClose 避免状态残留
5. ✅ 统一使用 message 进行提示
6. ✅ 合理使用布局组件构建页面

