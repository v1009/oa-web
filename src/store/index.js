import Vue from 'vue'
import Vuex from 'vuex'
import tab from './modules/tab.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tab
  },
  mutations: {
    changeMenuIdx (state, menu) {
      state.menuIdx = menu.id
    }
  }
})
