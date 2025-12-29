# Pinia 状态管理使用指南

## 1. 概述

Pinia 是 Vue 3 官方推荐的状态管理库，是 Vuex 的下一代版本，提供了更简洁的 API 和更好的 TypeScript 支持。

### 核心特性
- 🎯 **类型安全**: 完整的 TypeScript 支持
- 📦 **模块化**: 每个 Store 都是独立的模块
- 🔥 **热更新**: 支持开发时热更新
- 🛠 **开发工具**: Vue Devtools 支持
- 🚀 **轻量级**: 只有 ~1KB

---

## 2. 基础用法

### 2.1 安装和配置

```bash
# 安装
pnpm install pinia
```

```typescript
// main.ts
import { createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  
  app.use(pinia);
  
  return {
    app,
    pinia
  };
}
```

---

### 2.2 创建 Store

```typescript
// stores/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  // State
  state: () => ({
    count: 0,
    name: 'Counter'
  }),
  
  // Getters (计算属性)
  getters: {
    doubleCount: (state) => state.count * 2,
    
    // 访问其他 Getter
    doubleCountPlusOne(): number {
      return this.doubleCount + 1;
    }
  },
  
  // Actions (方法)
  actions: {
    increment() {
      this.count++;
    },
    
    decrement() {
      this.count--;
    },
    
    async fetchData() {
      try {
        const res = await uni.request({ url: '/api/data' });
        this.count = res.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
});
```

---

### 2.3 使用 Store

```vue
<template>
  <view class="container">
    <text>Count: {{ count }}</text>
    <text>Double: {{ doubleCount }}</text>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </view>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();

// 解构响应式状态（必须使用 storeToRefs）
const { count, doubleCount } = storeToRefs(counterStore);

// 解构方法（不需要 storeToRefs）
const { increment, decrement } = counterStore;

// 或直接使用
// counterStore.count
// counterStore.increment()
</script>
```

---

## 3. Setup Store 语法

### 3.1 基础示例

```typescript
// stores/user.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref('');
  const userInfo = ref<UserInfo | null>(null);
  const isLoggedIn = computed(() => !!token.value);
  
  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken;
    uni.setStorageSync('token', newToken);
  };
  
  const setUserInfo = (info: UserInfo) => {
    userInfo.value = info;
    uni.setStorageSync('userInfo', info);
  };
  
  const logout = () => {
    token.value = '';
    userInfo.value = null;
    uni.clearStorageSync();
  };
  
  // 初始化
  const init = () => {
    token.value = uni.getStorageSync('token') || '';
    userInfo.value = uni.getStorageSync('userInfo') || null;
  };
  
  return {
    // State
    token,
    userInfo,
    isLoggedIn,
    // Actions
    setToken,
    setUserInfo,
    logout,
    init
  };
});
```

---

## 4. 实战示例

### 4.1 用户认证 Store

```typescript
// stores/auth.ts
import { defineStore } from 'pinia';
import { login, getUserInfo } from '@/api/auth';

interface AuthState {
  token: string;
  userInfo: UserInfo | null;
  loading: boolean;
}

interface UserInfo {
  id: number;
  username: string;
  avatar: string;
  role: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null,
    loading: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    
    isAdmin: (state) => state.userInfo?.role === 'admin',
    
    username: (state) => state.userInfo?.username || '游客'
  },
  
  actions: {
    // 登录
    async login(username: string, password: string) {
      this.loading = true;
      
      try {
        const res = await login({ username, password });
        this.token = res.data.token;
        
        // 持久化存储
        uni.setStorageSync('token', this.token);
        
        // 获取用户信息
        await this.fetchUserInfo();
        
        uni.showToast({ title: '登录成功', icon: 'success' });
        return true;
      } catch (error) {
        uni.showToast({ title: '登录失败', icon: 'none' });
        return false;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取用户信息
    async fetchUserInfo() {
      try {
        const res = await getUserInfo();
        this.userInfo = res.data;
        uni.setStorageSync('userInfo', this.userInfo);
      } catch (error) {
        console.error('获取用户信息失败', error);
      }
    },
    
    // 登出
    logout() {
      this.token = '';
      this.userInfo = null;
      
      // 清除存储
      uni.removeStorageSync('token');
      uni.removeStorageSync('userInfo');
      
      // 跳转登录页
      uni.reLaunch({ url: '/pages/login/index' });
    },
    
    // 更新用户信息
    updateUserInfo(info: Partial<UserInfo>) {
      if (this.userInfo) {
        this.userInfo = { ...this.userInfo, ...info };
        uni.setStorageSync('userInfo', this.userInfo);
      }
    }
  }
});
```

