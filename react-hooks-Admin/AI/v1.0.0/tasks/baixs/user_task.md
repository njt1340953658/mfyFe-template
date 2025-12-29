# 用户管理模块前端任务拆解

## 任务概述
实现用户管理模块的前端页面，包括用户列表、搜索筛选、新增用户、编辑用户、删除用户、状态切换等功能。

## 前置准备

### Task 0: 环境准备与依赖检查
- **检查项**:
  - ✅ 确认 Ant Design 5.x 已安装
  - ✅ 确认 dayjs 已安装（用于时间格式化）
  - ✅ 确认 lodash-es 已安装（用于防抖）
  - ✅ 确认 axios 封装已完成（`utils/service/index.ts`）
  - ✅ 确认路由系统正常工作
  - ✅ 确认 Redux Store 配置正常

- **检查方法**: 查看 `package.json` 和运行 `npm run dev` 确认无错误

---

## 第一阶段：基础搭建（预计 2-3 小时）

### Task 1: 创建类型定义文件
**文件**: `types/user.d.ts`

**任务内容**:
```typescript
// 1. 定义 User 命名空间
// 2. 定义 UserItem 接口（id, username, nickname, email, phone, avatar, status, createdAt, updatedAt）
// 3. 定义 ListParams 接口（分页、筛选、排序参数）
// 4. 定义 ListResponse 接口（list, total, page, pageSize）
// 5. 定义 CreateParams 和 UpdateParams 接口
```

**验收标准**:
- ✅ 类型定义完整，无 TypeScript 错误
- ✅ 符合后端 API 数据结构

---

### Task 2: 创建 API 接口文件
**文件**: `api/user.ts`

**任务内容**:
```typescript
// 1. 导入类型定义和 request 实例
// 2. 实现 getUserList(params): 获取用户列表
// 3. 实现 createUser(data): 创建用户
// 4. 实现 updateUser(id, data): 更新用户
// 5. 实现 deleteUser(id): 删除用户
// 6. 实现 uploadFile(file): 上传头像（如需要）
```

**验收标准**:
- ✅ 所有接口定义正确，类型标注完整
- ✅ 请求路径符合后端 API 规范（`/api/v1/users`）
- ✅ 使用 TypeScript 泛型正确标注返回值类型

---

### Task 3: 创建路由配置
**文件**: `routers/router/system.tsx`

**任务内容**:
```typescript
// 1. 使用 lazy 懒加载用户管理页面
// 2. 配置路由路径 /system/user
// 3. 配置 meta 信息（title, key, requireAuth, permission）
// 4. 嵌套在 LayoutIndex 布局下
```

**验收标准**:
- ✅ 路由配置正确，可以通过 URL 访问
- ✅ 懒加载生效，页面按需加载
- ✅ 面包屑显示正确

---

## 第二阶段：搜索筛选功能（预计 1-2 小时）

### Task 4: 创建搜索表单组件
**文件**: `views/system/user/components/UserSearch.tsx`

**任务内容**:
1. 创建搜索表单组件
   - 关键词输入框（用户名/昵称/邮箱/手机号）
   - 状态下拉选择（全部/启用/禁用）
   - 创建时间范围选择器
2. 实现搜索和重置按钮
3. 接收 `onSearch` 和 `onReset` 回调 props
4. 使用 Form.useForm() 管理表单状态

**验收标准**:
- ✅ 表单布局美观，字段对齐
- ✅ 搜索和重置功能正常
- ✅ 输入框支持 allowClear
- ✅ 组件使用 React.memo 优化

---

## 第三阶段：列表展示功能（预计 2-3 小时）

### Task 5: 创建用户管理主页面骨架
**文件**: `views/system/user/index.tsx`

**任务内容**:
1. 创建页面主组件
2. 定义状态管理
   - dataSource（列表数据）
   - loading（加载状态）
   - pagination（分页状态）
   - filters（筛选条件）
   - sorter（排序条件）
   - modalVisible（弹窗显示状态）
   - modalType（弹窗类型：add/edit）
   - currentRecord（当前编辑的记录）
3. 创建页面布局结构
   - 面包屑区域
   - 搜索表单区域
   - 操作按钮区域（新增、刷新）
   - 数据表格区域

**验收标准**:
- ✅ 页面结构清晰，布局合理
- ✅ 状态定义完整，类型正确

---

### Task 6: 实现数据列表查询功能
**文件**: `views/system/user/index.tsx`

**任务内容**:
1. 实现 `fetchUserList` 方法
   - 根据分页、筛选、排序参数调用 API
   - 处理 loading 状态
   - 更新 dataSource 和 total
   - 错误处理和提示
