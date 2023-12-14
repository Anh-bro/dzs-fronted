<script setup>
import { useStore } from '../stores/globalStores.js'
import router from "@/router";
import {reactive} from "vue";

const store = useStore()

const searchContent=reactive('')

function exit() {
  store.isAdmin=false
  router.push('/login')
}
</script>


<template>
    <el-header class="header">
        <div class="l-content">
            <el-button @click="store.doCollapse()">
                <el-icon>
                    <Menu />
                </el-icon>
            </el-button>
        </div>
        <div class="r-content">
            <el-dropdown style="width: 40px; margin-left:20px;">
                <span class="el-dropdown-link" style="width:40px ;">
                    <img style="width: 40px;height: 40px;border-radius: 50%;" src="../assets/images/boy.png" alt="">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="exit()">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<style >
.r-content {
    display: flex;
    align-items: center;
}

.header {
    width: 100%;
    /* background-color: #fff; */
    background: url(../assets/headerbg.jpg);
    background-size: 1000px 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.headerInput {
    width: 200px;

}
</style>
