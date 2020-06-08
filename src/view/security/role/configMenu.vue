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
    roleId: String,
    closeParentLayer: {
      type: Function,
      default: null
    }
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
    getCheckedNodes () {
      return this.$refs.tree.getCheckedNodes()
    },
    onSubmit () {
      const me = this
      const checkNodes = me.getCheckedNodes()
      if (checkNodes.length < 1) {
        this.$message({
          message: '请选择要配置的菜单',
          type: 'warning'
        })
        return false
      }
      var menuIdArr = []
      for (var i in checkNodes) {
        menuIdArr.push(checkNodes[i].id)
      }
      const params = {}
      params.roleId = me.roleId
      params.menuIds = menuIdArr.join(',')
      me.btn.submit.loading = true
      role_addMenuToRole(params).then(res => {
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
    this.findAllMenuByRole()
  }
}
</script>

<style scoped>
</style>
