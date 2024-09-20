import { useAuthStore } from '@/store'
import router from '@/router'

// 白名单路由
const whiteList = ['/login', '/redirect']

router.beforeEach((to, from, next) => {
  window.$loadingBar.start()
  const auth = useAuthStore()
  const token = auth.getToken
  // 已登录
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (auth.menus.length === 0) {
        auth
          .afterLogin()
          .then(() => {
            if (!router.hasRoute(to.name)) {
              if (to.path === '/404' && to.redirectedFrom !== undefined) {
                next({ path: to.redirectedFrom?.fullPath, replace: true })
              } else {
                next({ ...to, replace: true })
              }
            } else {
              next()
            }
          })
          .catch((error) => {
            auth.resetToken()
            return next('/login')
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`)
    }
  }
})

router.afterEach(() => {
  window.$loadingBar.finish()
})
