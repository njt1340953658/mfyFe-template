# 用户管理模块 - 技术方案

## 1. 方案概述

本文档详细说明用户管理模块的技术实现方案，包括页面组件设计、状态管理、API 封装、数据流转等核心技术细节。

---

## 2. 技术栈

- **框架**: Vue 3 Composition API
- **跨端方案**: UniApp 3.0+
- **状态管理**: Pinia
- **类型系统**: TypeScript
- **HTTP 请求**: uni.request 封装
- **样式方案**: SCSS

---

## 3. 页面组件设计

### 3.1 用户列表页 (subPages/user/list/index.vue)

#### 组件结构

```vue
<template>
  <view class="user-list-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <input 
        v-model="searchKeyword" 
        placeholder="搜索用户昵称或手机号"
        @input="handleSearch"
      />
    </view>

    <!-- 用户列表 -->
    <scroll-view
      scroll-y
      class="list-container"
      @scrolltolower="loadMore"
      @refresherpull="handleRefresh"
      :refresher-enabled="true"
      :refresher-triggered="isRefreshing"
    >
      <view 
        v-for="user in userList" 
        :key="user.id" 
        class="user-item"
        @click="goToDetail(user.id)"
      >
        <image :src="user.avatar" class="avatar" />
        <view class="info">
          <text class="nickname">{{ user.nickname }}</text>
          <text class="phone">{{ user.phone }}</text>
        </view>
        <view :class="['status', user.status === 1 ? 'active' : 'disabled']">
          {{ user.status === 1 ? '正常' : '禁用' }}
        </view>
      </view>

      <!-- 加载状态 -->
      <view class="loading-more" v-if="hasMore">
        <text>加载中...</text>
      </view>
      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { getUserList } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { debounce } from '@/utils/utilsTool';

interface User {
  id: number;
  avatar: string;
  nickname: string;
  phone: string;
  status: number;
}

// 状态定义
const userList = ref<User[]>([]);
const searchKeyword = ref('');
const page = ref(1);
const pageSize = ref(20);
const hasMore = ref(true);
const isRefreshing = ref(false);
const loading = ref(false);

// 加载用户列表
const loadUserList = async (reset = false) => {
  if (loading.value) return;
  
  if (reset) {
    page.value = 1;
    userList.value = [];
    hasMore.value = true;
  }

  try {
    loading.value = true;
    uni.showLoading({ title: '加载中...' });

    const res = await getUserList({
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    });

    if (reset) {
      userList.value = res.data.list;
    } else {
      userList.value.push(...res.data.list);
    }

    hasMore.value = res.data.hasMore;
    page.value++;
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    loading.value = false;
    uni.hideLoading();
  }
};

// 搜索处理（防抖）
const handleSearch = debounce(() => {
  loadUserList(true);
}, 500);

// 下拉刷新
const handleRefresh = async () => {
  isRefreshing.value = true;
  await loadUserList(true);
  isRefreshing.value = false;
};

// 加载更多
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    loadUserList();
  }
};

// 跳转详情
const goToDetail = (id: number) => {
  uni.navigateTo({
    url: `/subPages/user/detail/index?id=${id}`
  });
};

// 页面加载
onMounted(() => {
  loadUserList(true);
});

// UniApp 生命周期
onPullDownRefresh(async () => {
  await loadUserList(true);
  uni.stopPullDownRefresh();
});

onReachBottom(() => {
  loadMore();
});
</script>

<style lang="scss" scoped>
.user-list-page {
  height: 100vh;
  background: #f5f5f5;

  .search-bar {
    padding: 20rpx 30rpx;
    background: #fff;

    input {
      height: 70rpx;
      padding: 0 30rpx;
      background: #f5f5f5;
      border-radius: 35rpx;
      font-size: 28rpx;
    }
  }

  .list-container {
    height: calc(100vh - 110rpx);

    .user-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      margin: 20rpx 30rpx;
      background: #fff;
      border-radius: 16rpx;

      .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      .info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .nickname {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 10rpx;
        }

        .phone {
          font-size: 24rpx;
          color: #888;
        }
      }

      .status {
        padding: 10rpx 20rpx;
        border-radius: 8rpx;
        font-size: 24rpx;

        &.active {
          background: #e7f7ef;
          color: #07C160;
        }

        &.disabled {
          background: #f5f5f5;
          color: #999;
        }
      }
    }

    .loading-more,
    .no-more {
      text-align: center;
      padding: 30rpx;
      color: #999;
      font-size: 24rpx;
    }
  }
}
</style>
```

---

### 3.2 用户详情页 (subPages/user/detail/index.vue)

#### 组件实现

