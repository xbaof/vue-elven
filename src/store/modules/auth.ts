import { defineStore } from 'pinia'
import type { AuthState } from '../types'
import type { ReqLogin } from '@/api/system/types'
import { login } from '@/api/system/auth'
import { ELV_AUTH } from '@/enums/cacheEnum'
import { useUserStore, usePermissionStore, useTagsViewStore } from '@/store'
import { createFullEncryptSerializer } from '@/utils/pinia-persist.serializer'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: ''
  }),
  getters: {
    getToken(): string {
      return this.token
    }
  },
  actions: {
    /**
     * 登录并保存 token
     */
    login(params: ReqLogin) {
      return new Promise<string>((resolve, reject) => {
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
    /** 前端登出 */
    logOut() {
      useUserStore().resetUser()
      usePermissionStore().resetPermission()
      useTagsViewStore().resetTagsView()
      // 重置token
      this.resetAuth()
    },
    resetAuth() {
      this.$reset()
    }
  },
  persist: {
    key: ELV_AUTH,
    storage: localStorage,
    pick: ['token'],
    serializer: createFullEncryptSerializer()
  }
})
