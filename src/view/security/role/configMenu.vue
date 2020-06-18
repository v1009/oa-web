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
    ></el-tree>
    <el-button type="primary" @click="onSubmit" :loading="btn.submit.loading">保存</el-button>
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
          me.eachCheckedNodes(me.menuData)
        } else {
          this.$message.error(res.resMsg)
        }
      })
    },
    eachCheckedNodes (nodeList) {
      for (var i = 0; i < nodeList.length; i++) {
        var nodeChildList = nodeList[i].children
        if (nodeChildList && nodeChildList.length > 0) {
          this.eachCheckedNodes(nodeChildList)
        } else {
          var menu = nodeList[i]
          if (menu.checked) {
            this.checkMenuData.push(menu.id)
          }
        }
      }
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
        for (var k = 0; k < checkedNodeList.length; k++) {
          allCheckedNodeIds.push(checkedNodeList[k].id)
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
      console.log(params)
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
