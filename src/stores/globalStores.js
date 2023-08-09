// stores/counter.js
import { defineStore } from 'pinia'

export const useStore = defineStore('isCollapse', {
  state: () => {
    return {
      isCollapse: false,
      wid: 'w200',
      aid:1
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {
    doCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.wid = ''
      } else {
        this.wid = 'w200'
      }
    },
  },
})
