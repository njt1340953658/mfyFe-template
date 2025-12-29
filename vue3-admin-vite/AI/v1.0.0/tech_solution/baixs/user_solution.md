# 用户管理模块 - 技术方案

## 1. 方案概述

本文档详细说明用户管理模块的技术实现方案，基于 Vue 3 + TypeScript + Element Plus 技术栈，包括页面组件设计、状态管理、API 封装、数据流转等核心技术细节。

---

## 2. 技术栈

- **框架**: Vue 3.5 Composition API
- **UI 组件**: Element Plus 2.x
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **类型系统**: TypeScript 5
- **HTTP 请求**: Axios
- **样式方案**: SCSS

---

## 3. 页面组件设计

### 3.1 用户列表页 (views/user/list/index.vue)

#### 组件结构

```vue
<template>
  <div class="user-list-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索用户昵称或手机号"
            clearable
            @clear="handleSearch"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部" clearable>
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">
            搜索
          </el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card class="toolbar-card">
      <el-button type="primary" :icon="Plus" @click="handleAdd">
        新增用户
      </el-button>
      <el-button type="danger" :icon="Delete" @click="handleBatchDelete">
        批量删除
      </el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="50" />
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column label="性别" width="80">
          <template #default="{ row }">
            {{ getGenderText(row.gender) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button
              type="primary"
              size="small"
              :icon="View"
              @click="handleView(row)"
            >
              查看
            </el-button>
            <el-button
              type="warning"
              size="small"
              :icon="Edit"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :icon="Delete"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus, Delete, View, Edit } from '@element-plus/icons-vue';
import { getUserList, deleteUser } from '@/api/user';
import { useUserStore } from '@/store/modules/user';
import type { User } from '@/api/user';

// 状态定义
const userStore = useUserStore();
const loading = ref(false);
const userList = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: undefined as number | undefined
});

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
});

// 加载用户列表
const loadUserList = async () => {
  loading.value = true;
  try {
    const res = await getUserList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    });
    userList.value = res.data.list;
    pagination.total = res.data.total;
  } catch (error) {
    ElMessage.error('加载失败');
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  loadUserList();
};

// 重置
const handleReset = () => {
  searchForm.keyword = '';
  searchForm.status = undefined;
  handleSearch();
};

// 新增
const handleAdd = () => {
  // 跳转到新增页面
  // router.push('/user/add');
};

// 查看详情
const handleView = (row: User) => {
  // router.push(`/user/detail/${row.id}`);
};

// 编辑
const handleEdit = (row: User) => {
  // router.push(`/user/edit/${row.id}`);
};

// 删除
const handleDelete = async (row: User) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户"${row.nickname}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    await deleteUser(row.id);
    ElMessage.success('删除成功');
    loadUserList();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning('请选择要删除的用户');
    return;
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUsers.value.length} 个用户吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    // 批量删除逻辑
    ElMessage.success('删除成功');
    loadUserList();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
    }
  }
};

// 选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection;
};

// 分页变化
const handlePageChange = (page: number) => {
  pagination.page = page;
  loadUserList();
};

const handleSizeChange = (size: number) => {
  pagination.pageSize = size;
  pagination.page = 1;
  loadUserList();
};

// 性别文本
const getGenderText = (gender: number) => {
  const map: Record<number, string> = { 0: '未知', 1: '男', 2: '女' };
  return map[gender] || '未知';
};

// 页面加载
onMounted(() => {
  loadUserList();
});
</script>

<style lang="scss" scoped>
.user-list-container {
  padding: 20px;

  .search-card,
  .toolbar-card,
  .table-card {
    margin-bottom: 20px;
  }

  .el-pagination {
    margin-top: 20px;
    justify-content: flex-end;
  }
}
</style>
```

---

### 3.2 用户详情页 (views/user/detail/index.vue)

#### 组件实现

