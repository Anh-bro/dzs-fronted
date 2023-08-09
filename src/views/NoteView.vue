<script>
import {getAllNote} from "../api/api"
import { useStore } from '../stores/globalStores.js'
export default {
    data() {
        const store = useStore()
        return {
            totalPage:0,
            pageSize:8,
            noteData:[{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
                }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
                }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
                }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            tableData:[],
            search: '',
            aid:store.aid
        }
    },
    mounted() {
        this.fetchNote()
        
    },
    methods: {
        async fetchNote(){        //获取笔记数据
            await getAllNote(this.aid).then(res=>{
                this.noteData=res.data
                this.totalPage=res.data.length
                this.tableData=this.noteData.slice(0,this.pageSize)
                console.log(res.data)
            })
            
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        onCurrentChange(p){
            console.log(p)
            this.pageNum=p
            if(p*this.pageSize>this.noteData.length){
                this.tableData=this.noteData.slice((p-1)*this.pageSize)
            }else{
                this.tableData=this.noteData.slice((p-1)*this.pageSize,p*this.pageSize)
            }
            console.log(this.tableData)
            

        }
    }
}
</script>
<template>
    <el-empty v-if='noteData.length==0' description="暂无笔记" style="flex-grow:1" />
    <el-row v-else>
        <el-col :span="24">
            <el-card >
                <!-- <h2>数据展示</h2> -->
                <el-table
                    :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                    style="width: 100%">
                    <!-- <el-table-column
                    label="Orderid"
                    prop="orderid"
                    width="120">
                    </el-table-column> -->
                    <el-table-column
                    label="Content"
                    prop="content">
                    </el-table-column>
                    <el-table-column  label="Operations" width="150px">
                        <template #default>
                            <el-button link type="primary" size="small" @click="handleClick">Delete</el-button>
                            <!-- <el-button link type="primary" size="small">Edit</el-button> -->
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination background layout="prev, pager, next" :total="totalPage" :page-size="8" @current-change="onCurrentChange"/>
            </el-card>
        </el-col>
        
        
    </el-row>
</template>
<style>
.el-card{
    height: 500px;
}
.pagination{
    margin-top: 24px;
    float: right;
}
</style>