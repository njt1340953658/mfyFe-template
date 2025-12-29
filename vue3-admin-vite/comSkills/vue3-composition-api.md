# Vue 3 Composition API 使用规范

## 基本概念
Vue 3 Composition API 是 Vue 3 的核心特性，提供了一种更灵活的方式来组织组件逻辑。

## Script Setup

### 基本用法
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式状态
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('组件已挂载')
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">增加</button>
  </div>
</template>
```

## 响应式 API

### 1. ref - 基本类型响应式
```typescript
import { ref } from 'vue'

// 基本类型
const count = ref<number>(0)
const name = ref<string>('Alice')
const isActive = ref<boolean>(false)

// 访问值需要 .value
count.value++
console.log(name.value)

// 模板中自动解包
<template>
  <div>{{ count }}</div>
</template>
```

### 2. reactive - 对象响应式
```typescript
import { reactive } from 'vue'

// 对象
const state = reactive({
  count: 0,
  name: 'Alice',
  user: {
    age: 20
  }
})

// 直接访问，不需要 .value
state.count++
state.user.age = 21

// ✅ 推荐：使用 reactive 管理对象
interface State {
  loading: boolean
  data: any[]
  error: string | null
}

const state = reactive<State>({
  loading: false,
  data: [],
  error: null
})
```

### 3. computed - 计算属性
```typescript
import { ref, computed } from 'vue'

const firstName = ref('Zhang')
const lastName = ref('San')

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})

// 可写计算属性
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ')
  }
})
```

### 4. watch - 侦听器
```typescript
import { ref, watch } from 'vue'

const count = ref(0)
const name = ref('Alice')

// 侦听单个源
watch(count, (newValue, oldValue) => {
  console.log(`count changed from ${oldValue} to ${newValue}`)
})

// 侦听多个源
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('count or name changed')
})

// 侦听 reactive 对象
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (newValue) => {
    console.log('count changed:', newValue)
  }
)

// 立即执行 + 深度侦听
watch(
  () => state,
  (newValue) => {
    console.log('state changed')
  },
  { immediate: true, deep: true }
)
```

### 5. watchEffect - 自动依赖侦听
```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const name = ref('Alice')

// 自动追踪依赖
watchEffect(() => {
  console.log(`count: ${count.value}, name: ${name.value}`)
})

// 停止侦听
const stop = watchEffect(() => {
  console.log(count.value)
})

// 手动停止
stop()
```

## 生命周期钩子

```typescript
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue'

onBeforeMount(() => {
  console.log('组件挂载前')
})

onMounted(() => {
  console.log('组件已挂载')
  // DOM 已经可用
})

onBeforeUpdate(() => {
  console.log('组件更新前')
})

onUpdated(() => {
  console.log('组件已更新')
})

onBeforeUnmount(() => {
  console.log('组件卸载前')
  // 清理副作用
})

onUnmounted(() => {
  console.log('组件已卸载')
})
```

## 组件通信

### 1. Props
```vue
<script setup lang="ts">
// 定义 props
interface Props {
  title: string
  count?: number
  user: {
    name: string
    age: number
  }
}

// 使用 withDefaults 设置默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// 访问 props
console.log(props.title)
console.log(props.count)
</script>
```

### 2. Emits
```vue
<script setup lang="ts">
// 定义 emits
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: number): void
  (e: 'submit', data: { name: string; age: number }): void
}

const emit = defineEmits<Emits>()

// 触发事件
const handleClick = () => {
  emit('update:modelValue', 'new value')
  emit('change', 123)
  emit('submit', { name: 'Alice', age: 20 })
}
</script>
```

### 3. v-model
```vue
<!-- 父组件 -->
<template>
  <CustomInput v-model="value" />
</template>

<!-- 子组件 -->
<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input :value="modelValue" @input="handleInput" />
</template>
```

### 4. Provide / Inject
```vue
<!-- 祖先组件 -->
<script setup lang="ts">
import { provide } from 'vue'

const theme = ref('dark')
provide('theme', theme)

// 提供响应式数据
provide('updateTheme', (newTheme: string) => {
  theme.value = newTheme
})
</script>

<!-- 后代组件 -->
<script setup lang="ts">
import { inject } from 'vue'

const theme = inject<Ref<string>>('theme')
const updateTheme = inject<(theme: string) => void>('updateTheme')

const toggleTheme = () => {
  updateTheme?.('light')
}
</script>
```

## 组合式函数 (Composables)

### 创建可复用逻辑
```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  const reset = () => {
    count.value = initialValue
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}

// 使用
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

const { count, doubleCount, increment, decrement, reset } = useCounter(10)
</script>
```

### 常用 Composables 示例

#### useRequest - 请求封装
```typescript
// composables/useRequest.ts
import { ref } from 'vue'

