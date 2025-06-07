import { defineStore } from 'pinia'
import { AuthState } from '../interface'
import type { MenuOption } from 'naive-ui'
import generatorDynamicRouter from '@/router/dynamicRouter'
import { ELV_AUTH } from '@/enums/cacheEnum'
import { LoginParam, login, getPermission } from '@/api/system/auth'
import { getUser } from '@/api/system/user'

export const useAuthStore = defineStore({
  id: 'auth',
  state: (): AuthState => ({
    token: '',
    name: '',
    nickName: '',
    avatar: '',
    perms: [],
    menus: []
  }),
  getters: {
    getToken(): string {
      return this.token
    },
    getName(): string {
      return this.name
    },
    getAvatar(): string {
      return this.avatar
    },
    getMenus(): MenuOption[] {
      return this.menus
    }
  },
  actions: {
    // 情况token及用户信息
    resetToken() {
      this.token = ''
    },
    /**
     *  @description：登录
     */
    login(params: LoginParam) {
      return new Promise((resolve, reject) => {
        login(params)
          .then((res) => {
            const { data } = res
            this.token = data.token
            resolve(data.token)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    /**
     * @description：获取用户信息（昵称、头像、权限集合、菜单）
     */
    async afterLogin() {
      try {
        const [user, permission] = await Promise.all([getUser(), getPermission()])
        const { userName, nickName, avatar } = user.data
        const { perms, menus } = permission.data
        this.name = userName
        this.nickName = nickName
        this.avatar = avatar
        this.perms = perms
        this.menus = generatorDynamicRouter(menus)
        return Promise.resolve(this.menus)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  },
  persist: {
    key: ELV_AUTH,
    storage: localStorage,
    paths: ['token']
  }
})
