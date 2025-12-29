# UniApp 开发指南

## 1. 概述

UniApp 是一个使用 Vue.js 开发跨平台应用的前端框架，开发者编写一套代码，可发布到 iOS、Android、Web 以及各种小程序平台。

### 核心特性
- 📱 **一套代码，多端运行**: 支持10+平台
- 🎨 **丰富的组件库**: 内置组件 + uni-ui
- 🔌 **完善的 API**: 封装各平台原生 API
- 🚀 **高性能**: 接近原生应用的体验
- 💪 **TypeScript 支持**: 完整的类型定义

---

## 2. 项目配置

### 2.1 manifest.json（应用配置）

```json
{
  "name": "应用名称",
  "appid": "__UNI__XXXXXX",
  "description": "应用描述",
  "versionName": "1.0.0",
  "versionCode": "100",
  
  /* 微信小程序配置 */
  "mp-weixin": {
    "appid": "wxxxxxxxxxxx",
    "setting": {
      "urlCheck": false,           // 开发时不校验合法域名
      "es6": true,                  // ES6 转 ES5
      "postcss": true,              // 上传代码时样式自动补全
      "minified": true,             // 上传代码时自动压缩
      "enhance": true               // 增强编译
    },
    "usingComponents": true,        // 使用组件
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序定位"
      }
    }
  },
  
  /* H5 配置 */
  "h5": {
    "title": "应用标题",
    "router": {
      "mode": "hash"                // 路由模式
    }
  }
}
```

---

### 2.2 pages.json（页面配置）

```json
{
  /* 全局样式 */
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8",
    "enablePullDownRefresh": false
  },
  
  /* 页面路由 */
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "enablePullDownRefresh": true
      }
    },
    {
      "path": "pages/my/index",
      "style": {
        "navigationBarTitleText": "我的"
      }
    }
  ],
  
  /* 分包配置 */
  "subPackages": [
    {
      "root": "subPages",
      "pages": [
        {
          "path": "user/list",
          "style": {
            "navigationBarTitleText": "用户列表"
          }
        }
      ]
    }
  ],
  
  /* 预下载分包 */
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["subPages"]
    }
  },
  
  /* TabBar 配置 */
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
      },
      {
        "pagePath": "pages/my/index",
        "iconPath": "static/tabbar/my.png",
        "selectedIconPath": "static/tabbar/my-active.png",
        "text": "我的"
      }
    ]
  }
}
```

---

## 3. 生命周期

### 3.1 应用生命周期

```typescript
// App.vue
import { onLaunch, onShow, onHide, onError } from '@dcloudio/uni-app';

onLaunch((options) => {
  console.log('App Launch', options);
  // 应用初始化
});

onShow((options) => {
  console.log('App Show', options);
  // 应用显示
});

onHide(() => {
  console.log('App Hide');
  // 应用隐藏
});

onError((error) => {
  console.log('App Error', error);
  // 应用错误
});
```

---

### 3.2 页面生命周期

```typescript
import {
  onLoad,
  onShow,
  onReady,
  onHide,
  onUnload,
  onPullDownRefresh,
  onReachBottom,
  onPageScroll,
  onShareAppMessage
} from '@dcloudio/uni-app';

// 页面加载
onLoad((options) => {
  console.log('页面加载，参数:', options);
  // 获取路由参数
  // 初始化数据
});

// 页面显示
onShow(() => {
  console.log('页面显示');
  // 每次进入页面都会触发
  // 适合刷新数据
});

// 页面初次渲染完成
onReady(() => {
  console.log('页面初次渲染完成');
  // 可以获取 DOM 节点信息
});

// 页面隐藏
onHide(() => {
  console.log('页面隐藏');
  // 清理定时器等
});

// 页面卸载
onUnload(() => {
  console.log('页面卸载');
  // 清理资源
});

// 下拉刷新
onPullDownRefresh(() => {
  console.log('下拉刷新');
  // 刷新数据
  setTimeout(() => {
    uni.stopPullDownRefresh();
  }, 1000);
});

// 上拉加载
onReachBottom(() => {
  console.log('触底加载');
  // 加载更多数据
});

// 页面滚动
onPageScroll((e) => {
  console.log('页面滚动', e.scrollTop);
});

// 分享
onShareAppMessage(() => {
  return {
    title: '分享标题',
    path: '/pages/index/index',
    imageUrl: '/static/share.png'
  };
});
```

---

## 4. 路由导航

### 4.1 路由跳转