```vue
<template>
  <view class="user-detail-page">
    <view class="header">
      <image :src="userInfo.avatar" class="avatar" />
      <text class="nickname">{{ userInfo.nickname }}</text>
      <view :class="['status-badge', userInfo.status === 1 ? 'active' : 'disabled']">
        {{ userInfo.status === 1 ? '正常' : '已禁用' }}
      </view>
    </view>

    <view class="info-section">
      <view class="info-item">
        <text class="label">真实姓名</text>
        <text class="value">{{ userInfo.realName || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">手机号</text>
        <text class="value">{{ userInfo.phone }}</text>
      </view>
      <view class="info-item">
        <text class="label">邮箱</text>
        <text class="value">{{ userInfo.email || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">性别</text>
        <text class="value">{{ getGenderText(userInfo.gender) }}</text>
      </view>
      <view class="info-item">
        <text class="label">生日</text>
        <text class="value">{{ userInfo.birthday || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">地址</text>
        <text class="value">{{ userInfo.address || '-' }}</text>
      </view>
      <view class="info-item">
        <text class="label">注册时间</text>
        <text class="value">{{ userInfo.createTime }}</text>
      </view>
      <view class="info-item">
        <text class="label">最后登录</text>
        <text class="value">{{ userInfo.lastLoginTime }}</text>
      </view>
    </view>

    <view class="action-buttons">
      <button class="btn-primary" @click="goToEdit">编辑信息</button>
      <button 
        :class="['btn-secondary', userInfo.status === 1 ? 'warn' : 'success']"
        @click="toggleStatus"
      >
        {{ userInfo.status === 1 ? '禁用账号' : '启用账号' }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onLoad } from '@dcloudio/uni-app';
import { getUserDetail, toggleUserStatus } from '@/api/user';

interface UserDetail {
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
  lastLoginTime: string;
}

const userInfo = ref<UserDetail>({} as UserDetail);
const userId = ref(0);

// 获取性别文本
const getGenderText = (gender: number) => {
  const map = { 0: '未知', 1: '男', 2: '女' };
  return map[gender as 0 | 1 | 2] || '未知';
};

// 加载用户详情
const loadUserDetail = async () => {
  try {
    uni.showLoading({ title: '加载中...' });
    const res = await getUserDetail(userId.value);
    userInfo.value = res.data;
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' });
    setTimeout(() => uni.navigateBack(), 1500);
  } finally {
    uni.hideLoading();
  }
};

// 跳转编辑页
const goToEdit = () => {
  uni.navigateTo({
    url: `/subPages/user/edit/index?id=${userId.value}`
  });
};

// 切换状态
const toggleStatus = async () => {
  const newStatus = userInfo.value.status === 1 ? 0 : 1;
  const actionText = newStatus === 1 ? '启用' : '禁用';

  uni.showModal({
    title: '确认操作',
    content: `确定要${actionText}该用户吗？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '处理中...' });
          await toggleUserStatus(userId.value, newStatus);
          userInfo.value.status = newStatus;
          uni.showToast({ title: `${actionText}成功`, icon: 'success' });
        } catch (error) {
          uni.showToast({ title: `${actionText}失败`, icon: 'none' });
        } finally {
          uni.hideLoading();
        }
      }
    }
  });
};

// 页面加载
onLoad((options) => {
  userId.value = Number(options?.id);
  if (userId.value) {
    loadUserDetail();
  }
});
</script>

<style lang="scss" scoped>
.user-detail-page {
  min-height: 100vh;
  background: #f5f5f5;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 30rpx;
    background: #fff;

    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      margin-bottom: 20rpx;
    }

    .nickname {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .status-badge {
      padding: 10rpx 30rpx;
      border-radius: 30rpx;
      font-size: 24rpx;

      &.active {
        background: #e7f7ef;
        color: #07C160;
      }

      &.disabled {
        background: #f5f5f5;
        color: #999;
      }
    }
  }

  .info-section {
    margin: 20rpx 30rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;

    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 30rpx;
      border-bottom: 1rpx solid #f5f5f5;

      &:last-child {
        border-bottom: none;
      }

      .label {
        font-size: 28rpx;
        color: #666;
      }

      .value {
        font-size: 28rpx;
        color: #333;
      }
    }
  }

  .action-buttons {
    padding: 30rpx;

    button {
      width: 100%;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 44rpx;
      font-size: 32rpx;
      margin-bottom: 20rpx;

      &.btn-primary {
        background: #07C160;
        color: #fff;
      }

      &.btn-secondary {
        background: #fff;
        border: 1rpx solid #ddd;

        &.warn {
          color: #FA5151;
          border-color: #FA5151;
        }

        &.success {
          color: #07C160;
          border-color: #07C160;
        }
      }
    }
  }
}
</style>
```

---

## 4. API 封装

### 4.1 API 定义 (api/user.ts)

```typescript
import { request } from '@/utils/request';

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
  hasMore: boolean;
}

// 获取用户列表
export const getUserList = (params: UserListParams) => {
  return request<{ code: number; data: UserListResponse }>({
    url: '/api/users',
    method: 'GET',
    data: params
  });
};

