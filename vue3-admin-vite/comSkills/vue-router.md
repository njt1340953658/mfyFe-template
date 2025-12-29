# Vue Router 4 使用指南

## 1. 概述

Vue Router 是 Vue.js 的官方路由管理器，Vue Router 4 专为 Vue 3 设计，提供了更好的 TypeScript 支持和 Composition API 集成。

### 核心特性
- 🎯 **嵌套路由**: 支持多层嵌套的路由配置
- 🔐 **导航守卫**: 完善的路由拦截和权限控制
- 📦 **懒加载**: 按需加载路由组件
- 💾 **路由缓存**: KeepAlive 组件缓存
- 🔄 **动态路由**: 运行时添加路由

---

## 2. 基础配置

### 2.1 安装

```bash
pnpm install vue-router@4
```

### 2.2 创建路由实例

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'Dashboard'
    }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
```

### 2.3 在应用中使用

```typescript
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.mount('#app');
```

---

## 3. 路由配置

### 3.1 基础路由

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true  // 不在菜单中显示
    }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user/index.vue'),
    meta: {
      title: '用户管理',
      icon: 'User',
      requiresAuth: true  // 需要登录
    }
  }
];
```

---

### 3.2 嵌套路由

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    component: Layout,  // 布局组件
    meta: {
      title: '系统管理',
      icon: 'Setting'
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User'
        }
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'UserFilled'
        }
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'Menu'
        }
      }
    ]
  }
];
```

---

### 3.3 动态路由参数

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/user/:id',
    name: 'UserDetail',
    component: () => import('@/views/user/detail.vue'),
    meta: {
      title: '用户详情'
    }
  },
  // 可选参数
  {
    path: '/post/:id?',
    name: 'Post',
    component: () => import('@/views/post/index.vue')
  },
  // 匹配多个参数
  {
    path: '/article/:year/:month',
    name: 'Article',
    component: () => import('@/views/article/index.vue')
  }
];
```

---

### 3.4 路由懒加载

```typescript
// 基础懒加载
component: () => import('@/views/dashboard/index.vue')

// 分块懒加载（相同 chunk name 会打包在一起）
component: () => import(/* webpackChunkName: "user" */ '@/views/user/list.vue')

// 预加载（会在浏览器空闲时预加载）
component: () => import(/* webpackPrefetch: true */ '@/views/about.vue')
```

---

## 4. 路由导航

### 4.1 声明式导航

```vue
<template>
  <!-- 字符串路径 -->
  <router-link to="/dashboard">仪表盘</router-link>
  
  <!-- 命名路由 -->
  <router-link :to="{ name: 'Dashboard' }">仪表盘</router-link>
  
  <!-- 带参数 -->
  <router-link :to="{ name: 'UserDetail', params: { id: 123 } }">
    用户详情
  </router-link>
  
  <!-- 带查询参数 -->
  <router-link :to="{ path: '/search', query: { q: 'vue' } }">
    搜索
  </router-link>
  
  <!-- 使用插槽自定义样式 -->
  <router-link to="/about" custom v-slot="{ navigate, isActive }">
    <button @click="navigate" :class="{ active: isActive }">
      关于我们
    </button>
  </router-link>
</template>
```

---

### 4.2 编程式导航

```typescript
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 导航到不同的位置
router.push('/dashboard');
router.push({ path: '/dashboard' });
router.push({ name: 'Dashboard' });
router.push({ name: 'UserDetail', params: { id: 123 } });
router.push({ path: '/search', query: { q: 'vue' } });

// 替换当前位置（不会留下历史记录）
router.replace('/dashboard');

// 前进/后退
router.go(1);   // 前进一步
router.go(-1);  // 后退一步
router.back();  // 后退
router.forward(); // 前进

// 获取当前路由信息
console.log(route.path);      // /user/123
console.log(route.params);    // { id: '123' }
console.log(route.query);     // { q: 'vue' }
console.log(route.name);      // 'UserDetail'
console.log(route.meta);      // { title: '用户详情' }
```

---

## 5. 导航守卫

### 5.1 全局前置守卫

```typescript
// router/index.ts
import { useUserStore } from '@/store/modules/user';

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || '管理系统';
  
  // 白名单
  const whiteList = ['/login', '/404', '/401'];
  
  const userStore = useUserStore();
  
  if (userStore.token) {
    // 已登录
    if (to.path === '/login') {
      // 已登录跳转首页
      next({ path: '/' });
    } else {
      // 检查是否有用户信息
      if (userStore.hasUserInfo) {
        next();
      } else {
        try {
          // 获取用户信息
          await userStore.getUserInfo();
          next();
        } catch (error) {
          // 获取失败，清除 token 并跳转登录页
          await userStore.logout();
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});
```

---

### 5.2 全局后置守卫

```typescript
router.afterEach((to, from) => {
  // 停止加载进度条
  NProgress.done();
  
  // 页面埋点统计
  trackPageView(to.path);
});
```

---

