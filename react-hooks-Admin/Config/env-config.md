# 环境变量配置说明

## 概述
本项目使用 Vite 的环境变量管理系统，通过 `.env` 文件配置不同环境的变量。

## 环境文件

### 文件列表
```
Project/
├── .env                    # 所有环境的公共变量
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
└── .env.test               # 测试环境变量（可选）
```

### 优先级
```
.env.local > .env.[mode].local > .env.[mode] > .env
```

## 变量命名规范

### 规则
1. **必须以 `VITE_` 开头**（暴露给客户端的变量）
2. 使用大写字母和下划线
3. 名称要有意义，体现用途

### 示例
```bash
# ✅ 正确
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=后台管理系统
VITE_ENABLE_MOCK=false

# ❌ 错误（不以 VITE_ 开头，客户端无法访问）
API_URL=https://api.example.com
APP_TITLE=后台管理系统
```

## 开发环境配置

### .env.development
```bash
# 应用标题
VITE_APP_TITLE=后台管理系统（开发）

# API 基础地址
VITE_API_URL=http://localhost:3000

# 路由模式：hash | history
VITE_ROUTER_MODE=hash

# 公共路径
VITE_PUBLIC_PATH=/

# 开发服务器配置
VITE_HOST=0.0.0.0
VITE_PORT=5173
VITE_OPEN=true

# 是否开启 Mock 数据
VITE_ENABLE_MOCK=true

# 是否开启代理
VITE_USE_PROXY=true

# 代理目标地址
VITE_PROXY_TARGET=https://mock.mengxuegu.com/mock/xxx

# 是否显示构建信息
VITE_DROP_CONSOLE=false

# 是否生成 sourcemap
VITE_SOURCEMAP=true
```

## 生产环境配置

### .env.production
```bash
# 应用标题
VITE_APP_TITLE=后台管理系统

# API 基础地址
VITE_API_URL=https://api.example.com

# 路由模式：hash | history
VITE_ROUTER_MODE=history

# 公共路径（根据部署路径设置）
VITE_PUBLIC_PATH=/admin/

# 是否开启 Mock 数据
VITE_ENABLE_MOCK=false

# 构建压缩方式：gzip | brotli | none
VITE_BUILD_COMPRESS=gzip

# 是否删除 console
VITE_DROP_CONSOLE=true

# 是否生成 sourcemap
VITE_SOURCEMAP=false

# 是否生成构建分析报告
VITE_REPORT=false

# CDN 地址（如使用 CDN）
VITE_CDN_URL=https://cdn.example.com
```

## 测试环境配置

### .env.test
```bash
# 应用标题
VITE_APP_TITLE=后台管理系统（测试）

# API 基础地址
VITE_API_URL=https://test-api.example.com

# 路由模式
VITE_ROUTER_MODE=history

# 公共路径
VITE_PUBLIC_PATH=/

# 是否开启 Mock 数据
VITE_ENABLE_MOCK=false

# 是否删除 console
VITE_DROP_CONSOLE=false

# 是否生成 sourcemap
VITE_SOURCEMAP=true
```

## 在代码中使用

### 访问环境变量
```typescript
// 在 TypeScript 文件中
const apiUrl = import.meta.env.VITE_API_URL
const appTitle = import.meta.env.VITE_APP_TITLE
const isDev = import.meta.env.DEV  // 内置变量
const isProd = import.meta.env.PROD  // 内置变量
const mode = import.meta.env.MODE  // 当前模式

console.log('API 地址:', apiUrl)
console.log('应用标题:', appTitle)
console.log('是否开发环境:', isDev)
```

### 类型定义
```typescript
// types/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_ROUTER_MODE: 'hash' | 'history'
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_HOST: string
  readonly VITE_PORT: string
  readonly VITE_OPEN: string
  readonly VITE_ENABLE_MOCK: string
  readonly VITE_USE_PROXY: string
  readonly VITE_PROXY_TARGET: string
  readonly VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none'
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_SOURCEMAP: string
  readonly VITE_REPORT: string
  readonly VITE_CDN_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

### 在 vite.config.ts 中使用
```typescript
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  return {
    base: env.VITE_PUBLIC_PATH,
    server: {
      host: env.VITE_HOST,
      port: Number(env.VITE_PORT),
      open: env.VITE_OPEN === 'true'
    },
    // 其他配置...
  }
})
```

## Vite 内置环境变量

```typescript
// 应用是否运行在开发环境
import.meta.env.DEV  // boolean

// 应用是否运行在生产环境
import.meta.env.PROD  // boolean

// 当前模式：development | production | test
import.meta.env.MODE  // string

// 应用的基础 URL
import.meta.env.BASE_URL  // string