// 获取用户详情
export const getUserDetail = (id: number) => {
  return request<{ code: number; data: User }>({
    url: `/api/users/${id}`,
    method: 'GET'
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

export const updateUser = (params: UpdateUserParams) => {
  const { id, ...data } = params;
  return request<{ code: number; data: User }>({
    url: `/api/users/${id}`,
    method: 'PUT',
    data
  });
};

// 切换用户状态
export const toggleUserStatus = (id: number, status: number) => {
  return request<{ code: number; data: null }>({
    url: `/api/users/${id}/status`,
    method: 'PUT',
    data: { status }
  });
};

// 删除用户
export const deleteUser = (id: number) => {
  return request<{ code: number; data: null }>({
    url: `/api/users/${id}`,
    method: 'DELETE'
  });
};
```

---

## 5. 工具函数封装

### 5.1 请求封装 (utils/request.ts)

```typescript
import { useCachingStore } from '@/stores/caching';

interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: any;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const request = <T = any>(config: RequestConfig): Promise<T> => {
  const cachingStore = useCachingStore();
  const token = cachingStore.token;

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + config.url,
      method: config.method || 'GET',
      data: config.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...config.header
      },
      success: (res: any) => {
        if (res.statusCode === 200) {
          const data = res.data;
          if (data.code === 200 || data.code === 0) {
            resolve(data as T);
          } else {
            uni.showToast({
              title: data.message || '请求失败',
              icon: 'none'
            });
            reject(data);
          }
        } else if (res.statusCode === 401) {
          // Token 过期，清除缓存并跳转登录
          cachingStore.clearCache();
          uni.navigateTo({ url: '/pages/login/index' });
          reject(res);
        } else {
          uni.showToast({
            title: '请求失败',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络异常',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};
```

### 5.2 工具函数 (utils/utilsTool.ts)

```typescript
// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let previous = 0;
  
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - previous > wait) {
      func.apply(this, args);
      previous = now;
    }
  };
};

// 手机号脱敏
export const maskPhone = (phone: string): string => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 时间格式化
export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};
```

---

## 6. 状态管理

### 6.1 用户 Store (stores/user.ts)

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
    userCount: (state) => state.total
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
    }
  }
});
```

---

## 7. 性能优化

### 7.1 列表优化
- **虚拟滚动**: 大数据量使用 `<recycle-view>` 组件
- **图片懒加载**: 使用 `<image lazy-load>` 属性
- **分页加载**: 每页20条，避免一次加载过多

### 7.2 请求优化
- **防抖处理**: 搜索框输入防抖500ms
- **请求取消**: 切换页面时取消未完成的请求
- **数据缓存**: 使用 Pinia 缓存列表数据

### 7.3 包体积优化
- **按需引入**: 仅引入使用的组件
- **图片压缩**: 使用 WebP 格式，控制大小
- **代码分包**: 用户模块放入 subPackages

---

## 8. 错误处理

### 8.1 网络错误
```typescript
// 全局错误处理
const handleNetworkError = (error: any) => {
  if (!error.statusCode) {
    // 网络断开
    uni.showToast({
      title: '网络连接失败，请检查网络',
      icon: 'none'
    });
  } else if (error.statusCode === 401) {
    // 未授权
    uni.navigateTo({ url: '/pages/login/index' });
  } else if (error.statusCode === 403) {
    // 无权限
    uni.showToast({
      title: '无权限访问',
      icon: 'none'
    });
  } else {
    // 其他错误
    uni.showToast({
      title: error.message || '请求失败',
      icon: 'none'
    });
  }
};
```

### 8.2 表单验证
```typescript
// 表单验证规则
const validateForm = (data: UpdateUserParams): string | null => {
  if (!data.nickname || data.nickname.trim().length < 2) {
    return '昵称至少2个字符';
  }
  if (data.nickname.length > 20) {
    return '昵称最多20个字符';
  }
  if (!/^1[3-9]\d{9}$/.test(data.phone)) {
    return '手机号格式不正确';
  }
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return '邮箱格式不正确';
  }
  return null;
};
```

---

## 9. 测试方案

### 9.1 单元测试
```typescript
// 测试工具函数
describe('utilsTool', () => {
  test('maskPhone should mask middle 4 digits', () => {
    expect(maskPhone('13812345678')).toBe('138****5678');
  });

  test('debounce should delay execution', (done) => {
    let count = 0;
    const fn = debounce(() => count++, 100);
    
    fn();
    fn();
    fn();
    
    setTimeout(() => {
      expect(count).toBe(1);
      done();
    }, 150);
  });
});
```

### 9.2 集成测试
- 测试列表加载和分页
- 测试搜索功能
- 测试编辑提交流程
- 测试状态切换

---

## 10. 部署说明

### 10.1 环境配置

```bash
# .env.development
VITE_API_BASE_URL=https://dev-api.example.com

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

### 10.2 构建命令

```bash
# 开发环境
npm run dev

# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod
```

---

## 11. 相关文档

- [需求规格说明](../../spec/baixs/user_spec.md)
- [任务拆分](../../tasks/baixs/user_task.md)
- [基础架构](../infra.md)

