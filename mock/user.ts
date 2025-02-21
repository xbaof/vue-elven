export function createUserList() {
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
  }
]
