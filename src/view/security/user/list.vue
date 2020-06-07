<template>
  <div>
    <div class="x-search">
      <el-form :inline="true">
        <el-form-item label="用户名称">
          <el-input v-model="search.form.userName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch(1)" :loading="search.loading">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="x-oper">
      <el-button type="success" size="small" @click="add">添加用户</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          prop="userPhone"
          label="手机号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名称"
          width="120">
        </el-table-column>
        <el-table-column
          prop="userEmail"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleConfigRole(scope.$index, scope.row)">配置角色
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
          :current-page="currPage"
          background
          layout="prev, pager, next"
          :total="10">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

import {user_list, user_del} from '@/request/api'
import UserAdd from '@/view/security/user/add'
import UserModify from '@/view/security/user/modify'
import ConfigRole from '@/view/security/user/configRole'

export default {
  name: 'List',
  data () {
    return {
      currPage: 1,
      tableData: [],
      search: {
        loading: false,
        form: {
          userName: ''
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
      if (me.search.form.userName.length > 0) {
        params.userName = me.search.form.userName
      }
      user_list(params).then(res => {
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
        title: '添加用户',
        shadeClose: false,
        area: ['500px', '450px'],
        content: {
          content: UserAdd, // 传递的组件对象
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
      const userId = row.userId
      const popupLayer = this.$layer.iframe({
        title: '编辑用户',
        shadeClose: false,
        area: ['500px', '450px'],
        content: {
          content: UserModify, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {// props
            userId: userId,
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
      const userId = row.userId
      this.$confirm('确定要删除吗?', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const params = {}
        params.userId = userId
        user_del(params).then(res => {
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
    handleConfigRole (index, row) {
      const userId = row.userId
      const popupLayer = this.$layer.iframe({
        title: '配置角色',
        shadeClose: false,
        area: ['500px', '450px'],
        content: {
          content: ConfigRole, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {// props
            userId: userId,
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
