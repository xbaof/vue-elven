import { defineStore } from 'pinia'
import type { AuthState } from '../types'
import type { ReqLogin } from '@/api/system/types'
import { login as loginApi } from '@/api/system/auth'
import { ELV_AUTH } from '@/enums/cacheEnum'
import { usePermissionStore } from './permission'
import { useTagsViewStore } from './tagsView'
import { useUserStore } from './user'
import { createFullEncryptSerializer } from '@/utils/pinia-persist.serializer'
import router from '@/router'
import { clearAllPendingRequests } from '@/api/http/cancel'

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
     * 登录并保存 token。
     */
    async login(params: ReqLogin): Promise<string> {
      const response = await loginApi(params)
      const { data } = response
      this.token = data.token
      return data.token
    },
    /**
     * 前端登出并重置相关状态。
     */
    logOut() {
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()
      const tagsViewStore = useTagsViewStore()

      clearAllPendingRequests()
      userStore.resetUser()
      permissionStore.resetPermission(router)
      tagsViewStore.resetTagsView()
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
