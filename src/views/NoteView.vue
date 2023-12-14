<script>
import { getOriginalIndex, getAllNote, getNoteByAid, deleteNoteByAidOrderid } from "../api/api"
import { useStore } from '../stores/globalStores.js'
import { ElNotification } from 'element-plus'
export default {
    data() {
        const store = useStore()
        return {
            originalindex: {},
            loading: false,
            totalPage: 0,
            pageSize: 8,
            noteData: [],
            tableData: [],
            search: '',
            store:store,
            aid: store.aid
        }
    },
    mounted() {
        this.fetchNote()

    },
    methods: {
        async fetchNote() {        //获取笔记数据
            this.loading = true
            await getAllNote(this.store.username).then(res => {
                console.log("getAllNote", res)
                this.noteData = res.data
                this.totalPage = res.data.length
                this.tableData = this.noteData.slice(0, this.pageSize)
                console.log(res.data)
            })
            await getOriginalIndex().then(res => {
                console.log(res)
                this.originalindex = res.data
            })
            var dic = new Array();
            for (var i = 0; i < this.originalindex.length; i++) {
                dic[this.originalindex[i].id] = this.originalindex[i].name
                // console.log(dic);
            }
            for (var i = 0; i < this.noteData.length; i++) {
                this.noteData[i].title = dic[this.noteData[i].aid]
            }
            console.log(this.noteData)
            this.loading = false

        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        jumptotitle(i) {
            console.log(this.noteData[i].aid)
            this.$router.push({
                name: 'read',
                query: { aid: this.noteData[i].aid }
            });

        },
        async handleDelete(index) {
            console.log(this.tableData[index].orderid);
            await deleteNoteByAidOrderid({
                aid: this.tableData[index].aid,
                orderid: this.tableData[index].orderid
            }).then(res => {
                console.log(res)
                this.tableData.forEach(function (item, itemindex, arr) {
                    if (itemindex == index) {
                        arr.splice(index, 1);
                    }
                    ElNotification({
                        title: '提示',
                        message: '笔记删除成功！',
                        type: 'success'
                    })
                });
            })
        },
        onCurrentChange(p) {
            console.log(p)
            this.pageNum = p
            if (p * this.pageSize > this.noteData.length) {
                this.tableData = this.noteData.slice((p - 1) * this.pageSize)
            } else {
                this.tableData = this.noteData.slice((p - 1) * this.pageSize, p * this.pageSize)
            }
            console.log(this.tableData)


        }
    }
}
</script>
<template>
    <el-empty v-if='noteData.length == 0' description="暂无笔记" style="flex-grow:1" />
    <el-row v-else v-loading="loading">
        <el-col style="overflow-x:hidden ;" :span="24">
            <el-card style="height: 650px;">
                <div style="height:560px;">
                    <!-- <h2>数据展示</h2> -->
                    <el-table
                        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                        style="width: 100%">
                        <!-- <el-table-column
                    label="Orderid"
                    prop="orderid"
                    width="120">
                    </el-table-column> -->
                        <el-table-column label="标题" prop="title" width="150px">
                            <template #default="scope">
                                <el-button link type="primary" size="small" @click="jumptotitle(scope.$index)">{{
                                    scope.row.title }}</el-button>
                                <!-- <el-button link type="primary" size="small">Edit</el-button> -->
                            </template>
                        </el-table-column>

                        <el-table-column label="内容" prop="content">
                        </el-table-column>
                        <el-table-column label="操作" width="150px">
                            <template #default="scope">
                                <el-button link type="primary" size="small"
                                    @click="handleDelete(scope.$index)">删除</el-button>
                                <!-- <el-button link type="primary" size="small">Edit</el-button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <el-pagination style=" justify-content: center;" background layout="prev, pager, next"
                        :total="totalPage" :page-size="8" @current-change="onCurrentChange" />
                </div>

            </el-card>
        </el-col>


    </el-row>
</template>
<style>
.el-pagination.is-background .el-pager li:not(.disabled) {
    background-color: #e32332;
    color: #fff;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #FFBB46;
    color: #fff;
}
</style>