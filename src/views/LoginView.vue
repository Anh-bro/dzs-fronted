<template>
    <div class="bg" v-loading="loading" element-loading-background="rgba(122, 122, 122, 0.8)">
        <el-form ref="form" label-width='70px' class='login-container' :model="form" :rules="rules">
            <h3 class="login_title">系统登录</h3>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" style="margin-left: 40px;">
                    登录
                </el-button>
            </el-form-item>
        </el-form>
        <a style="cursor:pointer;position: fixed;right: 10px;bottom:10px;color: #fff;"
            @click="this.isVisual = !this.isVisual">导入数据包</a>
      <a style="cursor:pointer;position: fixed;right: 100px;bottom:10px;color: #fff;"
         @click="handleExportButton">导出数据包</a>
    </div>
    <el-dialog v-model="isVisual" title="请选择文件">
        <el-upload ref="importDataUploader" class="upload-demo" action="/api/importData" :limit="1"
            :on-exceed="handleExceed" :auto-upload="false" :on-error="fileUpLoadError" :on-success="fileUpLoadSuccess" name="dataPack">
            <template #trigger>
                <el-button type="primary">选择文件</el-button>
            </template>
        </el-upload>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="this.isVisual = !this.isVisual">取消</el-button>
                <el-button type="primary" @click="importData()">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style>
.bg {
    height: 100%;
    width: 100%;
    background: url("../assets/headerbg.jpg");
    background-position: center;
    background-size: cover;
}

.login-container {
    width: 350px;
    border: 1px solid #eaeaea;
    padding: 35px 35px 15px 35px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 25px #cac6c6;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.login_title {
    text-align: center;
    margin-bottom: 40px;
    color: #505458;
    font-size: large;
}


</style>
<script>
import { useStore } from '../stores/globalStores.js'
import {exportData, getLogin} from '../api/api';
import request from "../api/request";
import router from "../router";
import {ElNotification} from "element-plus";
export default {
    data() {
        const store = useStore()
        return {
            isVisual: false,
            loading: false,
            store: store,
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 6, message: '用户名长度在 3 到 6 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输密码', trigger: 'blur' },
                    { min: 3, max: 6, message: '密码长度在 3 到 6 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
    },
    methods: {
      fileUpLoadError(response){
        console.log(response)
      },
      fileUpLoadSuccess(response){
        console.log(response)
        if(response.code==200){
          ElNotification({
            title: '成功',
            message: '导入成功!',
            type: 'success'
          })
        }else{
          ElNotification({
            title: '失败',
            message: response.message,
            type: 'error'
          })
        }
      },
        importData() {
            this.$refs.importDataUploader.submit()
            this.isVisual = true;
        },
        handleExportButton(){
        this.loading=true
          exportData().then(res=>{
            this.loading=false;
            if(res.code==200){
              this.$alert(res.data, '导出成功', {
                confirmButtonText: '确定'
              });
            }
          })
        },
        open(msg) {
            this.$alert(msg, {
                confirmButtonText: '确定',

            });

        },
        submit() {

            this.loading = true

            getLogin(this.form).then((res) => {
                console.log(res);
                console.log(this.form.username)
                if (res.code == 200) {
                    if (this.form.username === 'admin') {
                        this.store.isAdmin = true
                    }
                    this.$router.push({
                        name: 'home',
                        query: res.data
                    });
                    this.store.logintime=res.data.logintime
                    this.store.username = this.form.username
                }
                else {
                    this.loading = false
                    this.$alert(res.message)
                }
            }).catch((err) => {
                this.loading = false
              if(err.name=='AxiosError'){
                console.log(err);
                this.open('后台服务暂不可用')
              }
            });
        },
    },
}
</script>
  
  