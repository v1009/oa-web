import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    menuIdx: ''
  },
  mutations: {
    changeMenuIdx (state, menuIdx) {
      state.menuIdx = menuIdx
    }
  }
})