export function useRequest<T>(requestFn: (...args: any[]) => Promise<T>) {
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const data = ref<T | null>(null)
  
  const run = async (...args: any[]) => {
    loading.value = true
    error.value = null
    try {
      data.value = await requestFn(...args)
      return data.value
    } catch (err) {
      error.value = err as Error
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    data,
    run
  }
}

// 使用
const { loading, data, run } = useRequest(getUserList)

onMounted(() => {
  run({ page: 1, pageSize: 20 })
})
```

#### useToggle - 布尔值切换
```typescript
// composables/useToggle.ts
import { ref } from 'vue'

export function useToggle(initialValue = false) {
  const value = ref(initialValue)
  
  const toggle = () => {
    value.value = !value.value
  }
  
  const setTrue = () => {
    value.value = true
  }
  
  const setFalse = () => {
    value.value = false
  }
  
  return {
    value,
    toggle,
    setTrue,
    setFalse
  }
}
```

#### useDebounce - 防抖
```typescript
// composables/useDebounce.ts
import { ref, watch } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay = 500) {
  const debouncedValue = ref<T>(value.value as T)
  
  let timer: ReturnType<typeof setTimeout> | null = null
  
  watch(value, (newValue) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = newValue as T
    }, delay)
  })
  
  return debouncedValue
}

// 使用
const keyword = ref('')
const debouncedKeyword = useDebounce(keyword, 500)

watch(debouncedKeyword, (value) => {
  // 执行搜索
  search(value)
})
```

## Template Refs

### 访问 DOM 元素
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const inputRef = ref<HTMLInputElement>()

onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <input ref="inputRef" />
</template>
```

### 访问子组件实例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const childRef = ref<InstanceType<typeof ChildComponent>>()

const callChildMethod = () => {
  childRef.value?.someMethod()
}
</script>

<template>
  <ChildComponent ref="childRef" />
  <button @click="callChildMethod">调用子组件方法</button>
</template>
```

## 最佳实践

### 1. 组件结构
```vue
<script setup lang="ts">
// 1. 导入
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

// 2. Props 和 Emits
interface Props {
  title: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'change', value: string): void
}>()

// 3. 响应式状态
const count = ref(0)
const state = reactive({
  loading: false,
  data: []
})

// 4. Computed
const doubleCount = computed(() => count.value * 2)

// 5. 方法
const handleClick = () => {
  count.value++
}

// 6. Watch
watch(count, (newValue) => {
  console.log(newValue)
})

// 7. 生命周期
onMounted(() => {
  fetchData()
})
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped lang="scss">
/* 样式 */
</style>
```

### 2. 合理使用 ref 和 reactive
```typescript
// ✅ 推荐：基本类型用 ref
const count = ref(0)
const name = ref('Alice')

// ✅ 推荐：对象用 reactive
const user = reactive({
  name: 'Alice',
  age: 20
})

// ❌ 避免：对象用 ref（需要 .value）
const user = ref({
  name: 'Alice',
  age: 20
})
// 访问：user.value.name
```

### 3. 避免响应式丢失
```typescript
// ❌ 错误：解构会丢失响应式
const state = reactive({ count: 0 })
const { count } = state // count 不再是响应式

// ✅ 正确：使用 toRefs
import { toRefs } from 'vue'
const { count } = toRefs(state) // count 保持响应式

// ✅ 正确：使用 toRef
import { toRef } from 'vue'
const count = toRef(state, 'count')
```

### 4. 性能优化
```vue
<script setup lang="ts">
// 使用 computed 缓存计算结果
const expensiveValue = computed(() => {
  return computeExpensiveValue(data.value)
})

// 使用 shallowRef 避免深层响应式
import { shallowRef } from 'vue'
const largeData = shallowRef({
  // 大量数据
})

// 使用 v-memo 优化列表渲染
</script>

<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.name]">
    {{ item.name }}
  </div>
</template>
```

## 常见问题

### 问题 1：为什么修改数据视图不更新？
```typescript
// ❌ 错误：直接修改数组索引
const list = ref([1, 2, 3])
list.value[0] = 999  // 可以工作，但不推荐

// ✅ 推荐：使用数组方法
list.value.splice(0, 1, 999)
list.value = [...list.value, 4]
```

### 问题 2：watch 不触发？
```typescript
// ❌ 错误：侦听 reactive 对象的属性
const state = reactive({ count: 0 })
watch(state.count, () => {}) // 不会触发

// ✅ 正确：使用 getter 函数
watch(() => state.count, () => {})
```

### 问题 3：组件卸载后异步操作报错？
```typescript
let cancelled = false

onBeforeUnmount(() => {
  cancelled = true
})

const fetchData = async () => {
  const data = await api.getData()
  if (!cancelled) {
    // 只在组件未卸载时更新
    state.data = data
  }
}
```

## 总结
1. ✅ 优先使用 `<script setup>` 语法
2. ✅ ref 用于基本类型，reactive 用于对象
3. ✅ 合理使用 computed 缓存计算结果
4. ✅ 抽取可复用逻辑为 composables
5. ✅ 注意响应式丢失问题（使用 toRefs）
6. ✅ 组件卸载前清理副作用
7. ✅ 使用 TypeScript 增强类型安全

