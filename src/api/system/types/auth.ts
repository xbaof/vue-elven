import type { Menu } from './menu'

// 验证码
interface Captcha {
  captchaCode: string
  captchaId: string
}

// 认证相关类型
export interface ReqLogin extends Captcha {
  userName: string
  password: string
}

export interface ResLogin {
  token: string
}
export interface ResUserPermission {
  menus: Menu[]
  perms: string[]
  roles?: string[]
}
