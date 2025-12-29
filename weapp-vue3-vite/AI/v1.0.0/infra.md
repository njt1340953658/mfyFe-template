# UniApp 微信小程序项目 - 基础架构文档

## 系统背景

本项目是基于 UniApp 框架开发的微信小程序管理后台，采用 Vue 3 Composition API + TypeScript + Vite 技术栈，提供跨端开发能力和完整的工程化解决方案。

## 技术栈概览

### 核心技术
- **前端框架**: Vue 3.4+ (Composition API)
- **跨端框架**: UniApp 3.0+
- **构建工具**: Vite 5.4+
- **语言**: TypeScript 4.9+
- **状态管理**: Pinia 2.0+
- **样式方案**: SCSS + UniApp 样式变量

### 开发工具
- **包管理**: pnpm / npm
- **代码规范**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **TypeScript**: 严格模式

---

## 架构设计

### 1. 整体架构

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│    (pages + components + subPages)      │
├─────────────────────────────────────────┤
│         Application Layer               │
│       (Stores + Composables)            │
├─────────────────────────────────────────┤
│          Service Layer                  │
│      (API + Utils + Constants)          │
├─────────────────────────────────────────┤
│         UniApp Runtime Layer            │
│   (wx API + uni API + Platform Bridge)  │
└─────────────────────────────────────────┘
```

### 2. 分层说明

#### **表现层 (Presentation Layer)**
- **职责**: 页面展示、用户交互、UI 组件
- **技术**: Vue 3 SFC、UniApp 组件、SCSS
- **特点**: 
  - 小程序页面结构（pages.json 配置）
  - 分包加载优化
  - 组件复用和封装

#### **应用层 (Application Layer)**
- **职责**: 业务逻辑、状态管理、数据流转
- **技术**: Pinia、Composition API、Composables
- **特点**:
  - 响应式状态管理
  - 持久化缓存（localStorage）
  - 组件间通信

#### **服务层 (Service Layer)**
- **职责**: 数据获取、工具函数、业务封装
- **技术**: Axios 风格封装、UniApp API 封装
- **特点**:
  - 统一请求拦截
  - 路由跳转封装
  - 通用工具函数库

#### **运行时层 (UniApp Runtime)**
- **职责**: 平台适配、原生能力调用
- **技术**: UniApp 框架、微信小程序 API
- **特点**:
  - 跨端兼容
  - 原生能力桥接

---

## 核心模块

### 1. 路由系统

#### 配置方式
```json
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    }
  ],
  "subPackages": [
    {
      "root": "subPages",
      "pages": []
    }
  ]
}
```

#### 路由工具 (utils/uniRouter.ts)
```typescript
// 页面跳转封装
export const navigateTo = (url: string, params?: any) => {
  const query = params ? '?' + Object.entries(params)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&') : '';
  uni.navigateTo({ url: url + query });
};

// 重定向跳转
export const redirectTo = (url: string) => {
  uni.redirectTo({ url });
};

// Tab 切换
export const switchTab = (url: string) => {
  uni.switchTab({ url });
};
```

### 2. 状态管理 (Pinia)

#### Store 结构
```typescript
// stores/caching.ts
import { defineStore } from 'pinia';

export const useCachingStore = defineStore('caching', {
  state: () => ({
    token: uni.getStorageSync('token') || '',
    userInfo: uni.getStorageSync('userInfo') || null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  
  actions: {
    setToken(token: string) {
      this.token = token;
      uni.setStorageSync('token', token);
    },
    
    clearCache() {
      this.token = '';
      this.userInfo = null;
      uni.clearStorageSync();
    }
  }
});
```

### 3. HTTP 请求封装

#### 请求拦截器
```typescript
// utils/request.ts
interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: any;
}

export const request = <T = any>(config: RequestConfig): Promise<T> => {
  const { token } = useCachingStore();
  
  return new Promise((resolve, reject) => {
    uni.request({
      url: config.url,
      method: config.method || 'GET',
      data: config.data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...config.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data as T);
        } else {
          reject(res);
        }
      },
      fail: reject
    });
  });
};
```

### 4. 页面生命周期

#### UniApp 生命周期
```typescript
// 页面生命周期
onLoad((options) => {
  // 页面加载
});

onShow(() => {
  // 页面显示
});

onReady(() => {
  // 页面初次渲染完成
});

