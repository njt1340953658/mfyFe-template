import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint2'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig((mode: ConfigEnv): UserConfig => {
  const viteEnv = loadEnv(mode.mode, process.cwd())

  const { VITE_PUBLIC_PATH } = viteEnv

  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      host: viteEnv.VITE_HOST || "0.0.0.0",
      port: Number(viteEnv.VITE_PORT) || 3000,
      open: viteEnv.VITE_OPEN === 'true',
      cors: true,
      strictPort: false,
      hmr: true,
      fs: {
        strict: false
      },
      proxy: {
        '/api': {
          target: 'https://mock.mengxuegu.com/mock/62abda3212c1416424630a45', // easymock
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      minify: 'esbuild',
      emptyOutDir: true, // 以在构建前自动清空输出目录
      target: 'esnext',
      chunkSizeWarningLimit: 2000,
      assetsInlineLimit: 4096,
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            // 将React相关库打包在一起
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // 将Redux相关库打包在一起
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
            // 将UI库打包在一起
            'ui-vendor': ['antd', '@ant-design/icons'],
            // 将工具库打包在一起
            'utils-vendor': ['axios', 'nprogress', 'screenfull']
          }
        }
      }
    },
    plugins: [
      react(),
      eslintPlugin({
        lintOnStart: false,
        emitError: false,
        emitWarning: true,
        cache: false
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      }),
      // 生产环境启用压缩
      viteEnv.VITE_BUILD_COMPRESS === 'gzip' && viteCompression({
        algorithm: 'gzip',
        deleteOriginFile: false
      }),
      // 构建分析
      viteEnv.VITE_REPORT === 'true' && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true
      })
    ].filter(Boolean)
  }
})