---

### 4.2 购物车 Store

```typescript
// stores/cart.ts
import { defineStore } from 'pinia';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: uni.getStorageSync('cart') || []
  }),
  
  getters: {
    // 总数量
    totalCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },
    
    // 总价格
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    },
    
    // 是否为空
    isEmpty: (state) => state.items.length === 0
  },
  
  actions: {
    // 添加商品
    addItem(product: Omit<CartItem, 'quantity'>) {
      const existItem = this.items.find(item => item.id === product.id);
      
      if (existItem) {
        existItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
      
      this.saveToStorage();
      uni.showToast({ title: '已添加到购物车', icon: 'success' });
    },
    
    // 移除商品
    removeItem(id: number) {
      this.items = this.items.filter(item => item.id !== id);
      this.saveToStorage();
    },
    
    // 更新数量
    updateQuantity(id: number, quantity: number) {
      const item = this.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          this.removeItem(id);
        } else {
          item.quantity = quantity;
          this.saveToStorage();
        }
      }
    },
    
    // 清空购物车
    clear() {
      this.items = [];
      this.saveToStorage();
    },
    
    // 保存到本地
    saveToStorage() {
      uni.setStorageSync('cart', this.items);
    }
  }
});
```

---

### 4.3 列表缓存 Store

```typescript
// stores/list.ts
import { defineStore } from 'pinia';

interface ListState<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  loading: boolean;
  hasMore: boolean;
}

export const useListStore = defineStore('list', {
  state: (): ListState<any> => ({
    data: [],
    page: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    hasMore: true
  }),
  
  actions: {
    // 设置列表数据
    setList(list: any[], total: number, append = false) {
      if (append) {
        this.data.push(...list);
      } else {
        this.data = list;
      }
      
      this.total = total;
      this.hasMore = this.data.length < total;
    },
    
    // 加载数据
    async loadData(fetchFn: (page: number, pageSize: number) => Promise<any>, reset = false) {
      if (this.loading) return;
      
      if (reset) {
        this.page = 1;
        this.data = [];
      }
      
      this.loading = true;
      
      try {
        const res = await fetchFn(this.page, this.pageSize);
        this.setList(res.data.list, res.data.total, !reset);
        this.page++;
      } catch (error) {
        uni.showToast({ title: '加载失败', icon: 'none' });
      } finally {
        this.loading = false;
      }
    },
    
    // 刷新
    async refresh(fetchFn: (page: number, pageSize: number) => Promise<any>) {
      await this.loadData(fetchFn, true);
    },
    
    // 加载更多
    async loadMore(fetchFn: (page: number, pageSize: number) => Promise<any>) {
      if (this.hasMore && !this.loading) {
        await this.loadData(fetchFn, false);
      }
    },
    
    // 重置
    reset() {
      this.data = [];
      this.page = 1;
      this.total = 0;
      this.hasMore = true;
    }
  }
});
```

---

## 5. Store 组合

### 5.1 在 Store 中使用其他 Store

