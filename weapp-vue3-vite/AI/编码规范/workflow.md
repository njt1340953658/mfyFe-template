# AI 前端开发完整流程方案（UniApp 小程序从0到1）

## 阶段一：PM定位与角色设定

### 目标
明确AI在项目中的角色定位，建立专业身份和职责边界。

### 应用原则
- **原则5：系统提示/角色设定** - 赋予AI专业的PM角色身份
- **原则1：清晰、直接和详细** - 明确角色职责和能力边界

### 提示词模板

```text
<role>
你是一位资深的前端开发PM（Product Manager），具备以下能力：
1. 深度理解产品需求和业务逻辑
2. 能够将需求转化为技术实现方案
3. 熟悉 Vue 3 + TypeScript + Vite + Pinia + UniApp 技术栈
4. 遵循 UniApp Vue3 小程序项目的编码规范和最佳实践
5. 能够进行需求分析、原型解读、技术选型和开发规划
6. 了解微信小程序的限制和特性
</role>

<context>
项目技术栈：
- 框架: Vue 3.4+ + TypeScript 4.9+
- 构建工具: Vite 5.4+
- 跨端框架: UniApp 3.0+
- 状态管理: Pinia 2.0+
- 样式: SCSS
- 小程序平台: 微信小程序

项目规范：
- 页面文件使用小写，一个页面一个文件夹，如 pages/index/index.vue
- 组件文件使用 PascalCase，扩展名为 .vue
- 工具函数使用 camelCase
- 样式使用 SCSS，使用 scoped 作用域
- 代码风格：单引号、无分号、2空格缩进
- 使用 Composition API 和 <script setup> 语法
- 使用 rpx 作为响应式单位
- 路由导航使用 uniRouter 工具函数
- API 请求使用封装的 request 函数
</context>

<instructions>
请确认你已理解以上角色定位和技术栈要求。在后续对话中，你将作为前端PM协助完成从需求理解到开发测试的完整流程。
</instructions>
```

### 使用说明
1. **初始化对话**：在开始任何开发任务前，先使用此提示词建立AI的PM角色
2. **角色确认**：AI应该确认已理解角色定位和技术栈要求
3. **后续流程**：确认后，可以进入需求理解阶段

---

## 阶段二：需求理解与分析

### 目标
深度理解产品需求，识别核心功能点和边界条件。

### 应用原则
- **原则8：上下文放在指令之前** - 将需求文档放在前面，指令放在末尾
- **原则3：思维链** - 引导AI逐步分析需求
- **原则4：XML标签** - 结构化需求信息

### 提示词模板

```text
<document name="产品需求文档">
[此处粘贴完整的产品需求文档、PRD、用户故事等]
</document>

<examples>
<example>
需求：用户登录功能
核心功能点：
1. 手机号/验证码登录
2. 记住登录状态
3. Token 存储和自动刷新
4. 登录失败错误提示
边界条件：
- 验证码长度：6位数字
- 验证码有效期：5分钟
- Token过期时间：7天
- 登录失败3次后显示图形验证码
</example>
<example>
需求：商品列表页
核心功能点：
1. 商品列表展示
2. 下拉刷新和上拉加载
3. 搜索筛选功能
4. 跳转到商品详情
边界条件：
- 每页默认10条
- 支持分类筛选、价格排序
- 图片懒加载
- 空状态提示
</example>
</examples>

<instructions>
请基于以上需求文档，完成以下分析任务：

1. **需求解构**：识别核心功能模块和子功能点
2. **技术分析**：分析每个功能点的技术实现方案（考虑小程序特性）
3. **依赖识别**：列出需要的新增API接口、组件、Pinia Store等
4. **边界条件**：识别异常情况、边界场景和错误处理需求
5. **小程序限制**：识别小程序平台的限制和注意事项
6. **开发优先级**：按重要性和依赖关系排序开发任务

请在 <thinking> 标签中展示你的分析过程，在 <analysis_result> 标签中输出结构化分析结果（JSON格式）。
</thinking>

<analysis_result>
{
  "core_modules": [],
  "technical_approach": {},
  "dependencies": {
    "apis": [],
    "components": [],
    "pinia_stores": [],
    "pages": []
  },
  "edge_cases": [],
  "miniprogram_considerations": [],
  "development_priority": []
}
</analysis_result>
</instructions>
```

