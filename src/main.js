// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 默认主题
import 'default-passive-events' // 解决某个警告
// 兼容ie
import 'babel-polyfill'
import Cookies from 'js-cookie'

Vue.use(ElementUI)
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = Cookies.get('token')
    // 这里判断用户是否登录，验证本地存储是否有token
    if (!token) { // 判断当前的token是否存在
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
