# AI前端开发完整流程方案（从0到1）

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
3. 熟悉 React 19 + TypeScript + Vite + Redux Toolkit + Ant Design 5 技术栈
4. 遵循 Hooks-Admin 项目的编码规范和最佳实践
5. 能够进行需求分析、原型解读、技术选型和开发规划
</role>

<context>
项目技术栈：
- 框架: React 19.1.0 + TypeScript 5.8.3
- 构建工具: Vite 7.1.7
- 状态管理: Redux Toolkit 2.8.2 + Redux Persist 6.0.0
- UI组件库: Ant Design 5.27.4
- 路由: React Router v7.6.3
- 样式: Less 4.3.0

项目规范：
- 组件文件使用 PascalCase
- 工具函数使用 camelCase
- 样式文件统一命名为 index.less
- 代码风格：单引号、无分号、2空格缩进
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
1. 用户名/密码登录
2. 记住密码功能
3. 登录状态持久化
4. 登录失败错误提示
边界条件：
- 密码长度限制：6-20位
- 登录失败3次后显示验证码
- Token过期时间：7天
</example>
<example>
需求：数据表格管理
核心功能点：
1. 数据列表展示
2. 分页功能
3. 搜索筛选
4. 批量操作
边界条件：
- 每页默认10条
- 支持多条件组合搜索
- 批量操作需要二次确认
</example>
</examples>

<instructions>
请基于以上需求文档，完成以下分析任务：

1. **需求解构**：识别核心功能模块和子功能点
2. **技术分析**：分析每个功能点的技术实现方案
3. **依赖识别**：列出需要的新增API接口、组件、状态管理等
4. **边界条件**：识别异常情况、边界场景和错误处理需求
5. **开发优先级**：按重要性和依赖关系排序开发任务

请在 <thinking> 标签中展示你的分析过程，在 <analysis_result> 标签中输出结构化分析结果（JSON格式）。
</thinking>

<analysis_result>
{
  "core_modules": [],
  "technical_approach": {},
  "dependencies": {
    "apis": [],
    "components": [],
    "redux_slices": []
  },
  "edge_cases": [],
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
- `dependencies`: 依赖项（API、组件、Redux slices）
- `edge_cases`: 边界条件和异常场景
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
原型描述：登录页面，左侧为品牌Logo和宣传图，右侧为登录表单
UI分析结果：
{
  "layout": "flex布局，左右分栏",
  "components": [
    {
      "name": "LoginContainer",
      "type": "布局组件",
      "children": ["LoginLeft", "LoginForm"]
    },
    {
      "name": "LoginForm",
      "type": "表单组件",
      "props": {
        "fields": ["username", "password"],
        "actions": ["登录", "记住密码"]
      },
      "antd_components": ["Form", "Input", "Button", "Checkbox"]
    }
  ],
  "styles": {
    "container": "100vh高度，flex布局",
    "left_panel": "宽度50%，背景渐变色",
    "form_panel": "宽度50%，居中表单"
  }
}
</example>
</examples>

<instructions>
请基于以上原型设计，完成以下任务：

1. **组件识别**：列出所有需要开发的UI组件，标注组件层级关系
2. **Ant Design映射**：将设计元素映射到对应的Ant Design组件
3. **布局分析**：分析页面布局结构（Flex、Grid等）
4. **样式提取**：提取关键样式属性（颜色、间距、字体等）
5. **交互逻辑**：识别用户交互行为（点击、输入、悬停等）

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
  - `type`: 组件类型（布局组件、表单组件、展示组件等）
  - `children`: 子组件列表
  - `props`: 组件属性
  - `antd_components`: 使用的Ant Design组件
- `styles`: 关键样式属性
- `interactions`: 交互行为列表

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
- 确定状态管理方案（本地状态 vs Redux）
- 设计数据流和组件通信方式

**第二步：文件规划**
- 列出需要创建的新文件（组件、API、Redux slice等）
- 确定文件命名和目录结构
- 识别可以复用的现有组件

**第三步：接口设计**
- 设计API接口的数据结构
- 定义请求参数和响应格式
- 规划错误处理机制

**第四步：状态管理设计**
- 设计Redux state结构
- 定义actions和reducers
- 规划状态持久化需求

**第五步：组件设计**
- 设计组件Props接口
- 规划组件内部状态
- 设计组件生命周期和副作用

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

#### 2. 文件规划
- 需要创建的文件列表
- 文件路径和命名
- 可复用的现有组件

#### 3. 接口设计
- API接口列表
- 请求参数和响应格式（TypeScript接口定义）
- 错误处理策略

#### 4. 状态管理设计
- Redux state结构定义
- Actions列表
- Reducers设计
- 持久化配置

#### 5. 组件设计
- 组件Props接口定义
- 组件内部状态规划
- 生命周期和副作用设计

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
// ✅ 正确的组件写法
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '@/api/login'
import { HOME_URL } from '@/routers'
import { setToken } from '@/redux/modules/global'
import { useDispatch } from '@/redux'
import './index.less'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)

  const onFinish = async (loginForm: any) => {
    try {
      setLoading(true)
      const { data } = await loginApi(loginForm)
      dispatch(setToken(data!.access_token))
      message.success('登录成功！')
      navigate(HOME_URL)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form form={form} onFinish={onFinish}>
      {/* ... */}
    </Form>
  )
}

