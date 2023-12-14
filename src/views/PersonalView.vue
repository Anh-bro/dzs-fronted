<script setup>
import {onMounted, reactive, ref} from "vue";
import {getAllMark,getSearch, getUserInfo, updateUserInfo} from "@/api/api";
import {useStore} from "@/stores/globalStores";
import router from "@/router";
import {ElNotification} from "element-plus";

const store=useStore()
const searchhistory=ref([])
const form = reactive({
  name:'',
  username: '',
  password: ''
})
function updateInfo(){
  updateUserInfo(form,store.username).then(res=>{
    if(res.code==200){
      ElNotification({
        title: '成功',
        message: '更新用户信息成功',
        type: 'success'
      })
    }else{
      ElNotification({
        title: '失败',
        message: res.message,
        type: 'error'
      })
    }
  })
}

onMounted(()=>{
  getUserInfo(store.username).then(res=>{
    if(res.code==200){
      console.log(res)
      form.username=res.data.username
      form.name=res.data.name
      form.password=res.data.password
    }else{
      router.push('/login')
    }
  })
  getSearch(store.username).then(res=>{
    if(res.code==200){
      for (const i in res.data) {
        searchhistory.value.push(res.data[i])
      }
      console.log(searchhistory.value)
    }
  })
})
</script>

<template>
  <el-row :gutter="20">
    <el-col style="text-align: center" :span="12">
      <div style="font-size: 25px;font-weight: bold">基本信息</div>
      <el-form label-position="left" label-width="100px" :model="form" style="margin-top: 20px">
        <el-form-item label="用户姓名：">
            <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="账户名：">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码：">
          <el-input show-password type="password" v-model="form.password" />
        </el-form-item>
      </el-form>
      <div style="margin-top: 40px;text-align: center">
        <el-button style="width: 200px" type="success" @click="updateInfo" plain>保存</el-button>
      </div>
    </el-col>
    <el-col style="text-align: center" :span="12">
      <div style="font-size: 25px;font-weight: bold">查询历史</div>
      <div v-if="searchhistory.length==0">空</div>
      <div v-else style="margin-top: 20px">
        <div style="margin-top: 10px;font-size: 14px" v-for="item in searchhistory">
          {{item.value}}
        </div>
      </div>
      <el-divider />
      <div style="font-size: 25px;margin-top: 20px;font-weight: bold">阅读热词</div>
      <div v-if="searchhistory.length==0">空</div>
      <div v-else style="margin-top: 20px">
        <div style="margin-top: 10px;font-size: 14px" v-for="item in searchhistory">
          {{item.value}}
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<style scoped>

</style>