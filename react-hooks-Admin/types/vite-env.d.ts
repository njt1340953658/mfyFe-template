/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 项目名称 */
  readonly VITE_APP_TITLE: string
  /** 基础路径 */
  readonly VITE_PUBLIC_PATH: string
  /** API基础地址 */
  readonly VITE_BASE_API: string
  /** 路由模式：hash | history */
  readonly VITE_ROUTER_MODE: 'hash' | 'history'
  /** 是否启用构建压缩：none | gzip | brotli */
  readonly VITE_BUILD_COMPRESS: 'none' | 'gzip' | 'brotli'
  /** 是否生成构建报告 */
  readonly VITE_REPORT: string
  /** 是否启用mock */
  readonly VITE_USE_MOCK: string
  /** 开发服务器端口 */
  readonly VITE_PORT: string
  /** 开发服务器地址 */
  readonly VITE_HOST: string
  /** 是否自动打开浏览器 */
  readonly VITE_OPEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