### 使用说明
1. **输入需求文档**：将完整的产品需求文档、PRD或用户故事粘贴到 `<document>` 标签中
2. **提供示例**：可以添加类似需求的示例，帮助AI更好地理解分析模式
3. **获取分析结果**：AI会在 `<thinking>` 中展示分析过程，在 `<analysis_result>` 中输出结构化结果

### 输出格式说明
`analysis_result` JSON结构：
- `core_modules`: 核心功能模块列表
- `technical_approach`: 每个功能点的技术实现方案
- `dependencies`: 依赖项（API、组件、Pinia stores、页面）
- `edge_cases`: 边界条件和异常场景
- `miniprogram_considerations`: 小程序特有注意事项
- `development_priority`: 开发优先级排序

---

## 阶段三：原型还原与UI分析

### 目标
从设计原型中提取UI组件、布局结构和交互逻辑。

### 应用原则
- **原则2：多示例提示** - 提供原型分析示例
- **原则1：清晰、直接和详细** - 明确UI还原的具体要求
- **原则4：XML标签** - 结构化原型信息

### 提示词模板

```text
<prototype_design>
[此处粘贴设计原型图片描述、Figma链接、或详细的UI设计说明]
</prototype_design>

<examples>
<example>
原型描述：商品列表页，顶部搜索栏，中间商品列表（瀑布流布局），底部TabBar
UI分析结果：
{
  "layout": "flex布局，垂直排列",
  "components": [
    {
      "name": "ProductListPage",
      "type": "页面组件",
      "children": ["SearchBar", "ProductGrid", "TabBar"]
    },
    {
      "name": "SearchBar",
      "type": "搜索组件",
      "props": {
        "placeholder": "搜索商品",
        "showAction": true
      },
      "uni_components": ["view", "input", "button"]
    },
    {
      "name": "ProductGrid",
      "type": "列表组件",
      "props": {
        "layout": "waterfall",
        "columns": 2
      },
      "uni_components": ["scroll-view", "view", "image"]
    }
  ],
  "styles": {
    "page": "背景色 #f5f5f5",
    "search_bar": "高度 88rpx，背景色 #fff",
    "product_card": "宽度 340rpx，圆角 16rpx"
  },
  "interactions": [
    "下拉刷新",
    "上拉加载更多",
    "点击商品跳转详情",
    "搜索框输入触发搜索"
  ]
}
</example>
</examples>

<instructions>
请基于以上原型设计，完成以下任务：

1. **组件识别**：列出所有需要开发的UI组件，标注组件层级关系
2. **UniApp组件映射**：将设计元素映射到对应的UniApp组件（view、text、image、button等）
3. **布局分析**：分析页面布局结构（Flex、Grid等），注意小程序布局特性
4. **样式提取**：提取关键样式属性（颜色、间距、字体等），使用rpx单位
5. **交互逻辑**：识别用户交互行为（点击、输入、滚动等）
6. **小程序适配**：考虑小程序平台的特有限制（如navigationBar、tabBar配置）

请在 <ui_analysis> 标签中输出结构化分析结果（JSON格式）。
</ui_analysis>
</instructions>
```

### 使用说明
1. **输入原型信息**：将设计原型描述、Figma链接或UI设计说明粘贴到 `<prototype_design>` 标签中
2. **参考示例**：提供的示例展示了UI分析的输出格式和深度
3. **获取分析结果**：AI会在 `<ui_analysis>` 标签中输出结构化的UI分析结果

### 输出格式说明
`ui_analysis` JSON结构应包含：
- `layout`: 页面布局方式（Flex、Grid、绝对定位等）
- `components`: 组件列表，每个组件包含：
  - `name`: 组件名称
  - `type`: 组件类型（页面组件、布局组件、功能组件等）
  - `children`: 子组件列表
  - `props`: 组件属性
  - `uni_components`: 使用的UniApp基础组件
- `styles`: 关键样式属性（使用rpx单位）
- `interactions`: 交互行为列表
- `pages_json_config`: pages.json 配置需求

---

## 阶段四：技术思考与方案设计

### 目标
基于需求和原型，设计具体的技术实现方案。

### 应用原则
- **原则3：思维链** - 引导AI逐步思考技术方案
- **原则7：链式提示** - 将技术设计分解为多个步骤
- **原则1：清晰、直接和详细** - 明确技术选型和实现细节

