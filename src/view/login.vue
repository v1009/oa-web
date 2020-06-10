<template>
  <div class="loginForm">
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="loading">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import Cookies from 'js-cookie'
import {login} from '@/request/api'

export default {
  name: 'login',
  data () {
    return {
      username: '13157184276',
      password: 'cvc#dc09',
      loading: false
    }
  },
  methods: {
    onSubmit () {
      // 1852515
      const me = this
      if (me.username.length < 1) {
        this.$message.warning('请输入用户名')
        return false
      }
      if (me.password.length < 1) {
        this.$message.warning('请输入密码')
        return false
      }
      me.loading = true

      const params = {}
      params.username = me.username
      params.password = me.password
      login(params).then(res => {
        me.loading = false
        const code = res.code
        if (code === 200) {
          const accessToken = res.accessToken
          Cookies.set('token', accessToken)
          window.sessionStorage.setItem('token', accessToken)
          const redirect = decodeURIComponent(this.$route.query.redirect || '/')
          this.$router.push({path: redirect})
        } else {
          this.$message.error(res.resMsg)
        }
      })
    }
  }
}
</script>

<style scoped>

  .loginForm {
    width: 300px;
    margin: 0 auto;
    margin-top: 120px;
    padding: 30px 20px;
    background-color: #f0f0f0;
  }

</style>
