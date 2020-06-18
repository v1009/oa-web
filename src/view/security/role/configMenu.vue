<template>
  <div>
    <el-tree
      :data="menuData"
      show-checkbox
      node-key="id"
      ref="tree"
      :default-expand-all="true"
      :default-checked-keys="checkMenuData"
      :props="defaultProps"
    >
    </el-tree>
    <el-button
      type="primary"
      @click="onSubmit"
      :loading="btn.submit.loading"
    >保存</el-button>
  </div>
</template>

<script>
import { role_addMenuToRole, menu_findAllMenuByRole } from '@/request/api'

export default {
  name: 'configRole',
  data () {
    return {
      menuData: [],
      checkMenuData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      btn: {
        submit: {
          loading: false
        }
      }
    }
  },
  props: {
    roleId: String
  },
  methods: {
    findAllMenuByRole () {
      const me = this
      const params = {}
      params.roleId = me.roleId
      menu_findAllMenuByRole(params).then(res => {
        const code = res.code
        if (code === 200) {
          me.menuData = res.data
          me.checkMenuData = []
          for (var i = 0; i < me.menuData.length; i++) {
            var menu = me.menuData[i]
            if (menu.checked) {
              me.checkMenuData.push(menu.id)
            }
          }
        } else {
          this.$message.error(res.resMsg)
        }
      })
    },
    getCheckedNodeIds () {
      var allCheckedNodeIds = []
      var halfCheckedNodeList = this.$refs.tree.getHalfCheckedNodes()
      var checkedNodeList = this.$refs.tree.getCheckedNodes()
      if (halfCheckedNodeList.length > 0) {
        for (var i = 0; i < halfCheckedNodeList.length; i++) {
          allCheckedNodeIds.push(halfCheckedNodeList[i].id)
        }
      }
      if (checkedNodeList.length > 0) {
        for (var i = 0; i < checkedNodeList.length; i++) {
          allCheckedNodeIds.push(checkedNodeList[i].id)
        }
      }
      return allCheckedNodeIds
    },
    onSubmit () {
      const me = this
      const checkNodeIds = me.getCheckedNodeIds()
      if (checkNodeIds.length < 1) {
        this.$message({
          message: '请选择要配置的菜单',
          type: 'warning'
        })
        return false
      }
      const params = {}
      params.roleId = me.roleId
      params.menuIds = checkNodeIds.join(',')
      me.btn.submit.loading = true
      role_addMenuToRole(params).then(res => {
        me.btn.submit.loading = false
        const code = res.code
        if (code === 200) {
          me.$message({
            message: res.resMsg,
            type: 'success'
          })
          me.$emit('closeConfigMenuDialog')
        } else {
          this.$message.error(res.resMsg)
        }
      })
    }
  },
  mounted () {
    this.findAllMenuByRole()
  }
}
</script>

<style scoped>
</style>
