<template>
  <div class="page">
    <el-form label-width="80px">
      <el-form-item label="上级菜单">
        <SelectTree
          :props="props"
          :options="menuData"
          :value="valueId"
          :clearable="isClearable"
          :accordion="isAccordion"
          @getValue="getValue($event)"/>
      </el-form-item>
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
        <el-button type="primary" @click="onSubmit" :loading="btn.submit.loading">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import SelectTree from '@/components/plugin/TreeSelect.vue'
import {menu_add, menu_findAllMenu} from '@/request/api'

export default {
  name: 'add',
  components: {
    SelectTree
  },
  data () {
    return {
      form: {
        menuName: '',
        path: '',
        icon: ''
      },
      btn: {
        submit: {
          loading: false
        }
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      parentId: 0, // 初始ID（可选）
      props: { // 配置项（必选）
        value: 'id',
        label: 'label',
        children: 'children'
        // disabled:true
      },
      // 选项列表（必选）
      menuData: null
    }
  },
  props: {
    closeParentLayer: {
      type: Function,
      default: null
    }
  },
  computed: {},
  methods: {
    onSubmit () {
      const me = this
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
      params.parentId = me.parentId
      params.name = menuName
      params.path = path
      params.icon = icon
      me.btn.submit.loading = true
      menu_add(params).then(res => {
        me.btn.submit.loading = false
        const code = res.code
        if (code === 200) {
          me.$message({
            message: res.resMsg,
            type: 'success'
          })
          me.closeParentLayer()
        } else {
          me.$message.error(res.resMsg)
        }
      })
    },
    // 取值
    getValue (value) {
      this.parentId = value
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
    }
  },
  mounted () {
    this.loadAllMenu()
  }
}
</script>

<style scoped>

  .page {
    padding: 15px;
  }

</style>