```typescript
// 1. navigateTo - 保留当前页面，跳转到应用内某个页面
uni.navigateTo({
  url: '/pages/detail/index?id=1&name=test',
  success: () => {
    console.log('跳转成功');
  },
  fail: () => {
    console.log('跳转失败');
  }
});

// 2. redirectTo - 关闭当前页面，跳转到应用内某个页面
uni.redirectTo({
  url: '/pages/login/index'
});

// 3. reLaunch - 关闭所有页面，打开到应用内某个页面
uni.reLaunch({
  url: '/pages/index/index'
});

// 4. switchTab - 跳转到 tabBar 页面，并关闭其他非 tabBar 页面
uni.switchTab({
  url: '/pages/index/index'
});

// 5. navigateBack - 返回上一页或多级页面
uni.navigateBack({
  delta: 1  // 返回的页面数，默认 1
});
```

### 4.2 路由工具封装

```typescript
// utils/uniRouter.ts
interface NavigateOptions {
  url: string;
  params?: Record<string, any>;
  type?: 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab';
}

/**
 * 统一路由跳转
 */
export const navigateTo = ({ url, params, type = 'navigateTo' }: NavigateOptions) => {
  // 拼接查询参数
  if (params) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    url = `${url}?${query}`;
  }

  // 根据类型跳转
  switch (type) {
    case 'navigateTo':
      uni.navigateTo({ url });
      break;
    case 'redirectTo':
      uni.redirectTo({ url });
      break;
    case 'reLaunch':
      uni.reLaunch({ url });
      break;
    case 'switchTab':
      uni.switchTab({ url });
      break;
  }
};

/**
 * 返回上一页并传参
 */
export const navigateBack = (data?: any) => {
  const pages = getCurrentPages();
  const prevPage = pages[pages.length - 2];
  
  if (data && prevPage) {
    // @ts-ignore
    prevPage.$vm.onBackData?.(data);
  }
  
  uni.navigateBack();
};

// 使用示例
navigateTo({
  url: '/pages/detail/index',
  params: { id: 1, name: '测试' }
});

navigateTo({
  url: '/pages/index/index',
  type: 'switchTab'
});
```

---

## 5. 常用 API

### 5.1 界面交互

```typescript
// 显示 Toast
uni.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
});

uni.showToast({
  title: '加载失败',
  icon: 'none'
});

// 显示 Loading
uni.showLoading({
  title: '加载中...',
  mask: true
});

uni.hideLoading();

// 显示模态对话框
uni.showModal({
  title: '提示',
  content: '确定要删除吗？',
  success: (res) => {
    if (res.confirm) {
      console.log('用户点击确定');
    } else if (res.cancel) {
      console.log('用户点击取消');
    }
  }
});

// 显示操作菜单
uni.showActionSheet({
  itemList: ['拍照', '从相册选择'],
  success: (res) => {
    console.log('选择了第' + (res.tapIndex + 1) + '个按钮');
  }
});
```

---

### 5.2 数据存储

```typescript
// 存储数据
uni.setStorageSync('token', 'abc123');
uni.setStorageSync('userInfo', { name: 'Alice', age: 25 });

// 读取数据
const token = uni.getStorageSync('token');
const userInfo = uni.getStorageSync('userInfo');

// 删除数据
uni.removeStorageSync('token');

// 清空所有数据
uni.clearStorageSync();

// 异步方式
uni.setStorage({
  key: 'token',
  data: 'abc123',
  success: () => {
    console.log('存储成功');
  }
});

uni.getStorage({
  key: 'token',
  success: (res) => {
    console.log('token:', res.data);
  }
});
```

---

### 5.3 网络请求

```typescript
// 发起请求
uni.request({
  url: 'https://api.example.com/users',
  method: 'GET',
  data: {
    page: 1,
    pageSize: 20
  },
  header: {
    'Authorization': 'Bearer token'
  },
  success: (res) => {
    console.log('请求成功', res.data);
  },
  fail: (err) => {
    console.log('请求失败', err);
  }
});

// 上传文件
uni.uploadFile({
  url: 'https://api.example.com/upload',
  filePath: tempFilePath,
  name: 'file',
  formData: {
    user: 'test'
  },
  success: (res) => {
    console.log('上传成功', res.data);
  }
});

// 下载文件
uni.downloadFile({
  url: 'https://example.com/file.pdf',
  success: (res) => {
    if (res.statusCode === 200) {
      console.log('下载成功', res.tempFilePath);
    }
  }
});
```

---

### 5.4 媒体

```typescript
// 选择图片
uni.chooseImage({
  count: 9,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    const tempFilePaths = res.tempFilePaths;
    console.log('选择的图片', tempFilePaths);
  }
});

// 预览图片
uni.previewImage({
  current: 0,
  urls: ['image1.jpg', 'image2.jpg']
});

// 保存图片到相册
uni.saveImageToPhotosAlbum({
  filePath: 'image.jpg',
  success: () => {
    uni.showToast({ title: '保存成功' });
  }
});
```

---

### 5.5 位置

