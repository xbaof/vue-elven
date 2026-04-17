import type { Recordable, MockMethod } from 'vite-plugin-mock'

const createUserList = () => {
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
    response: (request: { body: Recordable }) => {
      const { userName, password } = request.body
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
    response: (request: { headers: Recordable }) => {
      const token = request.headers.authorization
      const hasUser = createUserList().find((item) => 'Bearer ' + item.token === token)
      if (!hasUser) {
        return {
          code: 500,
          msg: '获取用户信息失败',
          success: false,
          data: token
        }
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
    response: (request: { headers: Recordable }) => {
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
              name: 'Test',
              path: '/test',
              component: 'test/index',
              isKeepAlive: false,
              isHidden: false,
              linkUrl: '',
              menuType: '0',
              icon: 'icon-park-outline:setting-two',
              isTagsView: true,
              isAffix: true
            },
            {
              menuName: '外链测试',
              orderSort: 2,
              name: 'Baidu',
              path: '/baidu',
              component: null,
              isKeepAlive: false,
              isHidden: false,
              linkUrl: 'https://www.baidu.com',
              menuType: '2',
              icon: 'icon-park-outline:setting-two',
              isTagsView: false,
              isAffix: false
            },
            {
              menuName: 'vite',
              orderSort: 4,
              name: 'Vitejs',
              path: '/vitejs',
              component: null,
              isKeepAlive: false,
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
              menuType: '0',
              name: 'menu',
              path: '/menu',
              icon: 'icon-park-outline:all-application',
              children: [
                {
                  menuName: '菜单1',
                  orderSort: 1,
                  name: 'menu1',
                  path: '/menu/menu1',
                  component: '',
                  isKeepAlive: true,
                  isHidden: false,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false,
                  children: [
                    {
                      menuName: '菜单1-1',
                      orderSort: 9,
                      name: 'menu11',
                      path: '/menu/menu1/menu11',
                      component: 'menu/index',
                      isKeepAlive: true,
                      isHidden: false,
                      menuType: '0',
                      isTagsView: true,
                      isAffix: false,
                      query: {
                        id: '1',
                        type: '1'
                      }
                    },
                    {
                      menuName: '菜单1-2',
                      orderSort: 9,
                      name: 'menu12',
                      path: '/menu/menu1/menu12',
                      component: '',
                      isKeepAlive: true,
                      isHidden: false,
                      menuType: '0',
                      isTagsView: true,
                      isAffix: false,
                      children: [
                        {
                          menuName: '菜单1-2-1',
                          orderSort: 9,
                          name: 'menu121',
                          path: '/menu/menu1/menu12/menu121',
                          component: 'menu/index',
                          isKeepAlive: true,
                          isHidden: false,
                          menuType: '0',
                          isTagsView: true,
                          isAffix: false,
                          query: {
                            id: '2',
                            type: '2'
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  menuName: '菜单2',
                  orderSort: 9,
                  name: 'menu2',
                  path: '/menu/menu2',
                  component: 'menu/index',
                  isKeepAlive: true,
                  isHidden: false,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false
                }
              ]
            },
            {
              menuName: '组件',
              orderSort: 6,
              path: 'components',
              icon: 'icon-park-outline:components',
              children: [
                {
                  menuName: '图标',
                  orderSort: 1,
                  name: 'icon',
                  path: '/icon',
                  component: 'components/icon/index',
                  isKeepAlive: true,
                  isHidden: false,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false
                },
                {
                  menuName: '标签页操作',
                  orderSort: 2,
                  name: 'tags',
                  path: '/tags',
                  component: 'components/tags/index',
                  isKeepAlive: true,
                  isHidden: false,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false
                },
                {
                  menuName: 'params传参',
                  orderSort: 3,
                  name: 'TagsParams',
                  path: '/tags/tagsParams/:id/:tagViewTitle',
                  component: 'components/tags/paramsTag',
                  isKeepAlive: false,
                  isHidden: true,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false,
                  activePath: '/tags'
                },
                {
                  menuName: 'query传参',
                  orderSort: 4,
                  name: 'TagsQuery',
                  path: '/tags/tagsQuery',
                  component: 'components/tags/queryTag',
                  isKeepAlive: false,
                  isHidden: true,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false,
                  activePath: '/tags'
                },
                {
                  menuName: '图片裁剪',
                  orderSort: 5,
                  name: 'cropperDemo',
                  path: '/cropperDemo',
                  component: 'components/cropper/index',
                  isKeepAlive: true,
                  isHidden: false,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false
                }
              ]
            },
            {
              menuName: '功能',
              orderSort: 7,
              path: 'fun',
              name: '/fun',
              icon: 'icon-park-outline:bytedance-mini-app',
              children: [
                {
                  menuName: '自定义指令',
                  orderSort: 1,
                  name: 'directive',
                  path: '/fun/directive',
                  component: 'fun/directives/index',
                  isKeepAlive: true,
                  isHidden: false,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false
                },
                {
                  menuName: '富文本编辑器',
                  orderSort: 2,
                  name: 'editorDemo',
                  path: '/fun/editor',
                  component: 'fun/editor/index',
                  isKeepAlive: true,
                  isHidden: false,
                  menuType: '0',
                  isTagsView: true,
                  isAffix: false
                },
                {
                  menuName: '菜单标记',
                  orderSort: 3,
                  name: 'MenuBadgeDemo',
                  path: '/fun/menuBadge',
                  component: 'fun/menuBadge/index',
                  extraText: '7',
                  extraType: 'warning',
                  isKeepAlive: false,
                  isHidden: false,
                  linkUrl: '',
                  menuType: '0',
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
] as MockMethod[]
