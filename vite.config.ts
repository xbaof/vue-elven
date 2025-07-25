import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
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
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('cropper-')
          }
        }
      }),
      viteCompression({
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: true // 源文件压缩后是否删除
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
      })
    ],
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      open: Boolean(env.VITE_OPEN),
      // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
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
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: Boolean(env.VITE_DROP_CONSOLE) || false,
          drop_debugger: true
        }
      },
      // 10kb以下，转Base64
      assetsInlineLimit: 1024 * 10,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // 每个node_modules模块分成一个js文件
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString()
            }
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'assets/js/[name]-[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'assets/js/[name]-[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'naive-ui', 'axios', '@vueuse/core'],
      exclude: ['@iconify/vue']
    }
  }
})
