interface UserRecord {
  id: number
  avatar: string | null
  userName: string
  password: string
  nickName: string
  token: string
}

interface MockRequest {
  method?: string
  query?: {
    path?: string | string[]
  }
  body?: unknown
  headers?: Record<string, unknown>
}

interface MockResponse {
  status: (statusCode: number) => MockResponse
  json: (payload: unknown) => void
}

const createUserList = (): UserRecord[] => {
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

const permissionPayload = {
  perms: ['sys:user:add', 'sys:user:update'],
  menus: [
    {
      menuName: '测试页面',
      orderSort: 1,
      name: 'Test',
      path: '/test',
      component: 'test',
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
      orderSort: 3,
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
      menuName: '组件',
      orderSort: 5,
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
    }
  ]
}

const normalizePath = (path: string | string[] | undefined): string => {
  if (Array.isArray(path)) {
    return `/${path.join('/')}`
  }
  if (typeof path === 'string') {
    return `/${path}`
  }
  return '/'
}

const normalizeBody = (body: unknown): Record<string, unknown> => {
  if (body && typeof body === 'object') {
    return body as Record<string, unknown>
  }
  if (typeof body === 'string') {
    try {
      const parsedBody = JSON.parse(body)
      if (parsedBody && typeof parsedBody === 'object') {
        return parsedBody as Record<string, unknown>
      }
    } catch {
      return {}
    }
  }
  return {}
}

const getAuthorization = (headers: Record<string, unknown> | undefined): string => {
  if (!headers) {
    return ''
  }
  const authorization = headers.authorization
  return typeof authorization === 'string' ? authorization : ''
}

const sendJson = (res: MockResponse, statusCode: number, payload: unknown): void => {
  res.status(statusCode).json(payload)
}

export default function handler(req: MockRequest, res: MockResponse): void {
  const method = (req.method || 'GET').toUpperCase()
  const routePath = normalizePath(req.query?.path)

  if (routePath === '/login') {
    if (method !== 'POST') {
      sendJson(res, 405, { code: 405, msg: '请求方法不允许', success: false })
      return
    }

    const body = normalizeBody(req.body)
    const userName = typeof body.userName === 'string' ? body.userName : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const userRecord = createUserList().find((item) => item.userName === userName && item.password === password)

    if (!userRecord) {
      sendJson(res, 200, { code: 500, msg: '账号或密码错误', success: false })
      return
    }

    sendJson(res, 200, {
      code: 200,
      msg: '操作成功',
      success: true,
      data: { token: userRecord.token }
    })
    return
  }

  if (routePath === '/getUser') {
    if (method !== 'GET') {
      sendJson(res, 405, { code: 405, msg: '请求方法不允许', success: false })
      return
    }

    const authorization = getAuthorization(req.headers)
    const userRecord = createUserList().find((item) => `Bearer ${item.token}` === authorization)
    if (!userRecord) {
      sendJson(res, 200, { code: 500, msg: '获取用户信息失败', success: false, data: authorization })
      return
    }

    sendJson(res, 200, {
      code: 200,
      msg: '获取用户信息成功',
      success: true,
      data: userRecord
    })
    return
  }

  if (routePath === '/getPermission') {
    if (method !== 'GET') {
      sendJson(res, 405, { code: 405, msg: '请求方法不允许', success: false })
      return
    }

    const authorization = getAuthorization(req.headers)
    if (!authorization) {
      sendJson(res, 200, { code: 401, msg: '凭证失效', success: false, data: authorization })
      return
    }

    sendJson(res, 200, {
      code: 200,
      msg: '操作成功',
      success: true,
      data: permissionPayload
    })
    return
  }

  if (routePath === '/file/upload/img' || routePath === '/file/upload/video') {
    if (method !== 'POST') {
      sendJson(res, 405, { code: 405, msg: '请求方法不允许', success: false })
      return
    }

    const authorization = getAuthorization(req.headers)
    if (!authorization) {
      sendJson(res, 200, { code: 401, msg: '认证失败,请重新登陆！', success: false })
      return
    }

    sendJson(res, 200, {
      code: 200,
      msg: '上传成功!',
      success: true,
      data: { fileUrl: '' }
    })
    return
  }

  sendJson(res, 404, { code: 404, msg: `未匹配的接口: ${routePath}`, success: false })
}
