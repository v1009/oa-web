<template>
  <el-row>
    <el-col :span="4">
      <div>
        <el-button type="success" size="small" @click="addMenu">新增菜单</el-button>
      </div>
      <el-tree
        :data="menuData"
        node-key="id"
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        @node-click="nodeClick"
        draggable
        :expand-on-click-node="false"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
      </el-tree>
    </el-col>
    <el-col :span="20">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.menuName"></el-input>
        </el-form-item>
        <el-form-item label="跳转路径">
          <el-input v-model="form.path"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="doUpdate" :loading="btn.submit.loading">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>

import MenuAdd from '@/view/security/menu/add'
import {menu_modify, menu_findAllMenu} from '@/request/api'

export default {
  name: 'list',
  data () {
    return {
      menuData: null,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      btn: {
        submit: {
          loading: false
        }
      },
      form: {
        id: '',
        menuName: '',
        path: '',
        icon: ''
      }
    }
  },
  methods: {
    handleDragStart (node, ev) {
      console.log('drag start', node)
    },
    handleDragEnter (draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label)
    },
    handleDragLeave (draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label)
    },
    handleDragOver (draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label)
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType)
    },
    handleDrop (draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner'
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1
    },
    addMenu () {
      const me = this
      const popupLayer = this.$layer.iframe({
        title: '添加菜单',
        shadeClose: false,
        area: ['500px', '450px'],
        content: {
          content: MenuAdd, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {// props
            closeParentLayer () {
              this.$layer.close(popupLayer)
              me.loadAllMenu()
            }
          }
        }
      })
    },
    loadAllMenu () {
      const me = this
      const params = {}
      menu_findAllMenu(params).then(res => {
        const code = res.code
        if (code === 200) {
          me.menuData = res.data
        } else {
          this.$message.error(res.resMsg)
        }
      })
    },
    nodeClick (item, node) {
      const me = this
      me.form.id = item.id
      me.form.menuName = item.label
      me.form.path = item.path
      me.form.icon = item.icon
    },
    doUpdate () {
      const me = this

      const id = me.form.id
      if (id.length < 1) {
        this.$message({
          message: '请选择要修改的菜单',
          type: 'warning'
        })
        return false
      }
      const menuName = me.form.menuName
      if (menuName.length < 1) {
        this.$message({
          message: '请输入菜单名称',
          type: 'warning'
        })
        return false
      }
      const path = me.form.path
      if (path.length < 1) {
        this.$message({
          message: '请输入跳转路径',
          type: 'warning'
        })
        return false
      }
      const icon = me.form.icon

      const params = {}
      params.id = id
      params.name = menuName
      params.path = path
      params.icon = icon
      me.btn.submit.loading = true
      menu_modify(params).then(res => {
        me.btn.submit.loading = false
        const code = res.code
        if (code === 200) {
          me.$message({
            message: res.resMsg,
            type: 'success'
          })
          me.loadAllMenu()
        } else {
          me.$message.error(res.resMsg)
        }
      })
    }
  },
  mounted () {
    this.loadAllMenu()
  }
}

</script>

<style scoped>

</style>
