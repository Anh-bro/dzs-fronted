<script setup>
import {getAllMark} from "@/api/api";
import {onMounted, reactive} from "vue";
import {useStore} from "@/stores/globalStores";
import router from "@/router";
const store=useStore()

const tableData = reactive([])
function handleFunction(e){

  console.log(tableData[e]['aid'])
  router.push({
    name:'read',
    query:{
      'aid':tableData[e]['aid']
    }
  })
}
onMounted(()=>{
  getAllMark(store.username).then(res=>{
    console.log(res.data)
    for (const i in res.data) {
      tableData.push(res.data[i])
    }
    console.log("tabelDate",tableData)
  })
})
</script>

<template>
  <div style="display: block;width: 100%">
    <div style="font-size: 24px;font-weight: bold;text-align: center;margin-bottom: 20px">
      添加的书签
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期"  width="200px" />
      <el-table-column prop="title" label="标题"  />
      <el-table-column prop="date" label="操作"  >
        <template #default="scope">
          <el-button link type="primary" size="small"
                     @click="handleFunction(scope.$index)">跳转</el-button>
          <!-- <el-button link type="primary" size="small">Edit</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>

</style>