export default LoginForm
</example>
</code_examples>

<instructions>
请基于技术设计方案，生成完整的代码实现。要求：

1. **严格遵循项目规范**：
   - 使用单引号，无分号，2空格缩进
   - 组件文件使用PascalCase命名
   - 样式文件统一命名为index.less
   - 导入顺序：React → 第三方库 → 项目内部 → 类型 → 样式

2. **代码质量**：
   - 所有函数添加TypeScript类型定义
   - 使用项目封装的useSelector和useDispatch
   - 错误处理使用try-catch
   - 异步操作显示loading状态

3. **输出格式**：
   - 每个文件单独输出，使用代码块格式
   - 文件路径作为注释标注在代码块上方
   - 按依赖顺序输出（API → Redux → 组件）

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
// 1. React相关
import { useState } from 'react'

// 2. 第三方库
import { Button, Form } from 'antd'
import { useNavigate } from 'react-router-dom'

// 3. 项目内部（使用@别名）
import { loginApi } from '@/api/login'
import { useDispatch } from '@/redux'

// 4. 类型定义
import type { UserInfo } from '@/redux/interface'

// 5. 样式文件（最后）
import './index.less'
```

#### 代码风格
- 单引号：`'string'` 而非 `"string"`
- 无分号：语句末尾不使用分号
- 2空格缩进：不使用Tab
- 箭头函数参数必须加括号：`(param) => {}`

#### 组件结构
- 函数式组件
- 使用Hooks管理状态
- 默认导出组件
- 组件名与文件名一致

### 输出顺序
1. **API文件** (`src/api/`)
2. **Redux相关** (`src/redux/modules/`, `src/redux/interface/`)
3. **组件文件** (`src/components/`, `src/views/`)
4. **样式文件** (`*.less`)

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

**第二步：修复方案**
- 设计具体的修复方案
- 考虑对现有代码的影响
- 确保修复后符合项目规范

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
1. **编译错误**：TypeScript类型错误、导入路径错误等
2. **运行时错误**：空指针、未定义变量、异步处理错误等
3. **逻辑错误**：业务逻辑不正确、状态更新错误等
4. **规范问题**：不符合项目编码规范

#### 诊断步骤
1. **错误定位**：找到具体的错误位置
2. **原因分析**：分析为什么会出现这个错误
3. **影响评估**：评估错误对整体功能的影响
4. **修复策略**：确定最佳的修复方案

### 修复方案要点

#### 修复原则
1. **最小改动**：尽量用最小的改动解决问题
2. **保持规范**：修复后必须符合项目规范
3. **向后兼容**：不影响其他功能
4. **可测试性**：修复后代码应该易于测试

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

#### fix_plan 标签
应包含：
- 修复策略说明
- 具体修改点列表
- 修改原因说明

#### fixed_code 标签
应包含：
- 修复后的完整代码
- 关键修改点的注释说明

---

## 阶段七：MCP测试与验证

### 目标
使用MCP工具进行自动化测试和验证。

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
    "输入用户名和密码",
    "点击登录按钮",
    "验证跳转到首页"
  ],
  "expected_result": "登录成功，跳转到首页",
  "mcp_tools": ["browser_navigate", "browser_type", "browser_click", "browser_snapshot"]
</test_case>
</test_cases>

<instructions>
请使用MCP工具完成以下测试任务：

**第一步：环境准备**
- 启动开发服务器（如需要）
- 导航到测试页面
- 截图记录初始状态

**第二步：功能测试**
- 按照测试用例执行操作
- 使用browser_snapshot记录关键步骤
- 验证预期结果

**第三步：结果验证**
- 截图对比实际结果和预期结果
- 检查控制台错误（browser_console_messages）
- 检查网络请求（browser_network_requests）

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
3. **执行测试**：AI会使用MCP工具执行测试，并在 `<test_execution>` 中记录过程
4. **获取测试结果**：在 `<test_results>` 中输出结构化的测试结果

### MCP工具说明

#### 常用MCP工具
- `browser_navigate`: 导航到指定URL
- `browser_snapshot`: 捕获页面快照
- `browser_click`: 点击页面元素
- `browser_type`: 输入文本
- `browser_console_messages`: 获取控制台消息
- `browser_network_requests`: 获取网络请求信息

#### 测试流程
1. **环境准备**：确保开发服务器运行，导航到测试页面
2. **执行操作**：按照测试用例步骤执行操作
3. **验证结果**：截图、检查控制台、检查网络请求
4. **记录问题**：发现问题时记录详细信息

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
7. **MCP测试** → 自动化测试验证

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

### 注意事项
- 所有提示词模板中的标签和格式都是必需的，不要随意修改
- 每个阶段的输出应该保存，作为后续阶段的输入
- 遇到问题时，优先回到问题发生的阶段进行修复
- MCP测试阶段需要确保开发服务器正在运行

