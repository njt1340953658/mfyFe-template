# Element Plus 使用指南

## 1. 概述

Element Plus 是基于 Vue 3 的桌面端组件库，提供了丰富的组件和优雅的 UI 设计。

### 核心特性
- 🎨 **丰富的组件**: 60+ 高质量组件
- 💪 **TypeScript**: 完整的类型定义
- 🌍 **国际化**: 支持多语言
- 🎭 **主题定制**: 灵活的主题系统
- 📦 **按需引入**: Tree Shaking 支持

---

## 2. 安装和配置

### 2.1 安装

```bash
pnpm install element-plus
pnpm install -D unplugin-vue-components unplugin-auto-import
```

### 2.2 按需自动导入（推荐）

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
});
```

### 2.3 全局完整引入

```typescript
// main.ts
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import App from './App.vue';

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});

app.mount('#app');
```

---

## 3. 常用组件

### 3.1 表单组件

#### Form 表单

```vue
<template>
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    label-width="100px"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" />
    </el-form-item>
    
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        show-password
      />
    </el-form-item>
    
    <el-form-item label="性别" prop="gender">
      <el-radio-group v-model="form.gender">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="2">女</el-radio>
      </el-radio>
    </el-form-item>
    
    <el-form-item label="爱好" prop="hobbies">
      <el-checkbox-group v-model="form.hobbies">
        <el-checkbox label="读书" />
        <el-checkbox label="运动" />
        <el-checkbox label="旅游" />
      </el-checkbox-group>
    </el-form-item>
    
    <el-form-item label="城市" prop="city">
      <el-select v-model="form.city" placeholder="请选择">
        <el-option label="北京" value="beijing" />
        <el-option label="上海" value="shanghai" />
        <el-option label="广州" value="guangzhou" />
      </el-select>
    </el-form-item>
    
    <el-form-item label="日期" prop="date">
      <el-date-picker
        v-model="form.date"
        type="date"
        placeholder="选择日期"
      />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';

const formRef = ref<FormInstance>();

const form = reactive({
  username: '',
  password: '',
  gender: 1,
  hobbies: [],
  city: '',
  date: ''
});

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid) => {
    if (valid) {
      console.log('提交表单', form);
    }
  });
};

const handleReset = () => {
  formRef.value?.resetFields();
};
</script>
```

---

### 3.2 表格组件

#### Table 表格

```vue
<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%"
    border
    stripe
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column type="index" label="序号" width="60" />
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="age" label="年龄" width="80" />
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
          {{ row.status === 1 ? '正常' : '禁用' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="{ row }">
        <el-button size="small" type="primary" @click="handleEdit(row)">
          编辑
        </el-button>
        <el-button size="small" type="danger" @click="handleDelete(row)">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  
  <el-pagination
    v-model:current-page="currentPage"
    v-model:page-size="pageSize"
    :total="total"
    :page-sizes="[10, 20, 50, 100]"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const handleSelectionChange = (selection: any[]) => {
  console.log('选中行', selection);
};

const handleEdit = (row: any) => {
  console.log('编辑', row);
};

const handleDelete = (row: any) => {
  console.log('删除', row);
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  // 重新加载数据
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 重新加载数据
};
</script>
```

---

### 3.3 布局组件

#### Layout 布局

```vue
<template>
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        @select="handleSelect"
      >
        <el-menu-item index="1">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="2-1">用户管理</el-menu-item>
          <el-menu-item index="2-2">角色管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    
    <!-- 主体 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header>
        <el-icon @click="toggleCollapse">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
      </el-header>
      
      <!-- 内容区 -->
      <el-main>
        <router-view />
      </el-main>
      
      <!-- 底部 -->
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>
```

---

### 3.4 反馈组件

#### Message 消息提示

```typescript
import { ElMessage } from 'element-plus';

// 成功提示
ElMessage.success('操作成功');

// 警告提示
ElMessage.warning('警告信息');

// 错误提示
ElMessage.error('操作失败');

// 普通提示
ElMessage.info('提示信息');

// 自定义配置
ElMessage({
  message: '这是一条消息',
  type: 'success',
  duration: 3000,
  showClose: true,
  onClose: () => {
    console.log('消息关闭');
  }
});
```

#### MessageBox 对话框

```typescript
import { ElMessageBox } from 'element-plus';

// 确认框
ElMessageBox.confirm('确定要删除吗？', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning'
}).then(() => {
  // 确定
  ElMessage.success('删除成功');
}).catch(() => {
  // 取消
});

// 提示框
ElMessageBox.alert('这是一段内容', '标题', {
  confirmButtonText: '确定'
});

// 输入框
ElMessageBox.prompt('请输入邮箱', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
  inputErrorMessage: '邮箱格式不正确'
}).then(({ value }) => {
  ElMessage.success(`你的邮箱是: ${value}`);
});
```

#### Loading 加载

```typescript
import { ElLoading } from 'element-plus';

