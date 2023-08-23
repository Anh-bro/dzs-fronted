<template>
  <el-row>
    <el-col :span="8">
        <el-card shadow="hover" @click="clickTreeNode" v-loading="loading">
            <div style="justify-content: space-between;"> 
                <el-input style="display:inline" placeholder="输入节点名称" v-model='nodename'></el-input>
                <el-button @click="appendRootNode()">增加</el-button>
            </div>

            <el-scrollbar max-height="600px">
                <el-tree
                :data="data"
                :expand-on-click-node="false"
                node-key="id"
                default-expand-all
                ref="myTree"
                >
                <template #default="{ node, data }" >
                    <span class="custom-tree-node">
                    <span>{{ node.label }}</span>
                
                    <span>
                        <a  @click="append(data)"> 增加 </a>
                        <a style="margin-left: 8px" @click="remove(node, data)"> 删除 </a>
                        <a style="margin-left: 8px" @click="edit(node, data)"> 编辑 </a>
                    </span>
                    </span>
                </template>
                </el-tree>
            </el-scrollbar>

      </el-card>
    </el-col>
    <el-col :span="16" margin-left="5px">
        <el-scrollbar max-height="400px"  style="scroll-bahavior: smooth;">
            <el-table highlight-current-row ref="myTable" :data="passageData" style="width: 100%"  border=true @row-click="selectionLineChangeHandle">
                <el-table-column prop="aid" label="Aid" width="50px" />
                <el-table-column prop="content" label="Content" show-overflow-tooltip=true>
                    <template #default="scope">
                        <img v-if="scope.row.level=='img'" :src="scope.row.content" style="height: 100px;" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="level" label="Level" width="100px"/>
            </el-table>
        </el-scrollbar>
    </el-col>
    <el-col :span="24">
        <el-card shadow="hover" height="200" v-loading="loading" >
            <div style="height: 200px;">
                <!-- //TODO 添加文章表单 -->
                <el-form :model="form" :inline="false">
                    <el-form-item label="添加类型:">
                        <el-select v-model="form.level" placeholder="请选择类型">
                            <el-option label="一级标题" value="title1" />
                            <el-option label="二级标题" value="title2" />
                            <el-option label="正文" value="paragraph" />
                            <el-option label="图片" value="img" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文字内容:">
                        <el-input v-model="form.content" type="textarea" />    
                        
                    </el-form-item>
                    <el-form-item label="图片内容:">
                        <el-upload
                            ref="myupload"
                            class="upload-demo"
                            action="/api/upload"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :auto-upload="false"
                            name="photo"
                            :data="{aid:this.aid}"
                        >
                            <template #trigger>
                                <el-button type="primary">select file</el-button>
                            </template>
                            <!-- <el-button class="ml-3" type="success" @click="submitUpload">
                                upload to server
                            </el-button> -->
                        </el-upload>
                        <el-button style="margin-left: 200px;" type="primary" @click="addPassageContent()">添加</el-button>
                        <el-button style="margin-left: 20px;" type="primary" @click="deleteTableRow()">删除选中行</el-button>
                    </el-form-item>
                    <el-form-item>
                        
                        <!-- <el-button>Cancel</el-button> -->
                    </el-form-item>
                </el-form>
                 
            </div>
        </el-card>
    </el-col>
  </el-row>

