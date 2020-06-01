<template>
  <div>
    <div class="x-search">
      <el-form :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="search.form.roleName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch(1)" :loading="search.loading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="x-oper">
      <el-button type="success" size="small" @click="add">添加角色</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="lastTime"
          label="更新时间">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleConfigMenu(scope.$index, scope.row)">配置菜单
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px;">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          background
          layout="prev, pager, next"
          :total="10">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

import {role_list, role_del} from '@/request/api'
import RoleAdd from '@/view/security/role/add'
import RoleModify from '@/view/security/role/modify'
import ConfigMenu from '@/view/security/role/configMenu'

export default {
  name: 'List',
  data () {
    return {
      currPage: 1,
      tableData: [],
      search: {
        loading: false,
        form: {
          roleName: ''
        }
      }
    }
  },
  methods: {
    doSearch (currPage) {
      const me = this
      me.currPage = currPage
      me.search.loading = true
      me.loadData()
    },
    loadData () {
      const me = this

      const params = {}
      params.page = me.currPage
      if (me.search.form.roleName.length > 0) {
        params.roleName = me.search.form.roleName
      }
      role_list(params).then(res => {
        me.search.loading = false
        const code = res.code
        if (code === 200) {
          me.tableData = res.data
        } else {
          this.$message.error(res.resMsg)
        }
      })
    },
    handleCurrentChange (currPage) {
      this.doSearch(currPage)
    },
    isCompleteConverter (row, cell, cellVal, rowIndex) {
      if (cellVal === 1) {
        return '是'
      } else {
        return '否'
      }
    },
    add () {
      const me = this
      const popupLayer = this.$layer.iframe({
        title: '添加角色',
        shadeClose: false,
        area: ['500px', '450px'],
        content: {
          content: RoleAdd, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {// props
            closeParentLayer () {
              this.$layer.close(popupLayer)
              me.loadData()
            }
          }
        }
      })
    },
    handleEdit (index, row) {
      const me = this
      const roleId = row.roleId
      const roleName = row.roleName
      const popupLayer = this.$layer.iframe({
        title: '编辑角色',
        shadeClose: false,
        area: ['500px', '450px'],
        content: {
          content: RoleModify, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {// props
            roleId: roleId,
            roleName: roleName,
            closeParentLayer () {
              this.$layer.close(popupLayer)
              me.loadData()
            }
          }
        }
      })
    },
    handleDelete (index, row) {
      const me = this
      const roleId = row.roleId
      this.$confirm('确定要删除吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const params = {}
        params.roleId = roleId
        role_del(params).then(res => {
          const code = res.code
          if (code === 200) {
            this.$message({
              message: res.resMsg,
              type: 'success'
            })
            me.loadData()
          } else {
            this.$message.error(res.resMsg)
          }
        })
      }).catch(() => {

      })
    },
    handleConfigMenu (index, row) {
      const roleId = row.roleId
      const popupLayer = this.$layer.iframe({
        title: '配置菜单',
        shadeClose: false,
        area: ['500px', '450px'],
        content: {
          content: ConfigMenu, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {// props
            roleId: roleId,
            closeParentLayer () {
              this.$layer.close(popupLayer)
            }
          }
        }
      })
    }
  },
  mounted () {
    this.loadData()
  }
}
</script>

<style scoped>

  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-table .cell {
    white-space: pre-line !important;
  }

</style>