// 是否为 SSR 构建
import.meta.env.SSR  // boolean
```

## 常见配置项

### API 相关
```bash
# API 基础地址
VITE_API_URL=https://api.example.com

# API 超时时间（毫秒）
VITE_API_TIMEOUT=10000

# API 请求重试次数
VITE_API_RETRY=3
```

### 应用相关
```bash
# 应用名称
VITE_APP_NAME=Admin System

# 应用版本
VITE_APP_VERSION=1.0.0

# 应用描述
VITE_APP_DESCRIPTION=后台管理系统
```

### 功能开关
```bash
# 是否开启 Mock 数据
VITE_ENABLE_MOCK=false

# 是否开启权限系统
VITE_ENABLE_AUTH=true

# 是否开启国际化
VITE_ENABLE_I18N=false

# 是否开启主题切换
VITE_ENABLE_THEME=true
```

### 第三方服务
```bash
# 监控服务（Sentry）
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# 百度统计
VITE_BAIDU_ANALYTICS=xxx

# Google Analytics
VITE_GA_ID=UA-xxx
```

## 环境变量最佳实践

### 1. 敏感信息不提交
```bash
# ❌ 错误：敏感信息直接写在 .env 文件中
VITE_API_KEY=sk-xxx

# ✅ 正确：使用 .env.local（不提交到 Git）
# .env.local
VITE_API_KEY=sk-xxx

# .gitignore
.env.local
.env.*.local
```

### 2. 提供默认值
```typescript
// ✅ 推荐：提供默认值
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 10000
```

### 3. 类型转换
```typescript
// 环境变量都是字符串，需要转换类型

// 转换为布尔值
const enableMock = import.meta.env.VITE_ENABLE_MOCK === 'true'

// 转换为数字
const port = Number(import.meta.env.VITE_PORT) || 5173

// 转换为数组
const allowedDomains = import.meta.env.VITE_ALLOWED_DOMAINS?.split(',') || []
```

### 4. 环境判断
```typescript
// 判断当前环境
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD

// 根据环境执行不同逻辑
if (isDev) {
  console.log('开发环境，启用调试功能')
}

if (isProd) {
  // 生产环境配置
}
```

### 5. 配置验证
```typescript
// utils/validateEnv.ts
export function validateEnv() {
  const requiredEnvVars = [
    'VITE_API_URL',
    'VITE_APP_TITLE'
  ]
  
  const missingVars = requiredEnvVars.filter(
    key => !import.meta.env[key]
  )
  
  if (missingVars.length > 0) {
    throw new Error(
      `缺少必需的环境变量：${missingVars.join(', ')}`
    )
  }
}

// main.tsx
validateEnv()
```

## 运行命令

### 指定模式运行
```bash
# 开发模式（默认 development）
npm run dev

# 生产模式构建
npm run build

# 使用指定模式
vite --mode test
vite build --mode production
```

### 命令行传递变量
```bash
# package.json
{
  "scripts": {
    "dev": "vite --mode development",
    "build:test": "vite build --mode test",
    "build:prod": "vite build --mode production"
  }
}
```

## 常见问题

### Q1: 为什么我的环境变量没有生效？
**原因**：
- 变量名没有以 `VITE_` 开头
- 修改环境变量后没有重启开发服务器

**解决**：
```bash
# 1. 检查变量名
VITE_API_URL=xxx  # ✅ 正确
API_URL=xxx       # ❌ 错误

# 2. 重启开发服务器
Ctrl + C  # 停止
npm run dev  # 重新启动
```

### Q2: 如何在不同环境使用不同的 API 地址？
```bash
# .env.development
VITE_API_URL=http://localhost:3000

# .env.production
VITE_API_URL=https://api.example.com

# .env.test
VITE_API_URL=https://test-api.example.com
```

### Q3: 如何获取环境变量的智能提示？
```typescript
// 在 types/vite-env.d.ts 中定义类型
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // 添加其他变量...
}
```

## 安全注意事项

1. **不要在环境变量中存储密钥**
   - API 密钥、Token 等敏感信息不应该暴露给前端
   - 这些信息应该在后端处理

2. **使用 .env.local 存储本地配置**
   - 添加到 `.gitignore`
   - 不提交到代码仓库

3. **生产环境变量加密存储**
   - 使用 CI/CD 的 Secret 管理
   - 不在代码中明文存储

## 总结

1. ✅ 环境变量必须以 `VITE_` 开头
2. ✅ 不同环境使用不同的 `.env` 文件
3. ✅ 敏感信息使用 `.env.local` 且不提交
4. ✅ 提供完整的 TypeScript 类型定义
5. ✅ 在代码中提供默认值
6. ✅ 修改环境变量后重启开发服务器
7. ✅ 注意类型转换（所有环境变量都是字符串）

