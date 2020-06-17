import Vue from 'vue'
import Router from 'vue-router'
import UserList from '@/view/security/user/list.vue'
import RoleList from '@/view/security/role/list.vue'
import MenuList from '@/view/security/menu/list.vue'
import DailyList from '@/view/daily/list.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      redirect: '/dashboard',
      meta: {
        title: '首页',
        requiresAuth: true // 是否需要判断是否登录
      },
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['../view/Dashboard.vue'], resolve),
          meta: {title: '系统首页'}
        },
        {
          path: '/security/user/list',
          component: UserList
        },
        {
          path: '/security/user/add',
          component: resolve => require(['../view/security/user/add.vue'], resolve)
        },
        {
          path: '/security/user/modify',
          component: resolve => require(['../view/security/user/modify.vue'], resolve)
        },
        {
          path: '/security/role/list',
          component: RoleList
        },
        {
          path: '/security/role/add',
          component: resolve => require(['../view/security/role/add.vue'], resolve)
        },
        {
          path: '/security/role/modify',
          component: resolve => require(['../view/security/role/modify.vue'], resolve)
        },
        {
          path: '/security/menu/list',
          component: MenuList
        },
        {
          path: '/security/menu/add',
          component: resolve => require(['../view/security/menu/add.vue'], resolve)
        },
        {
          path: '/daily/list',
          component: DailyList
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../view/login.vue'], resolve)
    }
  ]
})
