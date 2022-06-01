import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的列表
    list: [],
    // 文本框的内容
    inputValue: 'aaa',
    nextId: 5,
    viewKey: 'all'
  },
  getters: {
    unDoneLength (state) {
      // 返回还有几条未完成
      return state.list.filter(x => x.done === false).length
    },
    infoList (state) {
      switch (state.viewKey) {
        case 'all':
          return state.list
        case 'undone':
          return state.list.filter(x => x.done === false)
        case 'done':
          return state.list.filter(x => x.done === true)
        default:
          return state.list
      }
    }
  },
  mutations: {
    initList (state, list) {
      state.list = list
    },
    setInputValue (state, val) {
      state.inputValue = val
    },
    addItem (state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据id删除对应事项
    removeItem (state, id) {
      // 这里因为删除事件发生后我们的index是变化的，所以不能直接拿id来当作index来删除
      const i = state.list.findIndex(x => x.id === id)
      // 这里的i就是每一个item在页面上新对应的index
      if (i !== -1) {
        state.list.splice(i, 1)
      }
    },
    changeStatus (state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    cleanDone (state) {
      // 留下未完成
      state.list = state.list.filter(x => x.done === false)
    },
    changeViewKey (state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList (context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initList', data)
      })
    }
  },
  modules: {
  }
})
