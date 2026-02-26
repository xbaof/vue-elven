import { defineStore } from 'pinia'
import type { UserState } from '../types'
import { ELV_USER } from '@/enums/cacheEnum'
import { getUser } from '@/api/system/user'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    nickName: '',
    avatar: ''
  }),
  getters: {
    getName(state): string {
      return state.name
    },
    getNickName(state): string {
      return state.nickName
    },
    getAvatar(state): string {
      return state.avatar
    }
  },
  actions: {
    /**
     * 获取并保存基础用户信息（昵称、头像等）
     */
    async fetchUserInfo() {
      try {
        const user = await getUser()
        const { userName, nickName, avatar } = user.data
        this.name = userName
        this.nickName = nickName
        this.avatar = avatar
        return user.data
      } catch (error) {
        return Promise.reject(error)
      }
    },
    resetUser() {
      this.$reset()
    }
  },
  persist: {
    key: ELV_USER,
    storage: sessionStorage
  }
})
