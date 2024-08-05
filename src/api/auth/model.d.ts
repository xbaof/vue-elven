// * 登录模块
declare namespace Login {
  interface LoginParam {
    userName: string
    password: string
    verifyCode: string
    captchaId: string
  }
  interface LoginResult {
    token: string
  }
  interface UserInfo {
    nickName: string
    userName: string
    avatar: string
  }
  interface UserPermission {
    menus: System.Menu[]
    perms: string[]
  }
}
