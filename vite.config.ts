import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import viteSvgLoader from 'vite-svg-loader'
import { viteMockServe } from 'vite-plugin-mock'
import { ELV_APP } from './src/enums/cacheEnum'
import defaultState from './src/store/modules/app/defaultState'
import { darkTheme, lightTheme } from 'naive-ui'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: env.VITE_PUBLIC_PATH || '/',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    define: {},
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('cropper-')
          }
        }
      }),

      viteCompression({
        // 在控制台输出压缩结果
        verbose: true,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        // 压缩后删除原始文件
        deleteOriginFile: true
      }),
      createHtmlPlugin({
        minify: mode === 'production',
        inject: {
          data: {
            AppStorageKey: ELV_APP,
            DarkBgColor: darkTheme.common.bodyColor,
            LightBgColor: lightTheme.common.bodyColor,
            DefaultPrimary: defaultState().overrideColor.primary
          }
        }
      }),
      viteSvgLoader({
        svgoConfig: {
          plugins: ['preset-default', { name: 'prefixIds' }]
        }
      }),
      viteMockServe({
        enable: command === 'serve',
        logger: false
      }),
      JSON.parse(env.VITE_OPEN_VISUALIZER)
        ? visualizer({
            gzipSize: true,
            brotliSize: true
          })
        : null
    ],
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      open: JSON.parse(env.VITE_OPEN),
      // 端口占用时自动尝试下一个可用端口
      strictPort: false,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: JSON.parse(env.VITE_DROP_CONSOLE),
          drop_debugger: true
        }
      },
      // 10KB 以下资源内联为 Base64
      assetsInlineLimit: 1024 * 10,
      // 调整 chunk 体积告警阈值
      chunkSizeWarningLimit: 2000,
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // 按依赖分组，避免生成过多零碎 chunk
          manualChunks(id: string) {
            if (!id.includes('node_modules')) {
              return
            }

            if (id.includes('@iconify')) {
              return 'iconify'
            }

            if (id.includes('vue-router') || id.includes('pinia') || id.includes('@vueuse')) {
              return 'framework'
            }

            return 'vendor'
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },

    // 依赖预构建
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'naive-ui', 'axios', '@vueuse/core'],
      exclude: ['@iconify/vue']
    }
  }
})
