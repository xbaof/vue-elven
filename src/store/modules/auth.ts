import { defineStore } from 'pinia'
import type { AuthState } from '../types'
import type { ReqLogin } from '@/api/system/types'
import { login as loginApi } from '@/api/system/auth'
import { ELV_AUTH } from '@/enums/cacheEnum'
import { usePermissionStore } from './permission'
import { useTagsViewStore } from './tagsView'
import { useUserStore } from './user'
import { useMenuBadgeStore } from './menuBadge'
import { createFullEncryptSerializer } from '@/utils/pinia-persist.serializer'
import router from '@/router'
import { clearAllPendingRequests } from '@/api/http/cancel'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: ''
  }),
  getters: {
    getToken: (state) => state.token
  },
  actions: {
    /**
     * 登录并保存 token。
     */
    async login(params: ReqLogin): Promise<string> {
      const { data } = await loginApi(params)
      this.token = data.token
      return data.token
    },
    /**
     * 前端登出并重置相关状态。
     */
    logOut() {
      clearAllPendingRequests()
      useUserStore().resetUser()
      usePermissionStore().resetPermission(router)
      useTagsViewStore().resetTagsView()
      useMenuBadgeStore().resetAllBadges()
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