### 提示词模板

```text
<requirement_analysis>
[阶段二的需求分析结果]
</requirement_analysis>

<ui_analysis>
[阶段三的UI分析结果]
</ui_analysis>

<codebase_context>
[相关现有代码文件路径和关键代码片段]
</codebase_context>

<instructions>
请一步一步思考，设计完整的技术实现方案：

**第一步：架构设计**
- 分析功能模块的组件层级结构
- 确定状态管理方案（本地状态 vs Pinia Store）
- 设计数据流和组件通信方式
- 考虑小程序分包策略

**第二步：文件规划**
- 列出需要创建的新文件（页面、组件、API、Pinia store等）
- 确定文件命名和目录结构（遵循项目规范）
- 识别可以复用的现有组件
- 配置pages.json页面路由

**第三步：接口设计**
- 设计API接口的数据结构
- 定义请求参数和响应格式
- 规划错误处理机制
- 考虑小程序网络请求限制

**第四步：状态管理设计**
- 设计Pinia store结构
- 定义state、getters和actions
- 规划状态持久化需求（使用uni.setStorageSync）

**第五步：组件设计**
- 设计组件Props接口
- 规划组件内部响应式状态
- 设计组件生命周期和副作用
- 考虑小程序生命周期（onLoad、onShow等）

**第六步：路由设计**
- 配置pages.json页面路由
- 设计页面跳转逻辑
- 规划页面参数传递方式

请在 <thinking> 标签中展示你的思考过程，在 <technical_design> 标签中输出完整的技术方案（Markdown格式）。
</thinking>

<technical_design>
## 技术实现方案

### 1. 架构设计
...

### 2. 文件规划
...

### 3. 接口设计
...

### 4. 状态管理设计
...

### 5. 组件设计
...

### 6. 路由设计
...
</technical_design>
</instructions>
```

### 使用说明
1. **输入前置结果**：将阶段二的需求分析结果和阶段三的UI分析结果分别粘贴到对应标签中
2. **提供代码上下文**：如果有相关的现有代码，可以粘贴到 `<codebase_context>` 中供参考
3. **获取技术方案**：AI会在 `<thinking>` 中展示思考过程，在 `<technical_design>` 中输出完整的技术方案

### 输出格式说明
`technical_design` 应包含以下部分：

#### 1. 架构设计
- 组件层级结构图（文字描述）
- 状态管理方案说明
- 数据流设计
- 分包策略（如需要）

#### 2. 文件规划
- 需要创建的文件列表
- 文件路径和命名（遵循项目规范）
- 可复用的现有组件
- pages.json 配置

#### 3. 接口设计
- API接口列表
- 请求参数和响应格式（TypeScript接口定义）
- 错误处理策略

#### 4. 状态管理设计
- Pinia store结构定义
- State定义
- Getters列表
- Actions设计
- 持久化配置（使用uni.setStorageSync）

#### 5. 组件设计
- 组件Props接口定义（使用defineProps）
- 组件内部响应式状态规划（ref、reactive）
- 计算属性设计（computed）
- 生命周期和副作用设计（onMounted、watch、onLoad等）

#### 6. 路由设计
- pages.json 页面路由配置
- 页面跳转逻辑设计
- 页面参数传递方式

---

## 阶段五：代码开发与实现

### 目标
基于技术方案，生成符合项目规范的完整代码。

### 应用原则
- **原则1：清晰、直接和详细** - 明确代码规范和格式要求
- **原则2：多示例提示** - 提供符合规范的代码示例
- **原则6：预填充回复** - 确保代码格式一致性

### 提示词模板

