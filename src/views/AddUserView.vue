<script setup>
import {reactive} from "vue";
import {addUser} from "@/api/api";
import {ElNotification} from "element-plus";

const form = reactive({
  name:'',
  username: '',
  password: ''
})
function add(){
  addUser(form).then(res=>{
    console.log(res);
    if(res.code==200){
      ElNotification({
        title: '成功',
        message: '账户名为'+form.username+'的用户添加成功',
        type: 'success'
      })
    }else{
      ElNotification({
        title: '错误',
        message: res.message,
        type: 'error'
      })
    }
  })
}
</script>

<template>
  <el-row justify="center" :gutter="20" style="text-align: center">
    <el-col style="text-align: center" :span="16">
      <div style="font-size: 25px;font-weight: bold">添加用户</div>
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
        <el-button style="width: 200px" type="success" @click="add" plain>保存</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>

</style>