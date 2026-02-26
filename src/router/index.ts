import { createRouter, createWebHashHistory } from 'vue-router'
import { staticRoutes } from './staticRoutes'

/**
 * 仅负责创建路由实例与基础配置
 * 静态路由在 staticRoutes 中维护，动态路由由权限模块在运行时挂载
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: staticRoutes,
  strict: false,
  // 切换页面，滚动到最顶部
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
