<script>
import { useStore } from '../stores/globalStores.js'

export default {
    data() {
        const store = useStore()
        console.log(store.isCollapse)
        return {
            searchContent: '',
            store: store
        }
    }
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

            <!-- <el-input class="headerInput" v-model="searchContent" placeholder="查找内容">
                <template #prefix>
                    <el-icon>
                        <search />
                    </el-icon>
                </template>
            </el-input> -->
            <el-dropdown style="width: 40px; margin-left:20px;">
                <span class="el-dropdown-link" style="width:40px ;">
                    <img style="width: 40px;height: 40px;border-radius: 50%;" src="../assets/images/QQ图片20221125222615.jpg"
                        alt="">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出</el-dropdown-item>
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
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, .05);
}

.headerInput {
    width: 200px;

}
</style>
