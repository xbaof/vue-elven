import { ConfigEnv, UserConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import eslintPlugin from 'vite-plugin-eslint'
import viteCompression from 'vite-plugin-compression'
import viteSvgLoader from 'vite-svg-loader'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  return {
    base: env.VITE_PUBLIC_PATH,
    root,
    plugins: [
      vue(),
      eslintPlugin(),
      viteCompression({
        verbose: true, // 是否在控制台中输出压缩结果
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
        deleteOriginFile: true // 源文件压缩后是否删除
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: env.VITE_GLOB_TITLE
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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/')
      }
    },
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'internal:charset-removal',
            AtRule: {
              charset: (atRule) => {
                // 去除elementPlus内部charset警告
                if (atRule.name === 'charset') {
                  atRule.remove()
                }
              }
            }
          }
        ]
      }
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT),
      open: Boolean(env.VITE_OPEN),
      // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
      strictPort: false,
      // 自定义代理规则
      proxy: {}
    },
    build: {
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境时移除console
          drop_console: Boolean(env.VITE_DROP_CONSOLE),
          drop_debugger: true
        }
      },
      // 10kb以下，转Base64
      assetsInlineLimit: 1024 * 10,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          // 每个node_modules模块分成一个js文件
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              return env.VITE_CHECK ? id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString() : 'vendor'
            }
            return undefined
          },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: 'assets/js/[name].[hash].js', // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: 'assets/js/[name].[hash].js', // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
        }
      }
    }
  }
}
