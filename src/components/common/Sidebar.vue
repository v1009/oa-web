<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="activeMenu"
      :collapse="collapse"
      background-color="#24252f"
      text-color="rgba(255, 255, 255, .7)"
      active-text-color="rgba(255, 255, 255, .7)"
      unique-opened
      router
    >
      <div class="header-slot--left" :class="collapse? 'header-slot--stop':''">
        <div>
          <img src="../../assets/logo.png" class="logo" />
          <span class="logo-text">管理系统</span>
        </div>
      </div>
      <template v-for="menu in items">
        <template v-if="menu.subs">
          <el-submenu :index="menu.id" :key="menu.id">
            <template slot="title">
              <i :class="menu.icon"></i>
              <span slot="title">{{ menu.name }}</span>
            </template>
            <template v-for="subItem in menu.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.id" :key="subItem.id">
                <template slot="title">{{ subItem.name}}</template>
                <el-menu-item
                  v-for="(threeItem,i) in subItem.subs"
                  :key="i"
                  :index="threeItem.id"
                  @click="openUrl(threeItem.id,threeItem.path)"
                >{{ threeItem.name }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.id"
                :key="subItem.id"
                @click="openUrl(subItem.id,subItem.path)"
              >{{ subItem.name }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="menu.id" :key="menu.id" @click="openUrl(menu.id,menu.path)">
            <i :class="menu.icon"></i>
            <span slot="title">{{ menu.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
import { menu_findMenu } from '@/request/api'

export default {
  name: 'Sidebar',
  data () {
    return {
      collapse: false,
      items: [
        {
          id: 1,
          icon: 'el-icon-platform-eleme',
          name: '控制台',
          path: '/dashboard'
        },
        {
          id: 2,
          icon: 'el-icon-star-off',
          name: '权限管理',
          subs: [
            {
              id: 201,
              name: '用户管理',
              path: '/security/user/list'
            },
            {
              id: 202,
              name: '角色管理',
              path: '/security/role/list'
            },
            {
              id: 203,
              name: '菜单管理',
              path: '/security/menu/list'
            }
          ]
        },
        {
          id: 3,
          icon: 'el-icon-picture-outline',
          name: '日报管理',
          subs: [
            {
              id: 301,
              name: '日报列表',
              path: '/daily/list'
            }
          ]
        }
      ]
    }
  },
  computed: {
    activeMenu () {
      return this.$store.state.menuIdx
    }
  },
  mounted: {

  },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  methods: {
    openUrl (id, path) {
      this.$store.commit('changeMenuIdx', {
        id: id
      })
      this.$router.push({
        path: path
      })
    },
    loadMenu () {
      const me = this
      const params = {}
      menu_findMenu(params).then(res => {
        const code = res.code
        if (code === 200) {
          me.menuData = res.data
        } else {
          this.$message.error(res.resMsg)
        }
      })
    }
  }
}
</script>

<style scoped>
.header-slot--left {
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
  overflow: hidden;
  min-width: 220px;
  font-size: 16px;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  line-height: 50px;
  height: 50px;
  background: #24252f;
  color: #fff;
}

.header-slot--left .logo-text {
  display: inline-block;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}

.header-slot--left .logo {
  background-color: #3a3a3a;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  vertical-align: middle;
  border: 1px solid #fff;
}

.header-slot--stop {
  min-width: 64px;
  padding-left: 0;
  padding-right: 0;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}

.header-slot--stop .logo-text {
  display: none;
  -webkit-transition: 0.3s ease-in-out;
  transition: 0.3s ease-in-out;
}

.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 0px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}

.sidebar > ul {
  height: 100%;
}

.el-menu-item {
  padding: 5px 20px;
  line-height: 46px;
}

.el-submenu {
  padding: 5px 0px;
  line-height: 46px;
}

.el-menu-item,
.el-submenu {
  text-align: left;
}

.el-submenu__title i {
  color: rgba(255, 255, 255, 0.7);
}

.el-menu-item i {
  color: rgba(255, 255, 255, 0.7);
}

.el-menu-item.is-active {
  background-color: #019b8b !important;
}

.el-submenu .el-menu-item {
  height: 46px;
  line-height: 40px;
  min-width: 200px;
}
</style>