2. 在 useEffect 中初始化加载数据
3. 实现搜索回调 `handleSearch`
   - 更新 filters 状态
   - 重置分页到第一页
   - 触发数据刷新
4. 实现重置回调 `handleReset`
   - 清空 filters
   - 重置分页
   - 触发数据刷新

**验收标准**:
- ✅ 首次进入页面自动加载数据
- ✅ 搜索功能正常，支持关键词、状态、时间范围筛选
- ✅ 重置功能正常，清空所有筛选条件
- ✅ Loading 状态正确显示
- ✅ 错误提示友好

---

### Task 7: 实现数据表格配置
**文件**: `views/system/user/index.tsx`

**任务内容**:
1. 定义 columns 配置
   - 序号列（自动计算分页序号）
   - 用户名列（支持排序）
   - 昵称列
   - 邮箱列（响应式，小屏隐藏）
   - 手机号列（脱敏显示：138****0000）
   - 状态列（Switch 组件）
   - 创建时间列（格式化 + 排序 + 响应式）
   - 操作列（编辑、删除按钮 + 权限控制）
2. 实现 `handleTableChange` 方法
   - 处理分页变化
   - 处理排序变化
   - 触发数据刷新
3. 渲染 Ant Design Table 组件
   - 绑定 dataSource 和 columns
   - 配置 pagination
   - 配置 loading
   - 配置 onChange 回调

**验收标准**:
- ✅ 表格显示正常，数据渲染正确
- ✅ 分页功能正常，页码、每页条数切换正常
- ✅ 排序功能正常，点击表头可切换排序
- ✅ 手机号脱敏显示正确
- ✅ 响应式适配正常，小屏隐藏非关键列
- ✅ 操作列按钮布局合理

---

## 第四阶段：新增/编辑功能（预计 3-4 小时）

### Task 8: 创建用户表单组件
**文件**: `views/system/user/components/UserForm.tsx`

**任务内容**:
1. 创建表单组件，接收 props
   - visible: boolean（弹窗显示）
   - type: 'add' | 'edit'（表单类型）
   - initialValues: Partial<UserItem>（初始值）
   - onSuccess: () => void（成功回调）
   - onCancel: () => void（取消回调）
2. 使用 Form.useForm() 管理表单
3. 渲染 Modal 弹窗
4. 实现表单字段
   - 用户名（新增必填，编辑禁用）
   - 密码（新增必填，编辑可选折叠）
   - 确认密码（校验一致性）
   - 昵称（选填）
   - 邮箱（选填 + 格式校验）
   - 手机号（选填 + 格式校验）
   - 头像（Upload 组件）
   - 状态（Radio 组件）

**验收标准**:
- ✅ 表单布局美观，labelCol 和 wrapperCol 配置合理
- ✅ 所有字段校验规则正确
- ✅ 用户名校验：4-32字符，字母数字下划线
- ✅ 密码校验：8-32字符，包含字母和数字
- ✅ 确认密码校验：与密码一致
- ✅ 邮箱校验：邮箱格式
- ✅ 手机号校验：11位数字
- ✅ 新增和编辑模式字段显示逻辑正确
- ✅ 编辑模式下用户名禁用
- ✅ 编辑模式下密码重置为可折叠区域

---

### Task 9: 实现表单提交逻辑
**文件**: `views/system/user/components/UserForm.tsx`

**任务内容**:
1. 实现 `handleSubmit` 方法
   - 根据 type 调用不同的 API（createUser / updateUser）
   - 处理 loading 状态
   - 成功后调用 onSuccess 回调并重置表单
   - 失败后显示错误提示
2. 实现 `handleCancel` 方法
   - 使用 Modal.confirm 确认放弃
   - 确认后重置表单并调用 onCancel 回调
3. 绑定 Modal 的 onOk 和 onCancel
4. 配置 confirmLoading 和 destroyOnClose

**验收标准**:
- ✅ 新增用户成功后关闭弹窗，刷新列表
- ✅ 编辑用户成功后关闭弹窗，刷新列表
- ✅ 提交时显示 Loading，禁止重复提交
- ✅ 后端错误提示正确显示
- ✅ 取消时弹出确认对话框
- ✅ 弹窗关闭后表单自动重置

---

### Task 10: 实现头像上传功能
**文件**: `views/system/user/components/UserForm.tsx`

