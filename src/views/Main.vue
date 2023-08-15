<script>
import CommonAside from '../components/CommonAside.vue'
import CommonHeader from '../components/CommonHeader.vue'
</script>

<template>
  <div class="common-layout">
    <el-container class="commoncontent" style="overflow:hidden;height:100%">

      <CommonAside></CommonAside>
      <el-container style="height: 100%;">
        <CommonHeader></CommonHeader>
        <el-main style="height: 90%;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style>
.el-main {
  display: flex;
  overflow: hidden;
  height: calc(100vh-70px);
}

.el-main .el-row {
  flex-grow: 1;
}



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
  align-items: flex-start;
}

.commoncontent {
  flex-wrap: nowrap;
}

.commoncontent .el-aside {
  background-color: #fff;
}
</style>