# Vue 3 Composition API 使用指南

## 1. 概述

Vue 3 Composition API 是 Vue 3 引入的全新 API 风格，提供了更灵活的逻辑组织和代码复用方式。

### 核心特性
- 📦 **更好的逻辑复用**: 通过组合函数（Composables）实现
- 🎯 **更好的类型推导**: 对 TypeScript 更友好
- 🔧 **更灵活的代码组织**: 按功能组织代码，而非选项
- 🚀 **更小的打包体积**: Tree-shaking 友好

---

## 2. Script Setup 语法

### 2.1 基础用法

```vue
<template>
  <view class="container">
    <text>{{ message }}</text>
    <button @click="increment">点击次数: {{ count }}</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 响应式数据
const message = ref('Hello Vue 3');
const count = ref(0);

// 方法
const increment = () => {
  count.value++;
};
</script>
```

### 2.2 优势
- ✅ 更少的样板代码
- ✅ 自动暴露变量和函数到模板
- ✅ 更好的类型推导
- ✅ 更好的 IDE 支持

---

## 3. 响应式 API

### 3.1 ref()

用于创建基本类型的响应式数据。

```typescript
import { ref } from 'vue';

// 创建响应式引用
const count = ref(0);
const message = ref('Hello');
const isActive = ref(false);

// 访问值需要 .value
console.log(count.value); // 0

// 修改值
count.value++;
message.value = 'Hi';
isActive.value = true;

// 在模板中自动解包
// <template>
//   <text>{{ count }}</text>  <!-- 不需要 .value -->
// </template>
```

#### 类型定义
```typescript
interface User {
  id: number;
  name: string;
}

// 方式一：自动推导
const count = ref(0); // Ref<number>

// 方式二：显式指定
const user = ref<User | null>(null);
```

---

### 3.2 reactive()

用于创建对象类型的响应式数据。

```typescript
import { reactive } from 'vue';

// 创建响应式对象
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'Alice',
    age: 25
  }
});

// 直接访问和修改
console.log(state.count); // 0
state.count++;
state.user.name = 'Bob';
```

#### ref vs reactive

| 特性 | ref | reactive |
|------|-----|----------|
| 适用类型 | 基本类型 + 对象 | 仅对象 |
| 访问方式 | `.value` | 直接访问 |
| 替换整个对象 | ✅ 支持 | ❌ 不支持 |
| 解构 | ❌ 失去响应性 | ❌ 失去响应性 |

```typescript
// ref 可以替换整个对象
const user = ref({ name: 'Alice' });
user.value = { name: 'Bob' }; // ✅

// reactive 不能替换整个对象
const state = reactive({ name: 'Alice' });
state = { name: 'Bob' }; // ❌ 错误！

// 解构会失去响应性
const { count } = reactive({ count: 0 }); // ❌ count 不是响应式的
```

---

### 3.3 computed()

创建计算属性。

```typescript
import { ref, computed } from 'vue';

const count = ref(0);

// 只读计算属性
const doubleCount = computed(() => count.value * 2);

console.log(doubleCount.value); // 0
count.value = 5;
console.log(doubleCount.value); // 10

// 可写计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ');
  }
});
```

#### 计算属性缓存
```typescript
// ✅ 计算属性会缓存
const filteredList = computed(() => {
  console.log('计算中...');
  return list.value.filter(item => item.active);
});

// ❌ 方法每次都会执行
const getFilteredList = () => {
  console.log('计算中...');
  return list.value.filter(item => item.active);
};
```

---

### 3.4 watch()

监听响应式数据的变化。

```typescript
import { ref, watch } from 'vue';

const count = ref(0);
const message = ref('');

// 监听单个数据源
watch(count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变为 ${newValue}`);
});

// 监听多个数据源
watch([count, message], ([newCount, newMsg], [oldCount, oldMsg]) => {
  console.log('数据变化了');
});

// 深度监听对象
const state = ref({ count: 0, nested: { value: 1 } });
watch(state, (newValue) => {
  console.log('state 变化了');
}, { deep: true });