**任务内容**:
1. 使用 Ant Design Upload 组件
2. 配置 listType="picture-card"
3. 实现 beforeUpload 校验
   - 文件类型：image/*
   - 文件大小：< 2MB
4. 实现 customRequest 上传逻辑
   - 调用 uploadFile API
   - 成功后更新表单字段 avatar
   - 失败后显示错误提示

**验收标准**:
- ✅ 上传按钮显示正常
- ✅ 文件类型和大小校验正确
- ✅ 上传成功后显示预览图
- ✅ 上传成功后表单字段自动更新
- ✅ 上传失败提示友好

---

### Task 11: 集成表单组件到主页面
**文件**: `views/system/user/index.tsx`

**任务内容**:
1. 实现 `handleAdd` 方法
   - 设置 modalType 为 'add'
   - 清空 currentRecord
   - 打开弹窗
2. 实现 `handleEdit` 方法
   - 设置 modalType 为 'edit'
   - 设置 currentRecord 为当前行数据
   - 打开弹窗
3. 实现 `handleFormSuccess` 回调
   - 关闭弹窗
   - 显示成功提示
   - 刷新列表
4. 实现 `handleFormCancel` 回调
   - 关闭弹窗
5. 渲染 UserForm 组件
   - 传递 visible, type, initialValues, onSuccess, onCancel
6. 在操作区域添加「新增用户」按钮
   - 绑定 onClick 事件
   - 权限控制（system:user:add）

**验收标准**:
- ✅ 点击「新增用户」按钮打开新增表单
- ✅ 点击「编辑」按钮打开编辑表单，回显数据
- ✅ 表单提交成功后关闭弹窗，刷新列表，显示提示
- ✅ 新增用户按钮根据权限控制显示/隐藏

---

## 第五阶段：删除和状态切换功能（预计 1-2 小时）

### Task 12: 实现删除用户功能
**文件**: `views/system/user/index.tsx`

**任务内容**:
1. 实现 `handleDelete` 方法
   - 使用 Modal.confirm 弹出确认对话框
   - 标题：「删除确认」
   - 内容：「确定要删除用户「{username}」吗？此操作不可恢复。」
   - 确认后调用 deleteUser API
   - 成功后刷新列表并提示
   - 失败后显示错误提示
2. 在表格操作列添加「删除」按钮
   - type="link" danger
   - 绑定 onClick 事件
   - 权限控制（system:user:delete）

**验收标准**:
- ✅ 点击「删除」按钮弹出确认对话框
- ✅ 对话框显示正确的用户名
- ✅ 确认删除后调用 API，成功后刷新列表
- ✅ 删除成功提示正确显示
- ✅ 删除失败提示错误信息
- ✅ 删除按钮根据权限控制显示/隐藏

---

### Task 13: 实现用户状态切换功能
**文件**: `views/system/user/index.tsx`

**任务内容**:
1. 实现 `handleStatusChange` 方法
   - 接收 record 和 checked 参数
   - 调用 updateUser API，只更新 status 字段
   - 成功后刷新列表并提示
   - 失败后显示错误提示（Switch 自动回滚）
2. 在状态列使用 Switch 组件
   - checked 绑定 status === 0
   - onChange 绑定 handleStatusChange
   - checkedChildren="启用"
   - unCheckedChildren="禁用"

**验收标准**:
- ✅ Switch 组件状态正确显示（启用/禁用）
- ✅ 点击 Switch 触发状态切换
- ✅ 切换成功后刷新列表，提示「状态修改成功」
- ✅ 切换失败后 Switch 回滚到原状态，显示错误提示

---

## 第六阶段：权限控制（预计 1 小时）

### Task 14: 实现权限控制 Hook
**文件**: `hooks/usePermission.ts`

**任务内容**:
1. 创建 `usePermission` Hook
2. 从 Redux Store 的 `auth.permissions` 获取权限列表
3. 接收 permissionCode 参数
4. 返回 boolean 值（是否有权限）

**验收标准**:
- ✅ Hook 正确获取权限列表
- ✅ 权限判断逻辑正确
- ✅ 可在组件中正常使用

---

### Task 15: 应用权限控制到页面
**文件**: `views/system/user/index.tsx`

**任务内容**:
1. 在新增按钮添加权限控制
   - 使用 `usePermission('system:user:add')`
   - 无权限时隐藏按钮
2. 在编辑按钮添加权限控制
   - 使用 `usePermission('system:user:edit')`
   - 无权限时禁用按钮
3. 在删除按钮添加权限控制
   - 使用 `usePermission('system:user:delete')`
   - 无权限时禁用按钮

**验收标准**:
- ✅ 无「新增」权限时，新增按钮隐藏
- ✅ 无「编辑」权限时，编辑按钮禁用
- ✅ 无「删除」权限时，删除按钮禁用

---

## 第七阶段：性能优化和细节完善（预计 1-2 小时）

### Task 16: 实现性能优化
**文件**: `views/system/user/index.tsx` 及子组件

**任务内容**:
1. 使用 useCallback 缓存回调函数
   - fetchUserList
   - handleTableChange
   - handleSearch
   - handleReset
   - handleAdd
   - handleEdit
   - handleDelete
   - handleStatusChange
2. 使用 useMemo 缓存计算结果
   - columns 配置
3. 对子组件使用 React.memo
   - UserSearch
   - UserForm
4. 实现搜索防抖
   - 使用 lodash-es 的 debounce
   - 延迟 500ms

**验收标准**:
- ✅ 不必要的重渲染被避免
- ✅ 搜索输入有防抖效果
- ✅ 页面交互流畅

---

### Task 17: 创建页面样式文件
**文件**: `views/system/user/index.less`

**任务内容**:
1. 定义页面容器样式
2. 定义搜索区域样式
   - 表单项间距
   - 按钮组布局
3. 定义操作区域样式
   - 按钮间距
   - 与表格间距
4. 定义表格样式
   - 操作列按钮间距
   - 响应式断点样式

**验收标准**:
- ✅ 页面布局美观，间距合理
- ✅ 响应式适配正常
- ✅ 符合 Ant Design 设计规范

---

### Task 18: 完善错误处理和边界情况
**文件**: 所有相关文件

**任务内容**:
1. 完善空数据展示
   - Table 的 locale 配置
   - Empty 组件自定义
2. 完善 Loading 状态
   - 列表加载
   - 按钮提交
   - 状态切换
3. 完善错误提示
   - 网络错误
   - 业务错误
   - 字段校验错误
4. 处理边界情况
   - 数据为空
   - 字段为 null/undefined
   - 时间格式异常

**验收标准**:
- ✅ 无数据时显示友好的空状态
- ✅ 所有异步操作都有 Loading 提示
- ✅ 错误信息清晰明确
- ✅ 边界情况不会导致页面崩溃

---

## 第八阶段：测试和验收（预计 1-2 小时）

### Task 19: 功能测试
**测试清单**:
1. ✅ 列表查询
   - 首次加载显示数据
   - 分页功能正常
   - 排序功能正常
2. ✅ 搜索筛选
   - 关键词搜索正常
   - 状态筛选正常
   - 时间范围筛选正常
   - 重置功能正常
3. ✅ 新增用户
   - 表单校验正常
   - 提交成功刷新列表
   - 唯一冲突提示正确
4. ✅ 编辑用户
   - 数据回显正常
   - 用户名禁用编辑
   - 提交成功刷新列表
5. ✅ 删除用户
   - 确认对话框显示
   - 删除成功刷新列表
6. ✅ 状态切换
   - Switch 状态正确
   - 切换成功刷新列表
7. ✅ 权限控制
   - 按钮权限控制正常

---

### Task 20: 代码检查和优化
**检查项**:
1. ✅ TypeScript 类型检查无错误
   - 运行 `npm run type-check`
2. ✅ ESLint 检查无错误
   - 运行 `npm run lint:check`
3. ✅ Prettier 格式化
   - 运行 `npm run lint:prettier`
4. ✅ 代码注释完善
   - 关键逻辑添加注释
   - 复杂函数添加 JSDoc
5. ✅ 移除 console.log
6. ✅ 移除未使用的导入和变量

---

## 预估工时总结
| 阶段 | 任务数 | 预估工时 |
|------|--------|----------|
| 第一阶段：基础搭建 | 3 | 2-3h |
| 第二阶段：搜索筛选 | 1 | 1-2h |
| 第三阶段：列表展示 | 3 | 2-3h |
| 第四阶段：新增/编辑 | 4 | 3-4h |
| 第五阶段：删除/状态切换 | 2 | 1-2h |
| 第六阶段：权限控制 | 2 | 1h |
| 第七阶段：优化完善 | 3 | 1-2h |
| 第八阶段：测试验收 | 2 | 1-2h |
| **总计** | **20** | **12-19h** |

---

## 注意事项
1. 每完成一个 Task，及时自测功能是否正常
2. 遇到后端 API 问题，及时与后端对齐接口文档
3. 保持代码风格一致，遵循项目规范
4. 提交代码前运行 lint 和 type-check
5. 重要功能点添加代码注释
6. 复杂逻辑考虑单元测试覆盖