```text
<technical_design>
[阶段四的技术设计方案]
</technical_design>

<code_examples>
<example>
// ✅ 正确的页面组件写法
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { getUserInfoApi } from '@/api/user'
import { navigateTo } from '@/utils/uniRouter'
import type { IUserInfo } from '@/types/user'

interface IUserInfo {
  id: number
  name: string
  avatar?: string
}

const userStore = useUserStore()
const loading = ref<boolean>(false)
const userInfo = reactive<IUserInfo>({
  id: 0,
  name: '',
})

onLoad(async (options: Record<string, any>) => {
  console.log('页面参数:', options)
  await loadUserInfo()
})

onShow(() => {
  console.log('页面显示')
})

const loadUserInfo = async () => {
  try {
    loading.value = true
    const { data } = await getUserInfoApi()
    Object.assign(userInfo, data)
  } finally {
    loading.value = false
  }
}

const handleClick = () => {
  navigateTo('/pages/detail', { id: userInfo.id })
}
</script>

<template>
  <view class="container">
    <view v-if="loading" class="loading">加载中...</view>
    <view v-else class="content">
      <image :src="userInfo.avatar" class="avatar" />
      <text class="name">{{ userInfo.name }}</text>
      <button @click="handleClick">查看详情</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}

.loading {
  text-align: center;
  padding: 40rpx;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}

.name {
  font-size: 32rpx;
  color: #333;
  margin-top: 20rpx;
}
</style>
</example>
</code_examples>

<instructions>
请基于技术设计方案，生成完整的代码实现。要求：

1. **严格遵循项目规范**：
   - 使用单引号，无分号，2空格缩进
   - 页面文件使用小写，一个页面一个文件夹，如 pages/index/index.vue
   - 组件文件使用PascalCase命名，扩展名为.vue
   - 使用 <script setup> 语法
   - 样式使用SCSS，添加scoped作用域
   - 使用rpx作为响应式单位
   - 导入顺序：Vue相关 → UniApp相关 → 第三方库 → 项目内部 → 类型

2. **代码质量**：
   - 所有函数和变量添加TypeScript类型定义
   - 使用Pinia store管理状态
   - 错误处理使用try-catch
   - 异步操作显示loading状态
   - 使用Composition API和响应式API（ref、reactive）
   - 使用UniApp生命周期钩子（onLoad、onShow等）

3. **小程序特性**：
   - 使用uni.showToast、uni.showModal等API
   - 使用uniRouter工具函数进行路由导航
   - 使用request工具函数进行API请求
   - 配置pages.json页面路由

4. **输出格式**：
   - 每个文件单独输出，使用代码块格式
   - 文件路径作为注释标注在代码块上方
   - 按依赖顺序输出（API → Pinia Store → 组件 → 页面 → pages.json）

请直接输出代码，不要添加解释性文字。代码必须可以直接运行。
</instructions>
```

### 使用说明
1. **输入技术方案**：将阶段四的技术设计方案粘贴到 `<technical_design>` 标签中
2. **参考代码示例**：提供的示例展示了符合项目规范的代码写法
3. **获取完整代码**：AI会按照依赖顺序输出所有需要创建的代码文件

### 代码规范要点

#### 导入顺序
```typescript
// 1. Vue相关
import { reactive, ref, computed } from 'vue'

// 2. UniApp相关
import { onLoad, onShow } from '@dcloudio/uni-app'

// 3. 第三方库
import { useUserStore } from '@/stores/user'

// 4. 项目内部（使用@别名）
import { getUserInfoApi } from '@/api/user'
import { navigateTo } from '@/utils/uniRouter'

// 5. 类型定义
import type { IUserInfo } from '@/types/user'
```

#### 代码风格
- 单引号：`'string'` 而非 `"string"`
- 无分号：语句末尾不使用分号
- 2空格缩进：不使用Tab
- 箭头函数参数必须加括号：`(param) => {}`

#### 组件结构
- 使用 `<script setup>` 语法
- 使用Composition API（ref、reactive、computed等）
- 使用Pinia管理状态
- 页面使用UniApp生命周期钩子（onLoad、onShow等）
- 样式使用 `<style lang="scss" scoped>`
- 使用rpx作为响应式单位

### 输出顺序
1. **API文件** (`src/api/`)
2. **Pinia Store** (`src/stores/`)
3. **组件文件** (`src/components/`)
4. **页面文件** (`src/pages/` 或 `src/subPages/`)
5. **pages.json配置** (页面路由配置)

---

## 阶段六：代码调整与优化

### 目标
根据实际运行情况，调整和优化代码。

### 应用原则
- **原则3：思维链** - 引导AI分析问题并逐步修复
- **原则7：链式提示** - 将问题分解为多个修复步骤
- **原则1：清晰、直接和详细** - 明确问题描述和修复要求

### 提示词模板

