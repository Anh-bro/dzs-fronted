// stores/counter.js
import { defineStore } from 'pinia'

export const useStore = defineStore('isCollapse', {
  state: () => {
    return {
      logintime:'',
      username: 'qwe',
      isCollapse: true,
      wid: 'w200',
      aid: 1,
      txt: '手册',
      loading: false,
      isAdmin: false,
    }
  },
  // 也可以定义为
  // state: () => ({ count: 0 })
  actions: {
    doCollapse() {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.txt = '手册'
        this.wid = ''
      } else {
        this.txt = '电子手册系统'
        this.wid = 'w200'
      }
    },
  },
})
