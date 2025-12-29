import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type ConfigEnv, Plugin } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      host: true,
      port: 3001,
      open: false,
      cors: true,
      strictPort: false,
      hmr: true,
      fs: {
        strict: false
      }
      /* 代理示例
      proxy: {
        '^/api': {
          target: 'http://api.example.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
      */
    },
    build: {
      emptyOutDir: true,
      target: 'esnext',
      minify: 'esbuild',
      esbuild: {
        drop: ['console', 'debugger'],
        legalComments: 'none'
      },
      reportCompressedSize: false,
      assetsDir: 'static',
      chunkSizeWarningLimit: 2000,
      assetsInlineLimit: 4096,
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [fileURLToPath(new URL('./src/assets/svg', import.meta.url))],
        symbolId: 'icon-[dir]-[name]',
        svgoOptions: true
      }),
      {
        name: 'inject-build-meta',
        transformIndexHtml(html) {
          const buildId = String(Date.now())
          return html.replace('<head>', `<head>\n    <meta name="app-build-id" content="${buildId}">`)
        }
      } as Plugin
    ],
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      exclude: ['vue-demi']
    }
  }
})