</template>
<script>
import { getTransitionRawChildren } from "vue"
import {deleteNoteByAidOrderid,getIndex,getIndexNum,addIndexNode,deleteIndexNode,getPassage,addPassageText,deletePassageContent} from "../api/api.js"
export default{
    data(){
        return{
            dataonLineListSelections:{},
            aid:0,
            form:{
                level:'',
                content:'',
            },
            passageData:[],
            loading:false,
            data:[],
            dataNum:0,
            dialogFormVisible:false,
            nodename:''
        }
    },
    mounted(){
        this.fetchData()
    },
    methods:{
        async fetchData(){
            await getIndex().then(res => {
                console.log(res)
                this.data= res.data
            })
            await getIndexNum().then(res => {
                console.log(res)
                this.dataNum= res.data
            })
        },
        async appendRootNode(){
            if(this.nodename==''){
                ElNotification({
                        title: '错误',
                        message: '节点名称为空！',
                        type: 'error'
                    })
                return
            }
            //前端增加
            const newChild = { id: ++this.dataNum, pid:this.dataNum,label: this.nodename, children: [] };
            this.data.push(newChild);
            // 后端增加
            this.loading=true
            await addIndexNode({
                id:newChild.id,
                pid:newChild.pid,
                label:newChild.label
            }).then(res => {
                console.log(res)
            })
            this.loading=false
        },
        async append(data) {
            if(this.nodename==''){
                ElNotification({
                        title: '错误',
                        message: '节点名称为空！',
                        type: 'error'
                    })
                return
            }
            const p=this.$refs.myTree.getNode({id:data.pid})
            const pp=this.$refs.myTree.getNode({id:p.data.pid})
            console.log(data.pid)
            console.log(p.data.pid)
            console.log(pp.data.pid)
            if(p.data.pid==data.pid&&pp.data.pid==p.data.pid){
                console.log(p)
                //前端增加
                const newChild = { id: ++this.dataNum, pid: data.id,label: this.nodename, children: [] };
                if (!data.children) {
                this.$set(data, 'children', []);
                }
                data.children.push(newChild);
                // 后端增加
                this.loading=true
                await addIndexNode({
                    id:newChild.id,
                    pid:newChild.pid,
                    label:newChild.label
                }).then(res => {
                    console.log(res)
                })
                this.loading=false
                console.log(data)
            }
            else{
                ElNotification({
                        title: '错误',
                        message: '层级太多！',
                        type: 'error'
                    })
                return
            }
        },
        async remove(node, data) {
            //前端删除
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
            // console.log(data.id)
            // 后端删除
            this.loading=true
            await deleteIndexNode(data.id).then(res=>{
                console.log(res)
            })
            this.loading=false;
        },
        edit(node,data){
            getPassage(data.id).then(res=>{
                console.log(res)
                this.passageData=res.data
            })
            this.aid=data.id
        },
        async addPassageContent(){
            if(this.form.level==''){
                ElNotification({
                        title: '错误',
                        message: '请选择类型！',
                        type: 'error'
                    })
                return
            }
            if(this.aid==0){
                ElNotification({
                        title: '错误',
                        message: '请先选择章节进行编辑！',
                        type: 'error'
                    })
                return
            }
            if(this.form.level!="img"){
                console.log(this.form.level)
                if(this.form.content==''){
                    ElNotification({
                        title: '错误',
                        message: '文字内容不能为空！',
                        type: 'error'
                    })
                    return
                }
                addPassageText({
                    aid:this.aid,
                    level:this.form.level,
                    content:this.form.content
                }).then(res=>{
                    console.log(res)

                })
            }else{
                this.$refs.myupload.submit()

                    
            }
            await getPassage(this.aid).then(res=>{
                        console.log(res)
                        this.passageData=res.data
                        ElNotification({
                            title: '成功',
                            message: '添加成功！',
                            type: 'sucess'
                        })
                        
                        this.$forceUpdate()
                    })
            console.log(this.passageData)
        },
        async deleteTableRow(){
            // console.log(this.$refs.myTable.selection)
            console.log(this.dataonLineListSelections.aid);
            await deletePassageContent({
                aid:this.dataonLineListSelections.aid,
                orderid:this.dataonLineListSelections.orderid
            }).then(res=>{
                // TODO 删除文章片段 对应的笔记也删除
                deleteNoteByAidOrderid({
                    aid:this.dataonLineListSelections.aid,
                    orderid:this.dataonLineListSelections.orderid
                }).then(res=>{
                    console.log(res)
                })
                console.log(res)
                if(res.code==200){
                    getPassage(this.aid).then(res=>{
                        console.log(res)
                        this.passageData=res.data
                    })
                    this.$forceUpdate()
                    ElNotification({
                        title: '成功',
                        message: '删除成功！',
                        type: 'sucess'
                    })
                }
                
            })

        },
        selectionLineChangeHandle(val){
            this.dataonLineListSelections = val;
        }
        
    },
    
}
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

</style>