```text
<current_code>
[需要调整的代码文件]
</current_code>

<issue_description>
[问题描述：错误信息、预期行为、实际行为等]
</issue_description>

<error_logs>
[控制台错误日志、编译错误等]
</error_logs>

<instructions>
请一步一步分析问题并修复：

**第一步：问题诊断**
- 分析错误原因和根本问题
- 识别代码中的潜在问题
- 检查是否符合项目规范
- 考虑小程序平台限制

**第二步：修复方案**
- 设计具体的修复方案
- 考虑对现有代码的影响
- 确保修复后符合项目规范
- 考虑小程序兼容性

**第三步：代码修复**
- 输出修复后的完整代码
- 标注修改点和修改原因
- 确保代码可以直接运行

请在 <diagnosis> 标签中展示问题分析，在 <fix_plan> 标签中展示修复方案，在 <fixed_code> 标签中输出修复后的代码。
</diagnosis>

<fix_plan>
...

</fix_plan>

<fixed_code>
...
</fixed_code>
</instructions>
```

### 使用说明
1. **输入问题代码**：将有问题的代码文件粘贴到 `<current_code>` 标签中
2. **描述问题**：在 `<issue_description>` 中详细描述问题（错误信息、预期行为、实际行为）
3. **提供错误日志**：如果有控制台错误或编译错误，粘贴到 `<error_logs>` 中
4. **获取修复方案**：AI会在 `<diagnosis>` 中分析问题，在 `<fix_plan>` 中提供修复方案，在 `<fixed_code>` 中输出修复后的代码

### 问题诊断要点

#### 常见问题类型
1. **编译错误**：TypeScript类型错误、导入路径错误、Vue模板语法错误等
2. **运行时错误**：响应式数据访问错误、未定义变量、异步处理错误等
3. **逻辑错误**：业务逻辑不正确、状态更新错误、组件通信错误等
4. **规范问题**：不符合项目编码规范、未使用Composition API等
5. **小程序问题**：页面路由未配置、API使用错误、样式兼容性问题等

#### 诊断步骤
1. **错误定位**：找到具体的错误位置
2. **原因分析**：分析为什么会出现这个错误
3. **影响评估**：评估错误对整体功能的影响
4. **修复策略**：确定最佳的修复方案
5. **兼容性检查**：确保修复后小程序平台兼容

### 修复方案要点

#### 修复原则
1. **最小改动**：尽量用最小的改动解决问题
2. **保持规范**：修复后必须符合项目规范
3. **向后兼容**：不影响其他功能
4. **可测试性**：修复后代码应该易于测试
5. **小程序兼容**：确保修复后小程序平台正常运行

#### 修复步骤
1. **定位问题代码**：精确找到需要修改的代码行
2. **设计修复方案**：考虑多种修复方案，选择最优的
3. **实施修复**：按照方案修改代码
4. **验证修复**：确保修复后问题解决且无新问题

### 输出格式

#### diagnosis 标签
应包含：
- 问题根本原因分析
- 错误类型分类
- 影响范围评估
- 小程序兼容性分析

#### fix_plan 标签
应包含：
- 修复策略说明
- 具体修改点列表
- 修改原因说明
- 兼容性考虑

#### fixed_code 标签
应包含：
- 修复后的完整代码
- 关键修改点的注释说明

---

## 阶段七：测试与验证

### 目标
使用微信开发者工具进行功能测试和验证。

### 应用原则
- **原则7：链式提示** - 将测试分解为多个步骤
- **原则1：清晰、直接和详细** - 明确测试用例和验证标准
- **原则4：XML标签** - 结构化测试信息

### 提示词模板

```text
<test_scope>
[测试范围：功能测试、UI测试、性能测试等]
</test_scope>

<test_cases>
<test_case>
  "id": "TC001",
  "description": "用户登录功能测试",
  "steps": [
    "打开登录页面",
    "输入手机号和验证码",
    "点击登录按钮",
    "验证跳转到首页"
  ],
  "expected_result": "登录成功，Token保存，跳转到首页",
  "miniprogram_checks": [
    "检查pages.json配置",
    "检查网络请求是否成功",
    "检查Storage是否保存Token"
  ]
</test_case>
</test_cases>

<instructions>
请完成以下测试任务：

**第一步：环境准备**
- 检查pages.json页面配置是否正确
- 确认所有依赖已安装
- 启动微信开发者工具

**第二步：功能测试**
- 按照测试用例执行操作
- 验证预期结果
- 检查页面跳转是否正常
- 验证API请求是否成功

**第三步：小程序特性测试**
- 测试下拉刷新和上拉加载
- 测试页面生命周期
- 测试Storage存储
- 测试网络请求
- 检查控制台错误

**第四步：问题记录**
- 记录发现的bug和问题
- 提供问题复现步骤
- 建议修复方案

请在 <test_execution> 标签中记录测试执行过程，在 <test_results> 标签中输出测试结果（JSON格式）。
</test_execution>

<test_results>
{
  "passed": [],
  "failed": [],
  "issues": []
}
</test_results>
</instructions>
```

