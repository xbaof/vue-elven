import { defineStore } from 'pinia'
import type { UserState } from '../types'
import { ELV_USER } from '@/enums/cacheEnum'
import { getUser } from '@/api/system/user'
import type { User } from '@/api/system/types'

let fetchingUserPromise: Promise<User> | null = null

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    nickName: '',
    avatar: ''
  }),
  getters: {
    getName: (state) => state.name,
    getNickName: (state) => state.nickName,
    getAvatar: (state) => state.avatar
  },
  actions: {
    /**
     * 获取并缓存基础用户信息（用户名、昵称、头像）。
     */
    async fetchUserInfo(): Promise<User> {
      if (fetchingUserPromise) return fetchingUserPromise

      fetchingUserPromise = (async () => {
        const { data } = await getUser()
        this.name = data.userName
        this.nickName = data.nickName
        this.avatar = data.avatar
        return data
      })()

      try {
        return await fetchingUserPromise
      } finally {
        fetchingUserPromise = null
      }
    },
    resetUser(): void {
      fetchingUserPromise = null
      this.$reset()
    }
  },
  persist: {
    key: ELV_USER,
    storage: sessionStorage
  }
})
