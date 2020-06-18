<template>
  <div class="page">
    <el-form label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="form.roleName"></el-input>
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

import { role_modify } from '@/request/api'

export default {
  name: 'add',
  data () {
    return {
      form: {
        roleName: ''
      },
      btn: {
        submit: {
          loading: false
        }
      }
    }
  },
  props: {
    roleId: String,
    roleName: String
  },
  methods: {
    onSubmit () {
      const me = this
      const roleName = me.form.roleName
      if (roleName.length < 1) {
        this.$message({
          message: '请输入角色名称',
          type: 'warning'
        })
        return false
      }
      const params = {}
      params.roleId = me.roleId
      params.roleName = roleName
      me.btn.submit.loading = true
      role_modify(params).then(res => {
        me.btn.submit.loading = false
        const code = res.code
        if (code === 200) {
          me.$message({
            message: res.resMsg,
            type: 'success'
          })
          me.$emit('closeMoidifyRoleDialog')
        } else {
          me.$message.error(res.resMsg)
        }
      })
    },
    loadRoleInfo () {
      const me = this
      this.form.roleName = me.roleName
    }
  },
  mounted () {
    this.loadRoleInfo()
  }
}
</script>

<style scoped>
.page {
  padding: 15px;
}
</style>
