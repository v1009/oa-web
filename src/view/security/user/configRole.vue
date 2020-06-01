<template>
  <div>
    <el-checkbox
      :indeterminate="isIndeterminate"
      v-model="checkAll"
      @change="handleCheckAllChange"
    >全选</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group
      v-model="checkRoleList"
      @change="handleChange"
    >
      <el-checkbox
        v-for="role in roleList"
        :label="role.roleId"
        :key="role.roleId"
      >{{role.roleName}}</el-checkbox>
    </el-checkbox-group>
    <el-button
      type="primary"
      @click="onSubmit"
      :loading="btn.submit.loading"
    >保存</el-button>
  </div>
</template>

<script>
import { user_addRoleToUser, user_queryRoleByUser } from '@/request/api'

export default {
  name: 'configRole',
  data () {
    return {
      checkAll: false,
      roleList: [],
      checkRoleList: [],
      isIndeterminate: false,
      btn: {
        submit: {
          loading: false
        }
      }
    }
  },
  props: {
    userId: String,
    closeParentLayer: {
      type: Function,
      default: null
    }
  },
  methods: {
    queryRoleByUser () {
      const me = this
      const params = {}
      params.userId = me.userId
      user_queryRoleByUser(params).then(res => {
        const code = res.code
        if (code === 200) {
          me.roleList = res.data
          me.checkRoleList = []
          for (var i = 0; i < me.roleList.length; i++) {
            var role = me.roleList[i]
            if (role.status === '1') {
              me.checkRoleList.push(role.roleId)
            }
          }
        } else {
          this.$message.error(res.resMsg)
        }
      })
    },
    handleCheckAllChange (val) {
      let checked = this.roleList.map(item => {
        return item.roleId
      })
      console.log(checked)
      this.checkRoleList = val ? checked : []
      this.isIndeterminate = false
    },
    handleChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.roleList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    onSubmit () {
      const me = this
      if (me.checkRoleList.length < 1) {
        this.$message({
          message: '请选择要授权的角色',
          type: 'warning'
        })
        return false
      }
      const params = {}
      params.userId = me.userId
      params.rIds = me.checkRoleList.join(',')
      me.btn.submit.loading = true
      user_addRoleToUser(params).then(res => {
        me.btn.submit.loading = false
        const code = res.code
        if (code === 200) {
          me.$message({
            message: res.resMsg,
            type: 'success'
          })
          me.closeParentLayer()
        } else {
          this.$message.error(res.resMsg)
        }
      })
    }
  },
  mounted () {
    this.queryRoleByUser()
  }
}
</script>

<style scoped>
</style>
