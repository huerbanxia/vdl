import { defineStore } from 'pinia'

// 认证信息仓库
const useAuthStore = defineStore('authStore', {
  state() {
    return {
      tokens: {}
    }
  },
  // 开启持久化存储
  persist: true,
  getters: {
    token() {
      return null
    }
  },
  actions: {
    set(value) {
      this.tokens = value
    }
  }
})

export default useAuthStore
