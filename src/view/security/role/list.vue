<template>
  <div>
    <div class="x-search">
      <el-form :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="search.form.roleName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="doSearch(1)"
            :loading="search.loading"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="x-oper">
      <el-button
        type="success"
        size="small"
        @click="addRole"
      >添加角色</el-button>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="lastTime"
          label="更新时间"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="handleConfigMenu(scope.$index, scope.row)"
            >配置菜单
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
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
          :total="10"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 添加角色 -->
    <div>
      <el-dialog
        title="添加角色"
        :visible.sync="add.visible"
        :close-on-click-modal="false"
        :destroy-on-close="true"
        v-if="add.visible"
      >
        <RoleAdd @closeAddRoleDialog="closeAddRoleDialog"></RoleAdd>
      </el-dialog>
    </div>
    <!-- 编辑角色 -->
    <div>
      <el-dialog
        title="编辑角色"
        :visible.sync="modify.visible"
        :close-on-click-modal="false"
        v-if="modify.visible"
      >
        <RoleModify
          @closeMoidifyRoleDialog="closeMoidifyRoleDialog"
          :roleId="modify.roleId"
          :roleName="modify.roleName"
        ></RoleModify>
      </el-dialog>
    </div>
    <!-- 配置菜单 -->
    <div>
      <el-dialog
        title="配置菜单"
        :visible.sync="configMenu.visible"
        :close-on-click-modal="false"
        v-if="configMenu.visible"
      >
        <ConfigMenu
          @closeConfigMenuDialog="closeConfigMenuDialog"
          :roleId="configMenu.roleId"
        ></ConfigMenu>
      </el-dialog>
    </div>

  </div>
</template>

<script>

import { role_list, role_del } from '@/request/api'
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
      },
      add: {
        visible: false
      },
      modify: {
        visible: false,
        roleId: 0,
        roleName: ''
      },
      configMenu: {
        visible: false,
        roleId: 0
      }
    }
  },
  components: {
    RoleAdd: RoleAdd,
    RoleModify: RoleModify,
    ConfigMenu: ConfigMenu
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
    addRole () {
      this.add.visible = true
    },
    closeAddRoleDialog () {
      this.add.visible = false
      this.loadData()
    },
    handleEdit (index, row) {
      this.modify.roleId = row.roleId
      this.modify.roleName = row.roleName
      this.modify.visible = true
    },
    closeMoidifyRoleDialog () {
      this.modify.visible = false
      this.loadData()
    },
    handleConfigMenu (index, row) {
      this.configMenu.roleId = row.roleId
      this.configMenu.visible = true
    },
    closeConfigMenuDialog () {
      this.configMenu.visible = false
      this.loadData()
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
