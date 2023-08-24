<script>
import { useStore } from '../stores/globalStores.js'
import Cookie from 'js-cookie'
export default {
    data() {
        const store = useStore()
        console.log(store.isCollapse)
        return {
            colState: false,
            store: store,
            w300: 'w200'
        }
    },
    methods: {
        menuItemClick(e) {
            // console.log(e['index'])
            console.log(e['index'])
            this.$router.push(e['index'])
            this.store.loading = true
        },
        logout(e) {
            Cookie.remove('token')
            this.$router.push('/login')
        }
    },
    mounted() {

    }
}
</script>

<template>
    <el-aside :width="store.isCollapse ? '64px' : '200px'"
        style=" border-right:1px solid #dcdfe6 ;background-color: #f7f8ff;;height: 100%;">

        <div class="logo">{{ store.txt }}</div>
        <el-menu active-text-color="#1b76f5" background-color="#f7f8ff" class="el-menu-vertical-demo" default-active="2"
            style="border-right: none" :collapse="store.isCollapse" :collapse-transition="false">
            <el-menu-item @click="menuItemClick" index="/home">
                <el-icon>
                    <Position />
                </el-icon>
                <!-- <span>主页</span> -->
                <template #title>主页</template>
            </el-menu-item>
            <el-menu-item @click="menuItemClick" index="/read">
                <el-icon>
                    <View />
                </el-icon>
                <template #title>阅读</template>
            </el-menu-item>
            <el-menu-item @click="menuItemClick" index="/search">
                <el-icon>
                    <Search />
                </el-icon>
                <template #title>搜索</template>
            </el-menu-item>
            <el-menu-item @click="menuItemClick" index="/note">
                <el-icon>
                    <DocumentCopy />
                </el-icon>
                <template #title>笔记管理</template>
            </el-menu-item>
            <el-menu-item v-if="store.isAdmin" @click="menuItemClick" index="/admin">
                <el-icon>
                    <Setting />
                </el-icon>
                <template #title>管理</template>
            </el-menu-item>
            <!-- <el-menu-item v-else @click="menuItemClick" index="/user">
                <el-icon>
                    <User />
                </el-icon>
                <template #title>个人中心</template>
            </el-menu-item> -->

        </el-menu>

    </el-aside>
</template>
<style>
.w200 {
    width: 200px;
}

.el-aside {
    background-color: #fff;
    overflow: hidden;
}

.logo {
    height: 40px;
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    /* background-color: rgb(27, 118, 245); */
    background: linear-gradient(180deg, rgba(27, 118, 245, 1) 10%, rgba(247, 248, 255, 1) 100%);
    color: #fff;
    font-size: 24px;
}
</style>