```typescript
// 获取当前位置
uni.getLocation({
  type: 'gcj02',
  success: (res) => {
    console.log('经度:', res.longitude);
    console.log('纬度:', res.latitude);
  }
});

// 打开地图选择位置
uni.chooseLocation({
  success: (res) => {
    console.log('位置名称:', res.name);
    console.log('详细地址:', res.address);
    console.log('纬度:', res.latitude);
    console.log('经度:', res.longitude);
  }
});

// 查看位置
uni.openLocation({
  latitude: 39.9,
  longitude: 116.4,
  name: '北京天安门',
  address: '北京市东城区'
});
```

---

## 6. 组件使用

### 6.1 基础组件

```vue
<template>
  <view class="container">
    <!-- 视图容器 -->
    <view class="box">文本容器</view>
    
    <!-- 滚动视图 -->
    <scroll-view scroll-y class="scroll-view">
      <view v-for="item in 50" :key="item">{{ item }}</view>
    </scroll-view>
    
    <!-- 文本 -->
    <text class="text">普通文本</text>
    <text selectable>可选择文本</text>
    
    <!-- 图片 -->
    <image src="/static/logo.png" mode="aspectFit" />
    
    <!-- 输入框 -->
    <input 
      v-model="keyword" 
      placeholder="请输入关键词"
      @input="handleInput"
    />
    
    <!-- 按钮 -->
    <button type="primary" @click="handleClick">确定</button>
    <button type="default">取消</button>
    
    <!-- 表单 -->
    <form @submit="handleSubmit">
      <input name="username" placeholder="用户名" />
      <input name="password" type="password" placeholder="密码" />
      <button form-type="submit">提交</button>
    </form>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const keyword = ref('');

const handleInput = (e: any) => {
  console.log('输入:', e.detail.value);
};

const handleClick = () => {
  console.log('点击按钮');
};

const handleSubmit = (e: any) => {
  console.log('表单数据:', e.detail.value);
};
</script>
```

---

### 6.2 条件编译

```vue
<template>
  <!-- 仅在微信小程序显示 -->
  <!-- #ifdef MP-WEIXIN -->
  <view>微信小程序专属内容</view>
  <!-- #endif -->
  
  <!-- 仅在 H5 显示 -->
  <!-- #ifdef H5 -->
  <view>H5 专属内容</view>
  <!-- #endif -->
  
  <!-- 除了 H5 都显示 -->
  <!-- #ifndef H5 -->
  <view>非 H5 内容</view>
  <!-- #endif -->
</template>

<script setup lang="ts">
// #ifdef MP-WEIXIN
console.log('这是微信小程序');
// #endif

// #ifdef H5
console.log('这是 H5');
// #endif
</script>

<style>
/* #ifdef MP-WEIXIN */
.weixin-style {
  color: #07C160;
}
/* #endif */

/* #ifdef H5 */
.h5-style {
  color: #409EFF;
}
/* #endif */
</style>
```

---

## 7. 性能优化

### 7.1 分包加载

```json
// pages.json
{
  "pages": [
    { "path": "pages/index/index" }
  ],
  "subPackages": [
    {
      "root": "subPages",
      "pages": [
        { "path": "user/list" }
      ]
    }
  ]
}
```

### 7.2 图片优化

```vue
<template>
  <!-- 使用懒加载 -->
  <image src="/static/image.jpg" lazy-load />
  
  <!-- 使用合适的模式 -->
  <image src="/static/image.jpg" mode="aspectFit" />
</template>
```

### 7.3 列表优化

```vue
<template>
  <!-- 使用虚拟列表 -->
  <recycle-list :list="longList" />
  
  <!-- 或使用分页加载 -->
  <scroll-view @scrolltolower="loadMore">
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
  </scroll-view>
</template>
```

---

## 8. 常见问题

### Q1: 如何在页面间传递数据？
**A**: 三种方式：
1. URL 参数（简单数据）
2. 全局状态管理（Pinia）
3. EventChannel（复杂数据）

```typescript
// 方式1: URL 参数
uni.navigateTo({
  url: '/pages/detail/index?id=1'
});

// 方式2: EventChannel
uni.navigateTo({
  url: '/pages/detail/index',
  events: {
    getData: (data) => {
      console.log('接收数据:', data);
    }
  },
  success: (res) => {
    res.eventChannel.emit('sendData', { name: 'test' });
  }
});
```

### Q2: 如何处理不同平台的差异？
**A**: 使用条件编译：

```typescript
// #ifdef MP-WEIXIN
// 微信小程序特有代码
// #endif

// #ifdef H5
// H5 特有代码
// #endif
```

### Q3: 如何调试小程序？
**A**:
1. 使用微信开发者工具
2. console.log 打印
3. 开启 sourcemap
4. 使用 uni.showToast 提示

---

## 9. 参考资料

- [UniApp 官方文档](https://uniapp.dcloud.net.cn/)
- [UniApp 插件市场](https://ext.dcloud.net.cn/)
- [uni-ui 组件库](https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