### 5.3 路由独享守卫

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/index.vue'),
    beforeEnter: (to, from, next) => {
      const userStore = useUserStore();
      if (userStore.isAdmin) {
        next();
      } else {
        next('/403');
      }
    }
  }
];
```

---

### 5.4 组件内守卫

```vue
<script setup lang="ts">
import { onBeforeRouteEnter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router';

// 进入路由前（setup 中无法访问 this）
onBeforeRouteEnter((to, from) => {
  console.log('进入路由前');
});

// 路由更新时（参数变化）
onBeforeRouteUpdate((to, from) => {
  console.log('路由更新');
  // 例如：从 /user/1 到 /user/2
  loadUserData(to.params.id);
});

// 离开路由前
onBeforeRouteLeave((to, from) => {
  const answer = window.confirm('确定要离开吗？未保存的更改将丢失');
  if (!answer) return false;
});
</script>
```

---

## 6. 路由元信息

### 6.1 定义元信息

```typescript
// 扩展元信息类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    icon?: string;
    requiresAuth?: boolean;
    roles?: string[];
    keepAlive?: boolean;
    hidden?: boolean;
    affix?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      icon: 'Dashboard',
      requiresAuth: true,
      keepAlive: true,
      affix: true  // 固定在 TagsView
    }
  }
];
```

---

### 6.2 使用元信息

```typescript
// 权限校验
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 需要登录
    const userStore = useUserStore();
    if (userStore.token) {
      // 角色校验
      if (to.meta.roles) {
        if (to.meta.roles.includes(userStore.role)) {
          next();
        } else {
          next('/403');
        }
      } else {
        next();
      }
    } else {
      next('/login');
    }
  } else {
    next();
  }
});
```

---

## 7. 动态路由

### 7.1 添加路由

```typescript
// 动态添加路由
const newRoute: RouteRecordRaw = {
  path: '/dynamic',
  name: 'Dynamic',
  component: () => import('@/views/dynamic/index.vue'),
  meta: {
    title: '动态路由'
  }
};

router.addRoute(newRoute);

// 添加到指定父路由下
router.addRoute('ParentName', {
  path: 'child',
  name: 'Child',
  component: () => import('@/views/child/index.vue')
});
```

---

### 7.2 删除路由

```typescript
// 通过名称删除
router.removeRoute('RouteName');

// 通过添加同名路由覆盖
router.addRoute({ path: '/about', name: 'about', component: About });
router.addRoute({ path: '/other', name: 'about', component: Other }); // 覆盖
```

---

### 7.3 检查路由

```typescript
// 检查路由是否存在
router.hasRoute('RouteName');

// 获取所有路由
router.getRoutes();
```

---

## 8. 路由缓存 (KeepAlive)

### 8.1 基础用法

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="route.meta.keepAlive" />
    </keep-alive>
    <component :is="Component" v-if="!route.meta.keepAlive" />
  </router-view>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>
```

---

### 8.2 动态缓存控制

```vue
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useTagsViewStore } from '@/store/modules/tagsView';

const route = useRoute();
const tagsViewStore = useTagsViewStore();

// 缓存的视图列表
const cachedViews = computed(() => tagsViewStore.cachedViews);
</script>
```

---

### 8.3 组件内控制缓存

```vue
<script setup lang="ts">
import { onActivated, onDeactivated } from 'vue';

// 缓存组件激活时
onActivated(() => {
  console.log('组件被激活');
  // 刷新数据
  refreshData();
});

// 缓存组件停用时
onDeactivated(() => {
  console.log('组件被停用');
});
</script>
```

---

## 9. 路由过渡动画

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition as string || 'fade'" mode="out-in">
      <keep-alive>
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s;
}

.slide-left-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
```

---

## 10. 最佳实践

### 10.1 路由文件组织

```
router/
├── index.ts              # 路由主文件
├── interface/            # 类型定义
│   └── async-route.ts
├── router/               # 路由配置
│   ├── dashboard.ts
│   ├── user.ts
│   ├── system.ts
│   └── ...
└── RouterLogic.ts        # 路由逻辑处理
```

---

### 10.2 权限路由设计

```typescript
// router/RouterLogic.ts
import { useUserStore } from '@/store/modules/user';
import { usePermissionStore } from '@/store/modules/permission';

export const setupPermissionRoutes = async () => {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  
  // 获取用户信息和权限
  await userStore.getUserInfo();
  
  // 根据权限生成路由
  const accessRoutes = await permissionStore.generateRoutes(userStore.roles);
  
  // 动态添加路由
  accessRoutes.forEach(route => {
    router.addRoute(route);
  });
};
```

---

### 10.3 路由懒加载策略

```typescript
// ✅ 推荐：按功能模块分组
const userRoutes = () => import(/* webpackChunkName: "user" */ './modules/user');
const systemRoutes = () => import(/* webpackChunkName: "system" */ './modules/system');

// ✅ 推荐：预加载关键路由
const dashboard = () => import(/* webpackPrefetch: true */ '@/views/dashboard/index.vue');

// ❌ 不推荐：全部打包在一起
import Dashboard from '@/views/dashboard/index.vue';
```

---

## 11. 常见问题

### Q1: 路由跳转后页面不刷新？
**A**: 使用 `:key="route.fullPath"` 强制刷新组件

```vue
<router-view :key="route.fullPath" />
```

### Q2: 如何实现面包屑导航？
**A**: 使用 `route.matched` 获取匹配的路由记录

```typescript
const breadcrumbs = computed(() => {
  return route.matched.filter(item => item.meta?.title);
});
```

### Q3: 如何处理404页面？
**A**: 在路由配置末尾添加通配符路由

```typescript
{
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('@/views/error/404.vue')
}
```

---

## 12. 参考资料

- [Vue Router 官方文档](https://router.vuejs.org/)
- [Vue Router 迁移指南（Vue Router 3 → 4）](https://router.vuejs.org/guide/migration/)
- [Vue 3 官方文档](https://vuejs.org/)