// 立即执行
watch(count, (value) => {
  console.log('初始值:', value);
}, { immediate: true });
```

---

### 3.5 watchEffect()

自动追踪依赖并执行副作用。

```typescript
import { ref, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// 自动追踪 count 和 message
watchEffect(() => {
  console.log(`count: ${count.value}, message: ${message.value}`);
});

// 清理副作用
watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log('延时执行');
  }, 1000);
  
  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

#### watch vs watchEffect

| 特性 | watch | watchEffect |
|------|-------|-------------|
| 依赖追踪 | 手动指定 | 自动追踪 |
| 访问旧值 | ✅ 支持 | ❌ 不支持 |
| 延迟执行 | ✅ 默认 | ❌ 立即执行 |
| 适用场景 | 需要对比新旧值 | 简单的副作用 |

---

## 4. 生命周期钩子

### 4.1 UniApp 中的生命周期

```typescript
import { 
  onMounted, 
  onUnmounted,
  onLoad,
  onShow,
  onReady,
  onHide,
  onUnload
} from '@dcloudio/uni-app';

// Vue 生命周期
onMounted(() => {
  console.log('组件挂载完成');
});

onUnmounted(() => {
  console.log('组件卸载');
});

// UniApp 页面生命周期
onLoad((options) => {
  console.log('页面加载', options);
});

onShow(() => {
  console.log('页面显示');
});

onReady(() => {
  console.log('页面初次渲染完成');
});

onHide(() => {
  console.log('页面隐藏');
});

onUnload(() => {
  console.log('页面卸载');
});
```

### 4.2 生命周期执行顺序

```
onLoad → onShow → onReady → onMounted
                                ↓
                            用户使用
                                ↓
                     onHide ← onUnload ← onUnmounted
```

---

## 5. 组件通信

### 5.1 Props（父 → 子）

```vue
<!-- 父组件 -->
<template>
  <UserCard :user="currentUser" :show-avatar="true" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserCard from './UserCard.vue';

const currentUser = ref({ name: 'Alice', age: 25 });
</script>

<!-- 子组件 UserCard.vue -->
<template>
  <view class="user-card">
    <text>{{ user.name }}</text>
    <text>{{ user.age }}</text>
  </view>
</template>

<script setup lang="ts">
interface User {
  name: string;
  age: number;
}

// 定义 Props
const props = defineProps<{
  user: User;
  showAvatar?: boolean;
}>();

// 带默认值
const props = withDefaults(defineProps<{
  user: User;
  showAvatar?: boolean;
}>(), {
  showAvatar: false
});
</script>
```

---

### 5.2 Emits（子 → 父）

```vue
<!-- 子组件 -->
<template>
  <button @click="handleClick">点击</button>
</template>

<script setup lang="ts">
// 定义事件
const emit = defineEmits<{
  (e: 'update', value: number): void;
  (e: 'delete', id: number): void;
}>();

const handleClick = () => {
  emit('update', 100);
  emit('delete', 1);
};
</script>

<!-- 父组件 -->
<template>
  <ChildComponent 
    @update="handleUpdate"
    @delete="handleDelete"
  />
</template>

<script setup lang="ts">
const handleUpdate = (value: number) => {
  console.log('更新:', value);
};

const handleDelete = (id: number) => {
  console.log('删除:', id);
};
</script>
```

---

### 5.3 v-model 双向绑定

```vue
<!-- 子组件 -->
<template>
  <input :value="modelValue" @input="handleInput" />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (e: any) => {
  emit('update:modelValue', e.detail.value);
};
</script>

<!-- 父组件 -->
<template>
  <CustomInput v-model="message" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const message = ref('Hello');
</script>
```

---

## 6. Composables（组合函数）

### 6.1 基础示例

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  
  const double = computed(() => count.value * 2);
  
  const increment = () => {
    count.value++;
  };
  
  const decrement = () => {
    count.value--;
  };
  
  const reset = () => {
    count.value = initialValue;
  };
  
  return {
    count,
    double,
    increment,
    decrement,
    reset
  };
}

