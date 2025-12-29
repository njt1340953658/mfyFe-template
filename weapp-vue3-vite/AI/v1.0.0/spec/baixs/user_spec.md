# 用户管理模块 - 需求规格说明书

## 1. 模块概述

用户管理模块是小程序后台管理系统的核心模块之一，提供用户信息的查询、展示、编辑和管理功能。

---

## 2. 页面结构

### 2.1 页面路径
- **主页面**: `subPages/user/list/index`
- **详情页**: `subPages/user/detail/index`
- **编辑页**: `subPages/user/edit/index`

### 2.2 页面布局

```
┌─────────────────────────┐
│   导航栏：用户管理      │
├─────────────────────────┤
│  [搜索框]  [筛选]       │
├─────────────────────────┤
│  ┌───────────────────┐  │
│  │ 用户列表项 1      │  │
│  │ 头像 | 昵称 | 操作│  │
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 用户列表项 2      │  │
│  └───────────────────┘  │
│          ...            │
├─────────────────────────┤
│    [上拉加载更多]       │
└─────────────────────────┘
```

---

## 3. 功能需求

### 3.1 用户列表 (F-001)

#### 功能描述
展示用户列表，支持下拉刷新和上拉加载更多。

#### 显示字段
| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| id | number | 用户ID | 1001 |
| avatar | string | 头像URL | https://... |
| nickname | string | 昵称 | 张三 |
| phone | string | 手机号 | 138****1234 |
| status | number | 状态 | 1=正常, 0=禁用 |
| createTime | string | 注册时间 | 2024-01-01 10:00 |

#### 交互说明
1. 页面加载时自动请求第一页数据
2. 下拉刷新重新加载第一页
3. 上拉触底加载下一页
4. 点击列表项跳转到详情页

---

### 3.2 搜索功能 (F-002)

#### 功能描述
根据用户昵称、手机号进行模糊搜索。

#### 输入字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | string | 否 | 搜索关键词 |

#### 交互说明
1. 输入框防抖处理（500ms）
2. 输入内容后自动触发搜索
3. 清空搜索内容恢复列表

---

### 3.3 用户详情 (F-003)

#### 功能描述
查看用户的详细信息。

#### 显示字段
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | number | 用户ID |
| avatar | string | 头像 |
| nickname | string | 昵称 |
| realName | string | 真实姓名 |
| phone | string | 手机号 |
| email | string | 邮箱 |
| gender | number | 性别（0=未知, 1=男, 2=女） |
| birthday | string | 生日 |
| address | string | 地址 |
| status | number | 状态 |
| createTime | string | 注册时间 |
| lastLoginTime | string | 最后登录时间 |

#### 交互说明
1. 展示用户完整信息
2. 提供"编辑"按钮跳转编辑页
3. 提供"禁用/启用"按钮切换状态

---

### 3.4 编辑用户 (F-004)

#### 功能描述
编辑用户的基本信息。

#### 表单字段
| 字段名 | 类型 | 必填 | 验证规则 |
|--------|------|------|----------|
| nickname | string | 是 | 2-20字符 |
| realName | string | 否 | 2-20字符 |
| phone | string | 是 | 11位手机号 |
| email | string | 否 | 邮箱格式 |
| gender | number | 否 | 0/1/2 |
| birthday | string | 否 | 日期格式 |
| address | string | 否 | 最多100字符 |

#### 交互说明
1. 表单预填充原有数据
2. 实时表单验证
3. 提交前二次确认
4. 成功后返回详情页

---

### 3.5 状态切换 (F-005)

#### 功能描述
启用或禁用用户账号。

#### 输入字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 用户ID |
| status | number | 是 | 1=启用, 0=禁用 |

#### 交互说明
1. 操作前弹窗二次确认
2. 成功后显示提示
3. 刷新当前页面数据

---

### 3.6 删除用户 (F-006)

#### 功能描述
删除指定用户（软删除）。

#### 输入字段
| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | number | 是 | 用户ID |

#### 交互说明
1. 操作前弹窗二次确认
2. 输入确认文字（"确认删除"）
3. 成功后返回列表页
4. 提示删除成功

---

## 4. API 接口定义

### 4.1 获取用户列表

**接口**: `GET /api/users`

**请求参数**:
```typescript
interface UserListParams {
  page: number;        // 页码，从1开始
  pageSize: number;    // 每页数量，默认20
  keyword?: string;    // 搜索关键词
  status?: number;     // 状态筛选
}
```

**响应数据**:
```typescript
interface UserListResponse {
  code: number;
  message: string;
  data: {
    list: User[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}
```

---

### 4.2 获取用户详情

**接口**: `GET /api/users/:id`

**请求参数**:
```typescript
interface UserDetailParams {
  id: number;  // 用户ID
}
```

