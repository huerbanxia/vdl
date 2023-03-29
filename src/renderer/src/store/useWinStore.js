import { defineStore } from 'pinia'

// 窗口信息仓库
const useWinStore = defineStore('winStore', {
  state() {
    return {
      winOptions: {}
    }
  },
  // 开启持久化存储
  persist: true,
  getters: {
    tableHeight() {
      let temp = this.winOptions.height - 150
      console.log(temp)
      return temp
    }
  },
  actions: {
    set(value) {
      this.winOptions = value
    }
  }
})

export default useWinStore
