# UniApp Vue3 Vite 微信小程序项目

基于 Vue3 + TypeScript + Vite + UniApp 的微信小程序开发模板，提供完整的工具函数和最佳实践。

## 📋 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [环境配置](#环境配置)
- [工具函数](#工具函数)
- [API 请求](#api-请求)
- [路由导航](#路由导航)
- [开发规范](#开发规范)
- [构建部署](#构建部署)

## 🛠 技术栈

- **框架**: Vue 3.4+ (Composition API)
- **构建工具**: Vite 5.4+
- **跨端框架**: UniApp 3.0+
- **语言**: TypeScript 4.9+
- **样式**: SCSS
- **包管理**: pnpm / npm

## 📁 项目结构

```
weapp-vue3-vite/
├── conf/                    # 配置文件
│   ├── update-version.js   # 版本更新脚本
│   └── upload.js           # 上传脚本
├── src/
│   ├── api/                # API 接口定义
│   ├── components/         # 公共组件
│   ├── constants/          # 常量定义
│   ├── pages/              # 页面文件
│   │   └── index/          # 首页
│   ├── stores/             # 状态管理 (Pinia)
│   ├── subPages/           # 子页面
│   ├── static/             # 静态资源
│   ├── utils/              # 工具函数
│   │   ├── request.ts      # HTTP 请求封装
│   │   ├── uniRouter.ts    # 路由工具
│   │   └── utilsTool.ts    # 通用工具函数
│   ├── App.vue             # 应用根组件
│   ├── main.ts             # 应用入口
│   ├── pages.json          # 页面配置
│   ├── manifest.json       # 应用配置
│   ├── uni.scss            # 全局样式
│   └── env.d.ts            # 环境变量类型定义
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目配置
```

## 🚀 快速开始

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 启动开发

```bash
# 微信小程序开发
npm run dev

# H5 开发
npm run dev:h5

# H5 SSR 开发
npm run dev:h5:ssr
```

### 类型检查

```bash
npm run type-check
```

## ⚙️ 环境配置

### 环境变量

在项目根目录创建环境变量文件：

**.env.development** (开发环境)
```env
VITE_BASE_API=https://dev-api.example.com
```

**.env.test** (测试环境)
```env
VITE_BASE_API=https://test-api.example.com
```

**.env.production** (生产环境)
```env
VITE_BASE_API=https://api.example.com
```

### 环境变量类型定义

环境变量类型已在 `src/env.d.ts` 中定义：

```typescript
interface ImportMetaEnv {
  readonly VITE_BASE_API: string
  readonly MODE: string
}
```

## 🛠 工具函数

### 基础工具

#### sleep - 异步等待

```typescript
import { sleep } from '@/utils/utilsTool'

// 等待 2 秒
await sleep(2000)
```

#### debounce - 防抖

```typescript
import { debounce } from '@/utils/utilsTool'

const handleSearch = debounce((keyword: string) => {
  console.log(keyword)
}, 300)

handleSearch('test')
```

#### throttle - 节流

```typescript
import { throttle } from '@/utils/utilsTool'

const handleScroll = throttle(() => {
  console.log('scroll')
}, 1000)

handleScroll()
```

### 设备信息

#### getComputerSystem - 获取设备信息

```typescript
import { getComputerSystem } from '@/utils/utilsTool'

const deviceInfo = getComputerSystem()
// {
//   navBarHeight: number,
//   menuRight: number,
//   menuTop: number,
//   menuHeight: number,
//   screenWidth: number
// }
```

### 文件上传

#### uploadFilePromise - 文件上传

```typescript
import { uploadFilePromise } from '@/utils/utilsTool'

const result = await uploadFilePromise({
  url: '/upload',
  filePath: 'temp/file.jpg',
  params: { type: 'avatar' }
})
```

### 参数处理

#### convertParams - 参数处理

```typescript
import { convertParams } from '@/utils/utilsTool'

const params = convertParams({
  name: '  test  ',  // 自动去除空格
  age: 18,
  empty: null        // 自动过滤空值
})
```

#### objectToQueryString - 对象转查询字符串

```typescript
import { objectToQueryString } from '@/utils/utilsTool'

const query = objectToQueryString({ a: 1, b: 2 })
// "a=1&b=2"
```

### 时间格式化

#### formatDateTime - 时间格式化

```typescript
import { formatDateTime } from '@/utils/utilsTool'

formatDateTime(Date.now(), 'YYYY-MM-DD HH:mm:ss')
// "2024-01-01 12:00:00"

formatDateTime(new Date(), 'YYYY年MM月DD日')
// "2024年01月01日"
```

### 文件处理

#### imageToBase64 - 图片转 Base64

```typescript
import { imageToBase64 } from '@/utils/utilsTool'

const base64 = await imageToBase64('temp/image.jpg')
// "data:image/jpeg;base64,..."
```

### 剪贴板

#### copyToClipboard - 复制到剪贴板

```typescript
import { copyToClipboard } from '@/utils/utilsTool'

await copyToClipboard('要复制的内容')
```

### 数字格式化

#### toThousands - 千分位格式化

```typescript
import { toThousands } from '@/utils/utilsTool'

toThousands(1234567.89, 2)
// "1,234,567.89"
```

#### formatMoney - 金额格式化（分转元）

```typescript
import { formatMoney } from '@/utils/utilsTool'

formatMoney(123456)  // 分转元
// "1,234.56"
```

#### transformMoney - 金额格式化（千分位）

```typescript
import { transformMoney } from '@/utils/utilsTool'

transformMoney(123456.78)
// "123,456.78"
```

### 数据脱敏

#### maskPhone - 手机号脱敏

```typescript
import { maskPhone } from '@/utils/utilsTool'

maskPhone('13812345678')
// "138****5678"
```

#### maskName - 姓名脱敏

```typescript
import { maskName } from '@/utils/utilsTool'

maskName('张三')
// "张*"
```

#### maskBankCardNumber - 银行卡号脱敏

```typescript
import { maskBankCardNumber } from '@/utils/utilsTool'

maskBankCardNumber('6222021234567890123')
// "**** **** **** 9012"
```

#### maskIDCardNumber - 身份证号脱敏

```typescript
import { maskIDCardNumber } from '@/utils/utilsTool'

maskIDCardNumber('110101199001011234')
// "110***********1234"
```

### 数据转换

#### toPoint - 百分数转小数

```typescript
import { toPoint } from '@/utils/utilsTool'

toPoint('50%')
// 0.5
```

#### parsePercent - 百分数转整数

```typescript
import { parsePercent } from '@/utils/utilsTool'

parsePercent('50%')
// 50
```

### 下拉框处理

#### handleDropList - 处理下拉框数据

```typescript
import { handleDropList } from '@/utils/utilsTool'

const list = handleDropList([
  { id: 1, name: '选项1' },
  { id: 2, name: '选项2' }
])
// [{ id: 1, name: '选项1', value: 1 }, ...]
```

## 📡 API 请求

### 基础使用

```typescript
import request from '@/utils/request'

// GET 请求
const data = await request({
  url: '/user/info',
  method: 'GET'
})

// POST 请求
const result = await request({
  url: '/user/login',
  method: 'POST',
  params: {
    username: 'admin',
    password: '123456'
  }
})
```

### 请求配置

```typescript
interface RequestConfig {
  url: string                    // 请求地址
  method?: HttpMethod            // 请求方法 (GET/POST/PUT/DELETE)
  params?: string | object | ArrayBuffer  // 请求参数
  options?: RequestOptions       // 请求选项
  baseUrl?: string               // 自定义基础 URL
  loadingText?: string           // 加载提示文字
  showLoading?: boolean          // 是否显示加载提示
}

interface RequestOptions {
  contentType?: string           // 内容类型
  timeout?: number               // 超时时间（毫秒）
}
```

### 完整示例

```typescript
import request from '@/utils/request'

// 带完整配置的请求
const result = await request({
  url: '/api/user',
  method: 'POST',
  params: {
    name: 'test',
    age: 18
  },
  options: {
    contentType: 'application/json',
    timeout: 10000
  },
  loadingText: '加载中...',
  showLoading: true
})
```

### 响应数据结构

```typescript
interface ApiResponse<T> {
  code: number      // 业务状态码 (0 表示成功)
  message: string    // 提示信息
  data: T           // 响应数据
}
```

### 错误处理

请求函数会自动处理以下情况：

- **HTTP 200 + code === 0**: 返回数据
- **HTTP 200 + code !== 0**: 显示错误提示，返回数据
- **HTTP 403**: 自动跳转登录页，清除 token
- **其他 HTTP 错误**: 显示错误提示，reject Promise
- **网络错误**: 显示错误提示，reject Promise

### 使用 API 前缀

```typescript
import request, { prefix } from '@/utils/request'

// 使用前缀
const data = await request({
  url: `${prefix}/user/info`  // /api/v1/weapp/user/info
})
```

## 🧭 路由导航

### navigateTo - 打开新页面

```typescript
import { navigateTo } from '@/utils/uniRouter'

// 简单跳转
navigateTo('/pages/user/profile')

// 带参数跳转
navigateTo('/pages/user/profile', {
  id: 123,
  name: 'test'
})
// 跳转到: /pages/user/profile?id=123&name=test
```

### redirectTo - 关闭当前页面并跳转

```typescript
import { redirectTo } from '@/utils/uniRouter'

redirectTo('/pages/login', { from: 'home' })
```

### navBack - 返回上一页

```typescript
import { navBack } from '@/utils/uniRouter'

navBack()        // 返回 1 页
navBack(2)       // 返回 2 页
```

### switchTab - 跳转到 TabBar 页面

```typescript
import { switchTab } from '@/utils/uniRouter'

switchTab('/pages/index')
```

### reLaunch - 重新加载页面

```typescript
import { reLaunch } from '@/utils/uniRouter'

reLaunch('/pages/index', { refresh: true })
```

### buildQueryString - 构建查询字符串

```typescript
import { buildQueryString } from '@/utils/uniRouter'

const query = buildQueryString({ a: 1, b: 'test' })
// "?a=1&b=test"
```

## 📝 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 使用 Composition API (setup script)
- 函数命名采用驼峰命名法
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### 目录规范

- `api/`: API 接口定义，按模块划分
- `components/`: 公共组件，按功能划分
- `pages/`: 页面文件，一个页面一个文件夹
- `stores/`: 状态管理，使用 Pinia
- `utils/`: 工具函数，按功能分类
- `constants/`: 常量定义

### 类型定义

所有工具函数都提供了完整的 TypeScript 类型定义，建议充分利用类型提示。

### 错误处理

- API 请求统一使用 `request` 函数
- 路由跳转统一使用 `uniRouter` 工具
- 错误信息统一提示，避免重复代码

## 🏗 构建部署

### 构建命令

```bash
# 测试环境构建
npm run build:test

# 生产环境构建
npm run build:prod

# H5 构建
npm run build:h5

# H5 SSR 构建
npm run build:h5:ssr
```

### 上传小程序

```bash
# 测试环境上传
npm run upload:test

# 生产环境上传
npm run upload:prod
```

### 版本管理

```bash
# 更新版本号
npm run update-version
```

## 📦 依赖说明

### 核心依赖

- `vue`: Vue 3 框架
- `@dcloudio/uni-app`: UniApp 核心库
- `@dcloudio/vite-plugin-uni`: Vite UniApp 插件
- `vue-i18n`: 国际化支持

### 开发依赖

- `typescript`: TypeScript 编译器
- `vite`: 构建工具
- `vue-tsc`: Vue TypeScript 检查
- `sass`: SCSS 预处理器

## 🔧 配置说明

### Vite 配置

- 路径别名: `@` -> `src`
- 构建优化: Terser 压缩，代码分割
- 开发环境: 保留 console，生成 sourcemap
- 生产环境: 移除 console，不生成 sourcemap

### TypeScript 配置

- 继承 `@vue/tsconfig` 配置
- 路径映射: `@/*` -> `./src/*`
- 类型检查: 包含所有 `.ts`、`.tsx`、`.vue` 文件

## 📄 许可证

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**: 首次使用前，请确保：

1. 已安装 Node.js 16+ 和 pnpm/npm
2. 已创建环境变量文件 (`.env.development` 等)
3. 已配置微信小程序 AppID (在 `src/manifest.json` 中)
4. 已安装项目依赖 (`pnpm install` 或 `npm install`)

