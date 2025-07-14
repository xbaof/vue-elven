import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
const Layout = () => import('@/layout/index.vue')

/**
 * @description 非layout布局的路由
 */
const outsideLayout: RouteRecordRaw[] = [
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
 * @description 其他功能性路由
 */
const otherRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { title: 'redirect', noTagsView: true },
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

export const routes: RouteRecordRaw[] = [
  ...outsideLayout,
  {
    path: '/',
    name: 'Layout',
    redirect: '/index',
    component: Layout,
    children: [
      /**只有在这children下添加的路由才会被渲染至菜单中 */
      {
        path: '/index',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'icon-park-outline:home-two', isAffix: true, sort: 0 }
      }
    ]
  },
  ...otherRoutes
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  strict: false,
  // 切换页面，滚动到最顶部
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