// 全屏加载
const loading = ElLoading.service({
  lock: true,
  text: '加载中...',
  background: 'rgba(0, 0, 0, 0.7)'
});

// 关闭加载
setTimeout(() => {
  loading.close();
}, 2000);

// 局部加载（指令方式）
<el-table v-loading="loading" :data="tableData">
</el-table>
```

---

## 4. 主题定制

### 4.1 CSS 变量方式

```scss
// styles/element-variables.scss
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
  --el-color-error: #f56c6c;
  --el-color-info: #909399;
}
```

### 4.2 SCSS 变量方式

```scss
// styles/element-variables.scss
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': #409eff,
    ),
  ),
);

// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "~/styles/element-variables.scss" as *;`,
      },
    },
  },
});
```

---

## 5. 图标使用

### 5.1 安装图标库

```bash
pnpm install @element-plus/icons-vue
```

### 5.2 全局注册

```typescript
// main.ts
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
```

### 5.3 使用图标

```vue
<template>
  <!-- 直接使用 -->
  <el-icon><Edit /></el-icon>
  
  <!-- 作为组件属性 -->
  <el-button :icon="Search">搜索</el-button>
  
  <!-- 自定义大小和颜色 -->
  <el-icon :size="20" color="#409eff">
    <Edit />
  </el-icon>
</template>

<script setup lang="ts">
import { Edit, Search } from '@element-plus/icons-vue';
</script>
```

---

## 6. 国际化

```typescript
// main.ts
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import en from 'element-plus/es/locale/lang/en';

const app = createApp(App);

// 中文
app.use(ElementPlus, {
  locale: zhCn,
});

// 英文
app.use(ElementPlus, {
  locale: en,
});
```

---

## 7. 最佳实践

### 7.1 表单验证封装

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
```

### 7.2 全局组件封装

```vue
<!-- components/SearchForm/index.vue -->
<template>
  <el-form :inline="true" :model="formData">
    <el-form-item
      v-for="item in fields"
      :key="item.prop"
      :label="item.label"
    >
      <component
        :is="item.component"
        v-model="formData[item.prop]"
        v-bind="item.attrs"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>
```

---

## 8. 常见问题

### Q1: 如何解决样式覆盖问题？
**A**: 使用 `:deep()` 深度选择器

```scss
:deep(.el-button) {
  background-color: red;
}
```

### Q2: 表格如何实现固定列？
**A**: 使用 `fixed` 属性

```vue
<el-table-column fixed="left" />
<el-table-column fixed="right" />
```

### Q3: 如何实现表单动态验证？
**A**: 使用 `validate` 方法

```typescript
formRef.value?.validateField('username', (valid) => {
  if (valid) {
    // 验证通过
  }
});
```

---

## 9. 参考资料

- [Element Plus 官方文档](https://element-plus.org/)
- [Element Plus GitHub](https://github.com/element-plus/element-plus)
- [Element Plus 图标库](https://element-plus.org/zh-CN/component/icon.html)

