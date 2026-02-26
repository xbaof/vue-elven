import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

/**
 * 不使用 Layout 的基础路由（如登录页）
 */
export const outsideLayoutRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
      isHidden: true
    }
  }
]

/**
 * 其他通用功能路由（404、重定向等）
 */
export const functionalRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { title: 'redirect', isTagsView: true },
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/layout/routerView/redirect.vue')
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/404'
  }
]

/**
 * 需要 Layout 的基础路由
 * 说明：只有在 Layout.children 下的路由才会渲染到菜单中
 */
export const basicLayoutRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/index',
    component: Layout,
    children: [
      {
        path: '/index',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '首页',
          icon: 'icon-park-outline:home-two',
          isTagsView: true,
          isAffix: true,
          sort: 0
        }
      }
    ]
  }
]

/**
 * 应用的静态基础路由（不受权限控制或在登录后默认可见）
 */
export const staticRoutes: RouteRecordRaw[] = [...outsideLayoutRoutes, ...basicLayoutRoutes, ...functionalRoutes]

export default staticRoutes