onHide(() => {
  // 页面隐藏
});

onUnload(() => {
  // 页面卸载
});

// 下拉刷新
onPullDownRefresh(() => {
  // 刷新逻辑
  uni.stopPullDownRefresh();
});

// 上拉加载
onReachBottom(() => {
  // 加载更多
});
```

---

## 目录结构

```
weapp-vue3-vite/
├── AI/                          # 需求文档和版本管理
│   └── v1.0.0/
│       ├── infra.md            # 基础架构文档（本文件）
│       ├── spec/               # 需求规格说明
│       ├── tech_solution/      # 技术方案
│       └── tasks/              # 任务拆分
├── comSkills/                   # 技能文档集合
│   ├── README.md
│   ├── vue3-composition-api.md
│   ├── uniapp-guide.md
│   └── pinia.md
├── Config/                      # 配置和规范文档
│   ├── README.md
│   ├── coding-standards.md
│   ├── git-commit-guide.md
│   ├── development-workflow.md
│   └── env-config.md
├── Project/                     # 项目源代码
│   ├── conf/                   # 构建配置
│   │   ├── update-version.js  # 版本更新
│   │   └── upload.js          # 上传脚本
│   ├── src/
│   │   ├── api/               # API 接口
│   │   ├── components/        # 公共组件
│   │   ├── constants/         # 常量定义
│   │   ├── pages/             # 页面（主包）
│   │   ├── subPages/          # 分包页面
│   │   ├── stores/            # 状态管理
│   │   ├── utils/             # 工具函数
│   │   ├── static/            # 静态资源
│   │   ├── App.vue            # 根组件
│   │   ├── main.ts            # 入口文件
│   │   ├── pages.json         # 页面配置
│   │   ├── manifest.json      # 应用配置
│   │   └── uni.scss           # 全局样式
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .gitignore
├── LICENSE
└── README.md
```

---

## 核心配置

### 1. manifest.json（应用配置）

```json
{
  "name": "小程序名称",
  "appid": "微信小程序 AppID",
  "description": "应用描述",
  "versionName": "1.0.0",
  "versionCode": "100",
  "mp-weixin": {
    "appid": "wxxxxxxxxxxx",
    "setting": {
      "urlCheck": false,
      "minified": true
    },
    "permission": {
      "scope.userLocation": {
        "desc": "用于定位功能"
      }
    }
  }
}
```

### 2. pages.json（页面配置）

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "enablePullDownRefresh": true
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "小程序",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/home-active.png",
        "text": "首页"
      }
    ]
  },
  "subPackages": [
    {
      "root": "subPages",
      "pages": []
    }
  ]
}
```

### 3. vite.config.ts

```typescript
import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
  plugins: [uni()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

---

## 性能优化

### 1. 分包加载
- **主包**: 首页、公共组件
- **分包**: 按业务模块划分（用户中心、订单管理等）
- **预下载**: 配置 `preloadRule`

### 2. 图片优化
- 使用 WebP 格式
- 图片压缩和懒加载
- 使用 CDN 托管

### 3. 请求优化
- 接口合并和缓存
- 防抖节流
- 骨架屏加载

### 4. 代码优化
- Tree-shaking
- 按需引入组件
- 路由懒加载

---

## 安全策略

### 1. 数据安全
- Token 本地加密存储
- 敏感信息不存储在前端
- HTTPS 通信

### 2. 权限控制
- 登录状态验证
- 页面访问权限
- API 权限校验

### 3. 代码安全
- XSS 防护
- 输入验证和过滤
- 敏感信息混淆

---

## 构建部署

### 开发环境
```bash
npm run dev           # 微信开发者工具开发
```

### 测试环境
```bash
npm run build:test    # 构建测试版本
npm run upload:test   # 上传到微信后台
```

### 生产环境
```bash
npm run build:prod    # 构建生产版本
npm run upload:prod   # 上传到微信后台
```

---

## 技术演进

### 当前版本 (v1.0.0)
- ✅ Vue 3 + TypeScript
- ✅ Pinia 状态管理
- ✅ Vite 构建工具
- ✅ 基础工具封装

### 未来规划
- 🔄 性能监控和埋点
- 🔄 自动化测试
- 🔄 CI/CD 集成
- 🔄 微前端架构

---

## 参考资料

- [UniApp 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Vite 官方文档](https://vitejs.dev/)

