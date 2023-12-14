<template>
    <el-row style="flex-wrap: wrap;">
        <el-col :span="24" style="text-align: center;">
            <el-autocomplete :fetch-suggestions="searchHistory" style="width: 500px ;margin-top=20px" size="large"
                v-model="input" placeholder="输入搜索内容" clearable />
            <el-button style="margin-left: 10px;" type="primary" size="large" @click="searchFunction()">搜索</el-button>

            <transition name="el-zoom-in-center">
                <el-scrollbar v-loading="loading" style="scroll-bahavior: smooth;margin-top: 10px;" max-height="650px">
                    <el-table v-show="tableshow" border="true" :data="searchResult">
                        <el-table-column prop="title" label="章节" width="100">
                            <template #default="scope">
                                <el-button link type="primary" @click="jumptotitle(scope.$index)">
                                    {{ scope.row.title }}
                                </el-button>
                                <!-- <el-button link type="primary" size="small">Edit</el-button> -->
                            </template>
                        </el-table-column>
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
<script >
import { searchPassage, getSearch } from '../api/api.js'
import {useStore} from "@/stores/globalStores";
import {ElNotification} from "element-plus";

export default {
    data() {
      const store=useStore()
      return {
        loading: false,
        tableshow: false,
        input: '',
        searchResult: [],
        store: store
      }
    },
    methods: {
        searchHistory(s, cb) {

            getSearch(this.store.username).then(res => {
                console.log(res)
                cb(res.data)
            })
        },
        jumptotitle(i) {
            console.log(this.searchResult[i])
            this.$router.push({
                name: 'read',
                query: {
                    aid: this.searchResult[i].aid,
                    orderid: this.searchResult[i].orderid
                }
            });

        },
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
            this.loading = true
            searchPassage(this.input,this.store.username).then(res => {
                console.log(res)
                this.searchResult = res.data
            })
            this.loading = false
            this.tableshow = true

        },
    },
    mounted() {
    },
}
</script>


<style></style> 