### 使用说明
1. **定义测试范围**：在 `<test_scope>` 中说明要测试的内容（功能、UI、性能等）
2. **编写测试用例**：在 `<test_cases>` 中定义具体的测试用例，包括步骤和预期结果
3. **执行测试**：AI会指导测试执行，并在 `<test_execution>` 中记录过程
4. **获取测试结果**：在 `<test_results>` 中输出结构化的测试结果

### 测试要点

#### 功能测试
- 页面跳转是否正常
- 数据加载是否成功
- 用户交互是否正常
- 错误处理是否完善

#### 小程序特性测试
- pages.json 配置是否正确
- 页面生命周期是否正常
- Storage 存储是否正常
- 网络请求是否成功
- 下拉刷新和上拉加载是否正常

#### 性能测试
- 页面加载速度
- 列表滚动流畅度
- 图片加载优化
- 代码包大小

### 输出格式

#### test_execution 标签
应包含：
- 每个测试步骤的执行记录
- 关键步骤的截图说明
- 执行过程中的观察和发现

#### test_results 标签
JSON格式，包含：
- `passed`: 通过的测试用例列表
- `failed`: 失败的测试用例列表
- `issues`: 发现的问题列表，每个问题包含：
  - 问题描述
  - 复现步骤
  - 建议修复方案

---

## 完整工作流程总结

### 流程链条
1. **PM定位** → 建立AI角色和专业身份
2. **需求理解** → 深度分析产品需求
3. **原型还原** → 提取UI组件和交互逻辑
4. **技术思考** → 设计技术实现方案
5. **代码开发** → 生成符合规范的代码
6. **代码调整** → 修复问题并优化
7. **测试验证** → 功能测试和验证

### 关键原则应用
- 每个阶段都应用**原则1（清晰、直接和详细）**确保指令明确
- 使用**原则4（XML标签）**结构化信息
- 复杂任务使用**原则3（思维链）**和**原则7（链式提示）**分解
- 需要示例时使用**原则2（多示例提示）**
- 关键指令使用**原则8（上下文放在指令之前）**确保不被遗忘

### 使用建议
1. **按顺序执行**：严格按照阶段顺序执行，每个阶段的输出作为下一阶段的输入
2. **灵活调整**：根据实际情况可以跳过某些阶段或重复执行某个阶段
3. **保持上下文**：在整个流程中保持对话上下文，确保AI理解项目全貌
4. **迭代优化**：发现问题时回到相应阶段进行调整和优化
5. **小程序特性**：始终考虑小程序平台的特有限制和注意事项

### 注意事项
- 所有提示词模板中的标签和格式都是必需的，不要随意修改
- 每个阶段的输出应该保存，作为后续阶段的输入
- 遇到问题时，优先回到问题发生的阶段进行修复
- 测试阶段需要在微信开发者工具中实际运行
- 注意小程序代码包大小限制和性能优化
- 确保所有页面路径都在pages.json中正确配置

### 小程序特有注意事项
- **页面配置**：所有页面必须在pages.json中配置
- **路由导航**：使用uniRouter工具函数，不要直接使用uni.navigateTo
- **API请求**：使用封装的request函数，注意网络域名配置
- **样式单位**：使用rpx作为响应式单位
- **生命周期**：页面使用onLoad、onShow等，组件使用onMounted等
- **存储API**：使用uni.setStorageSync等API，不要使用localStorage
- **代码包大小**：注意主包和分包大小限制，合理使用分包加载

---

## 总结

本工作流程文档基于UniApp Vue3小程序项目特点，结合AI开发最佳实践制定，旨在提高开发效率和代码质量。在实际使用过程中，可以根据项目实际情况灵活调整和优化流程。

**最后更新**: 2025年1月
**维护者**: SunnyRun