```typescript
// stores/order.ts
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';
import { useCartStore } from './cart';

export const useOrderStore = defineStore('order', {
  actions: {
    async createOrder() {
      const authStore = useAuthStore();
      const cartStore = useCartStore();
      
      // 检查登录状态
      if (!authStore.isLoggedIn) {
        uni.showToast({ title: '请先登录', icon: 'none' });
        return;
      }
      
      // 检查购物车
      if (cartStore.isEmpty) {
        uni.showToast({ title: '购物车为空', icon: 'none' });
        return;
      }
      
      try {
        // 创建订单逻辑
        const res = await createOrderApi({
          items: cartStore.items,
          totalPrice: cartStore.totalPrice
        });
        
        // 清空购物车
        cartStore.clear();
        
        uni.showToast({ title: '下单成功', icon: 'success' });
        return res.data;
      } catch (error) {
        uni.showToast({ title: '下单失败', icon: 'none' });
      }
    }
  }
});
```

---

## 6. 持久化

### 6.1 手动持久化

```typescript
// stores/settings.ts
import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: uni.getStorageSync('theme') || 'light',
    language: uni.getStorageSync('language') || 'zh-CN'
  }),
  
  actions: {
    setTheme(theme: string) {
      this.theme = theme;
      uni.setStorageSync('theme', theme);
    },
    
    setLanguage(language: string) {
      this.language = language;
      uni.setStorageSync('language', language);
    }
  }
});
```

---

### 6.2 使用插件持久化

```typescript
// stores/index.ts
import { createPinia } from 'pinia';

// 持久化插件
const piniaPersistedState = (context: any) => {
  const { store } = context;
  
  // 从本地存储恢复
  const storageData = uni.getStorageSync(store.$id);
  if (storageData) {
    store.$patch(storageData);
  }
  
  // 监听状态变化并保存
  store.$subscribe(() => {
    uni.setStorageSync(store.$id, store.$state);
  });
};

const pinia = createPinia();
pinia.use(piniaPersistedState);

export default pinia;
```

---

## 7. 最佳实践

### 7.1 命名规范

```typescript
// ✅ 推荐：use 开头 + 名称 + Store 结尾
export const useUserStore = defineStore('user', { });
export const useCartStore = defineStore('cart', { });

// ❌ 不推荐
export const user = defineStore('user', { });
export const UserStore = defineStore('user', { });
```

### 7.2 模块化组织

```
stores/
├── index.ts          # Pinia 实例
├── auth.ts           # 认证相关
├── user.ts           # 用户相关
├── cart.ts           # 购物车相关
└── modules/          # 业务模块
    ├── product.ts
    └── order.ts
```

### 7.3 TypeScript 类型定义

```typescript
// types/store.ts
export interface UserInfo {
  id: number;
  username: string;
  avatar: string;
}

export interface AuthState {
  token: string;
  userInfo: UserInfo | null;
}

// stores/auth.ts
import type { AuthState, UserInfo } from '@/types/store';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: '',
    userInfo: null
  })
});
```

---

## 8. 常见问题

### Q1: 何时使用 storeToRefs？
**A**: 解构 state 和 getters 时使用，解构 actions 不需要。

```typescript
import { storeToRefs } from 'pinia';

const store = useCounterStore();

// ✅ 解构 state 和 getters
const { count, doubleCount } = storeToRefs(store);

// ✅ 解构 actions
const { increment } = store;

// ❌ actions 不要用 storeToRefs
const { increment } = storeToRefs(store); // 错误！
```

### Q2: 如何重置 Store？
**A**: 使用 `$reset()` 方法：

```typescript
const store = useCounterStore();
store.$reset(); // 重置到初始状态
```

### Q3: 如何监听 Store 变化？
**A**: 使用 `$subscribe()` 方法：

```typescript
const store = useCounterStore();

store.$subscribe((mutation, state) => {
  console.log('Store 变化了', state);
});
```

---

## 9. 参考资料

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Pinia 中文文档](https://pinia.vuejs.org/zh/)
- [Vue 3 状态管理](https://vuejs.org/guide/scaling-up/state-management.html)

