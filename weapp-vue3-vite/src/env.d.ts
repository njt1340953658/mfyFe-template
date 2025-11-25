/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 环境变量类型定义
interface ImportMetaEnv {
  readonly VITE_BASE_API: string
  readonly MODE: string
  // 可以在这里添加更多环境变量类型
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