// 使用
import { useCounter } from '@/composables/useCounter';

const { count, double, increment, decrement, reset } = useCounter(10);
```

---

### 6.2 实用 Composables

#### useRequest（请求封装）

```typescript
// composables/useRequest.ts
import { ref } from 'vue';

export function useRequest<T>(requestFn: () => Promise<T>) {
  const data = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<Error | null>(null);
  
  const execute = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      data.value = await requestFn();
    } catch (err) {
      error.value = err as Error;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    data,
    loading,
    error,
    execute
  };
}

// 使用
import { getUserList } from '@/api/user';
import { useRequest } from '@/composables/useRequest';

const { data, loading, error, execute } = useRequest(() => getUserList({ page: 1 }));

onMounted(() => {
  execute();
});
```

#### useDebounce（防抖）

```typescript
// composables/useDebounce.ts
import { ref, customRef } from 'vue';

export function useDebounce<T>(value: T, delay = 300) {
  return customRef((track, trigger) => {
    let timeout: number;
    
    return {
      get() {
        track();
        return value;
      },
      set(newValue: T) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      }
    };
  });
}

// 使用
const keyword = useDebounce('', 500);

watch(keyword, (value) => {
  console.log('搜索:', value);
});
```

---

## 7. Template Refs

### 7.1 基础用法

```vue
<template>
  <input ref="inputRef" />
  <button @click="focusInput">聚焦输入框</button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const inputRef = ref<HTMLInputElement | null>(null);

const focusInput = () => {
  inputRef.value?.focus();
};

onMounted(() => {
  console.log(inputRef.value);
});
</script>
```

### 7.2 组件 Ref

```vue
<!-- 子组件 ChildComponent.vue -->
<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

const increment = () => {
  count.value++;
};

// 暴露给父组件
defineExpose({
  count,
  increment
});
</script>

<!-- 父组件 -->
<template>
  <ChildComponent ref="childRef" />
  <button @click="incrementChild">增加子组件计数</button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const childRef = ref<{ count: number; increment: () => void } | null>(null);

const incrementChild = () => {
  childRef.value?.increment();
};
</script>
```

---

## 8. 最佳实践

### 8.1 响应式数据组织

```typescript
// ✅ 推荐：按功能分组
const userState = reactive({
  list: [],
  current: null,
  loading: false
});

// ❌ 不推荐：所有数据放在一个对象
const state = reactive({
  users: [],
  products: [],
  orders: [],
  // ...太多了
});
```

### 8.2 Composables 命名

```typescript
// ✅ 推荐：use 开头
export function useCounter() { }
export function useRequest() { }

// ❌ 不推荐
export function counter() { }
export function getRequest() { }
```

### 8.3 避免过度响应式

```typescript
// ❌ 不需要响应式的常量
const config = reactive({ API_URL: 'xxx' }); // 浪费

// ✅ 使用普通对象
const config = { API_URL: 'xxx' };
```

---

## 9. 常见问题

### Q1: ref 和 reactive 如何选择？
**A**: 
- 基本类型用 `ref`
- 对象类型优先用 `ref`（可以替换整个对象）
- 需要解构时用 `toRefs(reactive({}))`

### Q2: 为什么 reactive 解构会失去响应性？
**A**: 解构会创建新的变量，失去与原对象的引用关系。使用 `toRefs()` 解决：

```typescript
import { reactive, toRefs } from 'vue';

const state = reactive({ count: 0 });
const { count } = toRefs(state); // ✅ 保持响应性
```

### Q3: watch 和 watchEffect 如何选择？
**A**:
- 需要对比新旧值 → `watch`
- 简单的副作用 → `watchEffect`
- 需要延迟执行 → `watch`

---

## 10. 参考资料

- [Vue 3 官方文档 - Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Vue 3 TypeScript 支持](https://vuejs.org/guide/typescript/composition-api.html)
- [VueUse - Composables 集合](https://vueuse.org/)

