<template>
    <el-row style="flex-wrap: wrap;">
        <el-col :span="24" style="text-align: center;">
            <el-input style="width: 500px ;margin-top=20px" size="large" v-model="input" placeholder="输入搜索内容" clearable />
            <el-button size="large" @click="searchFunction()">搜索</el-button>

            <transition name="el-zoom-in-center">
                <el-scrollbar style="scroll-bahavior: smooth;margin-top: 10px;" max-height="650px">
                    <el-table v-show="tableshow" border="true" :data="searchResult">
                        <el-table-column prop="title" label="章节" width="100" />
                        <el-table-column prop="levelname" label="级别" width="100" />
                        <el-table-column prop="content" label="内容">
                            <template #default="scope">
                                <span v-html="hightLight(scope.row.content)">

                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-scrollbar>

            </transition>

        </el-col>

    </el-row>
</template>
<script>
import { searchPassage } from '../api/api.js'
export default {
    data() {
        return {
            tableshow: false,
            input: '',
            searchResult: [],
        }
    },
    methods: {
        hightLight(data) {
            // 如果标题中包含，关键字就替换一下
            if (data.includes(this.input)) {
                data = data.replace(
                    this.input,
                    // 这里是替换成html格式的数据，最好再加一个样式权重，保险一点
                    '<font style="color:red!important;">' + this.input + '</font>'
                )
                return data
            }
            // 不包含的话还用这个
            else {
                return title
            }
        },
        searchFunction() {
            if (this.input == '') {
                ElNotification({
                    title: '错误',
                    message: '请输入搜索内容',
                    type: 'error'
                })
            }
            searchPassage(this.input).then(res => {
                console.log(res)
                this.searchResult = res.data

            })

            this.tableshow = true

        },
    },
    mounted() {
    },
}
</script>


<style></style> 