```vue
<template>
  <div class="user-detail-container">
    <el-card v-loading="loading">
      <!-- 头部信息 -->
      <div class="header-section">
        <el-avatar :src="userInfo.avatar" :size="100" />
        <div class="info">
          <h2>{{ userInfo.nickname }}</h2>
          <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
            {{ userInfo.status === 1 ? '正常' : '已禁用' }}
          </el-tag>
        </div>
      </div>

      <!-- 详细信息 -->
      <el-descriptions :column="2" border class="detail-section">
        <el-descriptions-item label="用户ID">
          {{ userInfo.id }}
        </el-descriptions-item>
        <el-descriptions-item label="真实姓名">
          {{ userInfo.realName || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ userInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ userInfo.email || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ getGenderText(userInfo.gender) }}
        </el-descriptions-item>
        <el-descriptions-item label="生日">
          {{ userInfo.birthday || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="地址" :span="2">
          {{ userInfo.address || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ userInfo.createTime }}
        </el-descriptions-item>
        <el-descriptions-item label="最后登录">
          {{ userInfo.lastLoginTime }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 操作按钮 -->
      <div class="action-section">
        <el-button type="primary" :icon="Edit" @click="handleEdit">
          编辑信息
        </el-button>
        <el-button
          :type="userInfo.status === 1 ? 'danger' : 'success'"
          @click="handleToggleStatus"
        >
          {{ userInfo.status === 1 ? '禁用账号' : '启用账号' }}
        </el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Edit } from '@element-plus/icons-vue';
import { getUserDetail, toggleUserStatus } from '@/api/user';
import type { User } from '@/api/user';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const userInfo = ref<User>({} as User);

// 加载用户详情
const loadUserDetail = async () => {
  const userId = Number(route.params.id);
  loading.value = true;
  
  try {
    const res = await getUserDetail(userId);
    userInfo.value = res.data;
  } catch (error) {
    ElMessage.error('加载失败');
    setTimeout(() => router.back(), 1500);
  } finally {
    loading.value = false;
  }
};

// 编辑
const handleEdit = () => {
  router.push(`/user/edit/${userInfo.value.id}`);
};

// 切换状态
const handleToggleStatus = async () => {
  const newStatus = userInfo.value.status === 1 ? 0 : 1;
  const actionText = newStatus === 1 ? '启用' : '禁用';
  
  try {
    await ElMessageBox.confirm(
      `确定要${actionText}该用户吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );
    
    await toggleUserStatus(userInfo.value.id, newStatus);
    userInfo.value.status = newStatus;
    ElMessage.success(`${actionText}成功`);
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionText}失败`);
    }
  }
};

// 返回
const handleBack = () => {
  router.back();
};

// 性别文本
const getGenderText = (gender: number) => {
  const map: Record<number, string> = { 0: '未知', 1: '男', 2: '女' };
  return map[gender] || '未知';
};

onMounted(() => {
  loadUserDetail();
});
</script>

<style lang="scss" scoped>
.user-detail-container {
  padding: 20px;

  .header-section {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;

    .info {
      flex: 1;

      h2 {
        margin: 0 0 10px 0;
      }
    }
  }

  .detail-section {
    margin-bottom: 20px;
  }

  .action-section {
    padding-top: 20px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 10px;
  }
}
</style>
```

---

## 4. API 封装

### 4.1 API 定义 (api/user.ts)

```typescript
import request from '@/utils/service';

// 类型定义
export interface User {
  id: number;
  avatar: string;
  nickname: string;
  realName: string;
  phone: string;
  email: string;
  gender: 0 | 1 | 2;
  birthday: string;
  address: string;
  status: 0 | 1;
  createTime: string;
  updateTime: string;
  lastLoginTime: string;
}

export interface UserListParams {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: number;
}

export interface UserListResponse {
  list: User[];
  total: number;
  page: number;
  pageSize: number;
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return request<UserListResponse>({
    url: '/api/users',
    method: 'get',
    params
  });
};

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request<User>({
    url: `/api/users/${id}`,
    method: 'get'
  });
};

// 更新用户信息
export interface UpdateUserParams {
  id: number;
  nickname?: string;
  realName?: string;
  phone?: string;
  email?: string;
  gender?: number;
  birthday?: string;
  address?: string;
}

export const updateUser = (data: UpdateUserParams) => {
  const { id, ...params } = data;
  return request<User>({
    url: `/api/users/${id}`,
    method: 'put',
    data: params
  });
};

// 切换用户状态
export const toggleUserStatus = (id: number, status: number) => {
  return request<null>({
    url: `/api/users/${id}/status`,
    method: 'put',
    data: { status }
  });
};

// 删除用户
export const deleteUser = (id: number) => {
  return request<null>({
    url: `/api/users/${id}`,
    method: 'delete'
  });
};
```

---

## 5. 状态管理

### 5.1 用户 Store (store/modules/user.ts)

