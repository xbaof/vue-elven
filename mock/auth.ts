function createUserList() {
  return [
    {
      id: 1,
      avatar: null,
      userName: 'admin',
      password: '123456',
      nickName: '平台管理员',
      token: 'Admin Token'
    },
    {
      id: 2,
      avatar: null,
      userName: 'system',
      password: '123456',
      nickName: '系统管理员',
      token: 'System Token'
    }
  ]
}

export default [
  {
    url: '/login',
    method: 'post',
    timeout: 2000,
    response: ({ body }) => {
      const { userName, password } = body
      const hasUser = createUserList().find((item) => item.userName === userName && item.password === password)

      if (!hasUser) {
        return { code: 500, msg: '账号或密码错误', success: false }
      }

      const { token } = hasUser
      return { code: 200, msg: '操作成功', success: true, data: { token } }
    }
  },
  {
    url: '/getUser',
    method: 'get',
    response: (request) => {
      const token = request.headers.authorization
      const hasUser = createUserList().find((item) => 'Bearer ' + item.token === token)
      if (!hasUser) {
        return { code: 500, msg: '获取用户信息失败', success: false, data: token }
      }
      return {
        code: 200,
        msg: '获取用户信息成功',
        success: true,
        data: hasUser
      }
    }
  },
  {
    url: '/getPermission',
    method: 'get',
    response: (request) => {
      const token = request.headers.authorization
      if (!token) {
        return { code: 401, msg: '凭证失效', success: false, data: token }
      }
      return {
        success: true,
        msg: '操作成功',
        code: 200,
        data: {
          perms: ['sys:user:add', 'sys:user:update'],
          menus: [
            {
              menuName: '测试页面',
              orderSort: 1,
              path: 'test',
              component: 'test',
              isIframe: false,
              isLink: false,
              isCache: false,
              isHidden: false,
              linkUrl: '',
              menuType: '1',
              icon: 'icon-park-outline:setting-two',
              isTagsView: true,
              isAffix: true
            },
            {
              menuName: '外链测试',
              orderSort: 2,
              path: 'baidu',
              component: null,
              isIframe: false,
              isLink: true,
              isCache: false,
              isHidden: false,
              linkUrl: 'https://www.baidu.com',
              menuType: '1',
              icon: 'icon-park-outline:setting-two',
              isTagsView: false,
              isAffix: false
            },
            {
              menuName: 'vite',
              orderSort: 3,
              path: 'vitejs',
              component: null,
              isIframe: true,
              isLink: false,
              isCache: false,
              isHidden: false,
              menuType: '1',
              linkUrl: 'https://vitejs.cn',
              icon: 'local:vite',
              isTagsView: true,
              isAffix: false
            },
            {
              menuName: '菜单嵌套',
              orderSort: 5,
              path: 'menu',
              icon: 'icon-park-outline:all-application',
              children: [
                {
                  menuName: '菜单1',
                  orderSort: 1,
                  path: 'menu1',
                  component: '',
                  isIframe: false,
                  isLink: false,
                  isCache: true,
                  isHidden: false,
                  menuType: '1',
                  isTagsView: true,
                  isAffix: false,
                  children: [
                    {
                      menuName: '菜单1-1',
                      orderSort: 9,
                      path: 'menu11',
                      component: 'menu/menu1/menu1-1/index',
                      isIframe: false,
                      isLink: false,
                      isCache: true,
                      isHidden: false,
                      menuType: '1',
                      isTagsView: true,
                      isAffix: false
                    },
                    {
                      menuName: '菜单1-2',
                      orderSort: 9,
                      path: 'menu12',
                      component: '',
                      isIframe: false,
                      isLink: false,
                      isCache: true,
                      isHidden: false,
                      menuType: '1',
                      isTagsView: true,
                      isAffix: false,
                      children: [
                        {
                          menuName: '菜单1-2-1',
                          orderSort: 9,
                          path: 'menu121',
                          component: 'menu/menu1/menu1-2/index',
                          isIframe: false,
                          isLink: false,
                          isCache: true,
                          isHidden: false,
                          menuType: '1',
                          isTagsView: true,
                          isAffix: false
                        }
                      ]
                    }
                  ]
                },
                {
                  menuName: '菜单2',
                  orderSort: 9,
                  path: 'menu2',
                  component: 'menu/menu2/index',
                  isIframe: false,
                  isLink: false,
                  isCache: true,
                  isHidden: false,
                  menuType: '1',
                  isTagsView: true,
                  isAffix: false
                }
              ]
            },
            {
              menuName: '组件',
              orderSort: 4,
              path: 'components',
              icon: 'icon-park-outline:components',
              children: [
                {
                  menuName: '图标',
                  orderSort: 1,
                  path: 'icon',
                  component: 'components/icon/index',
                  isIframe: false,
                  isLink: false,
                  isCache: true,
                  isHidden: false,
                  menuType: '1',
                  isTagsView: true,
                  isAffix: false
                }
              ]
            },
            {
              menuName: '功能',
              orderSort: 6,
              path: 'fun',
              icon: 'icon-park-outline:bytedance-mini-app',
              children: [
                {
                  menuName: '自定义指令',
                  orderSort: 1,
                  path: 'directive',
                  component: 'fun/directives/index',
                  isIframe: false,
                  isLink: false,
                  isCache: true,
                  isHidden: false,
                  menuType: '1',
                  isTagsView: true,
                  isAffix: false
                }
              ]
            }
          ]
        }
      }
    }
  }
]