**响应数据**:
```typescript
interface UserDetailResponse {
  code: number;
  message: string;
  data: User;
}
```

---

### 4.3 更新用户信息

**接口**: `PUT /api/users/:id`

**请求参数**:
```typescript
interface UpdateUserParams {
  id: number;
  nickname?: string;
  realName?: string;
  phone?: string;
  email?: string;
  gender?: number;
  birthday?: string;
  address?: string;
}
```

**响应数据**:
```typescript
interface UpdateUserResponse {
  code: number;
  message: string;
  data: User;
}
```

---

### 4.4 切换用户状态

**接口**: `PUT /api/users/:id/status`

**请求参数**:
```typescript
interface ToggleStatusParams {
  id: number;
  status: number;  // 0=禁用, 1=启用
}
```

**响应数据**:
```typescript
interface ToggleStatusResponse {
  code: number;
  message: string;
  data: null;
}
```

---

### 4.5 删除用户

**接口**: `DELETE /api/users/:id`

**请求参数**:
```typescript
interface DeleteUserParams {
  id: number;
}
```

**响应数据**:
```typescript
interface DeleteUserResponse {
  code: number;
  message: string;
  data: null;
}
```

---

## 5. 数据类型定义

### 5.1 用户实体

```typescript
interface User {
  id: number;
  avatar: string;
  nickname: string;
  realName: string;
  phone: string;
  email: string;
  gender: 0 | 1 | 2;  // 0=未知, 1=男, 2=女
  birthday: string;
  address: string;
  status: 0 | 1;      // 0=禁用, 1=正常
  createTime: string;
  updateTime: string;
  lastLoginTime: string;
}
```

---

## 6. 验证规则

### 6.1 前端验证

| 字段 | 规则 |
|------|------|
| nickname | 必填，2-20字符，不能包含特殊字符 |
| phone | 必填，11位数字，符合手机号格式 |
| email | 非必填，符合邮箱格式 |
| realName | 非必填，2-20字符，仅中文或英文 |

### 6.2 错误提示

| 场景 | 提示文案 |
|------|----------|
| 昵称为空 | "请输入用户昵称" |
| 昵称长度不符 | "昵称长度为2-20个字符" |
| 手机号为空 | "请输入手机号" |
| 手机号格式错误 | "请输入正确的手机号" |
| 邮箱格式错误 | "请输入正确的邮箱地址" |

---

## 7. 异常处理

### 7.1 网络异常
- **场景**: 请求失败、超时
- **处理**: 显示 Toast 提示，提供重试按钮

### 7.2 数据为空
- **场景**: 列表无数据
- **处理**: 显示空状态占位图

### 7.3 权限不足
- **场景**: 无操作权限
- **处理**: 隐藏操作按钮或显示权限提示

---

## 8. 性能要求

| 指标 | 要求 |
|------|------|
| 列表首屏加载 | < 1.5s |
| 详情页加载 | < 1s |
| 搜索响应 | < 500ms |
| 分页加载 | < 1s |

---

## 9. 兼容性

- **微信小程序基础库**: >= 2.10.0
- **支持平台**: 微信小程序、H5
- **系统版本**: iOS 10+, Android 5.0+

---

## 10. 测试用例

### 10.1 列表加载
1. ✅ 首次加载显示前20条数据
2. ✅ 下拉刷新重新加载第一页
3. ✅ 上拉加载追加下一页数据
4. ✅ 无更多数据时提示"没有更多了"

### 10.2 搜索功能
1. ✅ 输入关键词后500ms触发搜索
2. ✅ 搜索结果正确显示
3. ✅ 清空关键词恢复原列表

### 10.3 编辑功能
1. ✅ 表单预填充正确
2. ✅ 实时验证提示
3. ✅ 提交成功后数据更新
4. ✅ 验证失败阻止提交

---

## 11. UI 设计规范

### 11.1 颜色
- **主色调**: #07C160（微信绿）
- **辅助色**: #576B95（微信蓝）
- **成功**: #07C160
- **警告**: #FA9D3B
- **错误**: #FA5151
- **禁用**: #C8C9CC

### 11.2 字体
- **标题**: 32rpx, bold
- **正文**: 28rpx, regular
- **辅助文字**: 24rpx, #888

### 11.3 间距
- **页面边距**: 30rpx
- **卡片内边距**: 30rpx
- **列表项高度**: 120rpx

---

## 12. 变更记录

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2024-01-01 | 初始版本 | 产品经理 |

---

## 13. 附录

### 13.1 相关文档
- [基础架构文档](../infra.md)
- [技术方案](../../tech_solution/baixs/user_solution.md)
- [任务拆分](../../tasks/baixs/user_task.md)

### 13.2 联系人
- **产品经理**: xxx
- **UI 设计**: xxx
- **前端开发**: xxx
- **后端开发**: xxx

