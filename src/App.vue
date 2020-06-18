<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
}

body {
  margin: 0;
  padding: 0;
  background: #fff;
}

.el-submenu .el-menu {
  background-color: #1d1d26 !important;
  padding: 5px 0;
}

.el-submenu .el-menu li {
  background-color: #1d1d26 !important;
}

.el-tooltip {
  padding: 5px 20px !important;
}
</style>
