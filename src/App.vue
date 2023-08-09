<script>
import CommonAside from './components/CommonAside.vue'
import CommonHeader from './components/CommonHeader.vue'
</script>

<template>
  <router-view></router-view>
</template>
<style>
#app {
  height: 100%;
}

.common-layout {
  height: 100%;

}

.common-layout>.el-container {
  height: 100%;
}

.el-container {
  flex-wrap: wrap;
  align-items: baseline;
}
</style>