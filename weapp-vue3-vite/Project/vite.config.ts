import { resolve } from "path";
import uni from "@dcloudio/vite-plugin-uni";
import type { ConfigEnv, UserConfigExport } from "vite";

const ENV_NAME = ["development", "test"]

export default (configEnv: ConfigEnv): UserConfigExport => {
  const modeDev = ENV_NAME.includes(configEnv.mode);
  return {
    plugins: [uni()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "/src"),
      },
    },
    server: {
      headers: {
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 抑制第三方库（@dcloudio/uni-ui）的弃用警告
          silenceDeprecations: [
            "legacy-js-api",      // 第三方库使用旧的 JS API
            "global-builtin",     // 第三方库使用全局函数（如 mix()）
            "color-functions"     // 第三方库使用旧的颜色函数（如 darken()）
          ],
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
      },
      minify: "terser",
      terserOptions: {
        compress: {
          unused: true,
          dead_code: true,
          drop_console: modeDev ? false : true,
          drop_debugger: modeDev ? false : true,
          pure_funcs: modeDev ? [] : ["console.log", "console.info", "console.warn"],
          passes: 2,
          properties: true,
          side_effects: false
        },
        format: {
          preserve_annotations: false,
        },
      },
      cssCodeSplit: true,
      sourcemap: modeDev,
      chunkSizeWarningLimit: 1000,
    },
  };
};
