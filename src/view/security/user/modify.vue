<template>
  <div class="page">
    <el-form label-width="80px">
      <el-form-item label="手机号码">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item label="用户名称">
        <el-input v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户邮箱">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
          :loading="btn.submit.loading"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { user_modify, user_findModelByUserId } from '@/request/api'

export default {
  name: 'modify',
  data () {
    return {
      form: {
        userName: '',
        mobile: '',
        email: '',
        address: ''
      },
      btn: {
        submit: {
          loading: false
        }
      }
    }
  },
  props: {
    userId: String
  },
  methods: {
    onSubmit () {
      const me = this
      const params = {}
      const mobile = me.form.mobile
      if (mobile.length < 1) {
        this.$message({
          message: '请输入手机号码',
          type: 'warning'
        })
        return false
      }
      const userName = me.form.userName
      if (userName.length < 1) {
        this.$message({
          message: '请输入用户名称',
          type: 'warning'
        })
        return false
      }
      const email = me.form.email
      if (email.length < 1) {
        this.$message({
          message: '请输入邮箱地址',
          type: 'warning'
        })
        return false
      }
      params.userId = me.userId
      params.userName = userName
      params.mobile = mobile
      params.email = email
      params.address = me.form.address
      me.btn.submit.loading = true
      user_modify(params).then(res => {
        me.btn.submit.loading = false
        const code = res.code
        if (code === 200) {
          me.$message({
            message: res.resMsg,
            type: 'success'
          })
          me.$emit('closeMoidifyUserDialog')
        } else {
          me.$message.error(res.resMsg)
        }
      })
    },
    loadUserInfo () {
      const me = this
      const params = {}
      params.userId = me.userId
      user_findModelByUserId(params).then(res => {
        console.log(res)
        const code = res.code
        if (code === 200) {
          var data = res.data
          me.form.userName = data.userName
          me.form.mobile = data.userPhone
          me.form.email = data.userEmail
          me.form.address = data.address
        } else {
          me.$message.error(res.resMsg)
        }
      })
    }
  },
  mounted () {
    this.loadUserInfo()
  }
}
</script>

<style scoped>
.page {
  padding: 15px;
}
</style>