```typescript
import { defineStore } from 'pinia';
import type { User } from '@/api/user';

interface UserState {
  currentUser: User | null;
  userList: User[];
  total: number;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    currentUser: null,
    userList: [],
    total: 0
  }),

  getters: {
    hasUser: (state) => !!state.currentUser,
    userCount: (state) => state.total,
    activeUsers: (state) => state.userList.filter(u => u.status === 1)
  },

  actions: {
    setCurrentUser(user: User) {
      this.currentUser = user;
    },

    setUserList(list: User[], total: number) {
      this.userList = list;
      this.total = total;
    },

    updateUser(id: number, data: Partial<User>) {
      const index = this.userList.findIndex(u => u.id === id);
      if (index !== -1) {
        this.userList[index] = { ...this.userList[index], ...data };
      }
      if (this.currentUser?.id === id) {
        this.currentUser = { ...this.currentUser, ...data };
      }
    },

    removeUser(id: number) {
      this.userList = this.userList.filter(u => u.id !== id);
      this.total--;
    },

    reset() {
      this.currentUser = null;
      this.userList = [];
      this.total = 0;
    }
  }
});
```

---

## 6. 路由配置

### 6.1 路由定义 (router/router/user.ts)

```typescript
import type { RouteRecordRaw } from 'vue-router';

const userRoutes: RouteRecordRaw[] = [
  {
    path: '/user',
    name: 'User',
    meta: {
      title: '用户管理',
      icon: 'User'
    },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list/index.vue'),
        meta: {
          title: '用户列表',
          keepAlive: true
        }
      },
      {
        path: 'detail/:id',
        name: 'UserDetail',
        component: () => import('@/views/user/detail/index.vue'),
        meta: {
          title: '用户详情',
          hidden: true
        }
      },
      {
        path: 'edit/:id',
        name: 'UserEdit',
        component: () => import('@/views/user/edit/index.vue'),
        meta: {
          title: '编辑用户',
          hidden: true
        }
      }
    ]
  }
];

export default userRoutes;
```

---

## 7. 表单验证

### 7.1 验证规则

```typescript
// utils/validate.ts
export const validatePhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (!/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

export const validateEmail = (rule: any, value: string, callback: any) => {
  if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    callback(new Error('请输入正确的邮箱地址'));
  } else {
    callback();
  }
};

// 表单规则
export const userFormRules = {
  nickname: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度为2-20个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' }
  ],
  email: [
    { validator: validateEmail, trigger: 'blur' }
  ],
  realName: [
    { min: 2, max: 20, message: '真实姓名长度为2-20个字符', trigger: 'blur' }
  ]
};
```

---

## 8. 性能优化

### 8.1 列表优化

```typescript
// 虚拟滚动（大数据量）
import { ElTableV2 } from 'element-plus';

// 防抖搜索
import { debounce } from 'lodash-es';

const debouncedSearch = debounce(() => {
  loadUserList();
}, 300);

// 图片懒加载
<el-image :src="row.avatar" lazy />
```

### 8.2 路由懒加载

```typescript
// 使用动态 import
component: () => import('@/views/user/list/index.vue')
```

### 8.3 组件缓存

```vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" v-if="route.meta.keepAlive" />
  </keep-alive>
  <component :is="Component" v-if="!route.meta.keepAlive" />
</router-view>
```

---

## 9. 错误处理

### 9.1 统一错误处理

```typescript
// utils/service.ts
import axios from 'axios';
import { ElMessage } from 'element-plus';

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { code, data, message } = response.data;
    
    if (code === 200) {
      return data;
    } else {
      ElMessage.error(message || '请求失败');
      return Promise.reject(new Error(message));
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          ElMessage.error('未授权，请重新登录');
          // 跳转登录页
          break;
        case 403:
          ElMessage.error('拒绝访问');
          break;
        case 404:
          ElMessage.error('请求资源不存在');
          break;
        case 500:
          ElMessage.error('服务器错误');
          break;
        default:
          ElMessage.error(error.response.data.message || '请求失败');
      }
    } else {
      ElMessage.error('网络异常');
    }
    return Promise.reject(error);
  }
);

export default service;
```

---

## 10. 测试方案

### 10.1 单元测试

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UserList from '@/views/user/list/index.vue';

describe('UserList', () => {
  it('renders properly', () => {
    const wrapper = mount(UserList);
    expect(wrapper.find('.user-list-container').exists()).toBe(true);
  });

  it('calls loadUserList on mount', () => {
    // 测试逻辑
  });
});
```

---

## 11. 部署说明

### 11.1 环境配置

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

### 11.2 构建命令

```bash
# 开发环境
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

---

## 12. 相关文档

- [需求规格说明](../../spec/baixs/user_spec.md)
- [任务拆分](../../tasks/baixs/user_task.md)
- [基础架构](../infra.md)
- [Vue 3 Composition API](../../../comSkills/vue3-composition-api.md)
- [Pinia 状态管理](../../../comSkills/pinia.md)

