<template>
    <div class="bg" v-loading="loading" element-loading-text="等待后台启动...">


        <el-form ref="form" label-width='70px' class='login-container' :model="form" :rules="rules">
            <h3 class="login_title">系统登录</h3>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" style="margin-left: 40px;">
                    登录
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style>
.bg {
    height: 100%;
    width: 100%;
    background: url("../assets/bg.jpg");
    background-position: center;
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

.el-input {
    width: 198px;
}
</style>
<script>
import { useStore } from '../stores/globalStores.js'
import { getLogin } from '../api/api';
import request from "../api/request";
import router from "../router";
export default {
    data() {
        const store = useStore()
        return {
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
        open(msg) {
            this.$alert(msg, {
                confirmButtonText: '确定',
                callback: action => {
                    this.$message({
                        type: 'info',
                        message: `action: ${action}`
                    });
                }
            });

        },
        submit() {

            getLogin(this.form).then((res) => {
                console.log(res);

                if (res.code == 200) {
                    this.$router.push({
                        name: 'home',
                        query: res.data
                    });
                    if (this.form.username == 'admin') {
                        this.store.isAdmin = true
                    }
                    this.store.username = this.form.username
                }
                else {
                    this.$alert(res.message)
                }
            }).catch((err) => {
                console.log(err);
                this.open(err)
            });
        },
    },
}
</script>
  
  