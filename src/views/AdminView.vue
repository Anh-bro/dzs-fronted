<template>
    <el-row>
        <transition name="el-fade-in-linear">
            <el-col v-show="indexshow" :span="8" style="z-index: 1; position: fixed;right: 20px;bottom: 50px;">
                <el-card shadow="always" @click="clickTreeNode" v-loading="loading">
                    <div style="justify-content: space-between;">
                        <el-input style="display:inline" placeholder="输入节点名称" v-model='nodename'></el-input>
                        <el-button @click="appendRootNode()">增加</el-button>
                    </div>

                    <el-scrollbar max-height="700px">
                        <el-tree :data="data" :expand-on-click-node="false" node-key="id" default-expand-all ref="myTree">
                            <template #default="{ node, data }">
                                <span class="custom-tree-node">
                                    <span>{{ node.label }}</span>

                                    <span>
                                        <a class="hoverchange" @click="append(data)">
                                            <el-icon>
                                                <Plus />
                                            </el-icon>
                                        </a>
                                        <a class="hoverchange" style="margin-left: 8px" @click="remove(node, data)">
                                            <el-icon>
                                                <Minus />
                                            </el-icon>
                                        </a>
                                        <a class="hoverchange" style="margin-left: 8px" @click="edit(node, data)">
                                            <el-icon>
                                                <Position />
                                            </el-icon>
                                        </a>
                                    </span>
                                </span>
                            </template>
                        </el-tree>
                    </el-scrollbar>

                </el-card>
            </el-col>
        </transition>

        <el-col :span="24" margin-left="5px">
            <el-scrollbar ref="page" max-height="660px" style="scroll-bahavior: smooth;">
                <!-- //TODO文章样式 -->
                <div v-for="(item) in passageData" @click="xuanzhong(item.orderid)" :id="item.orderid">
                    <h2 class="passagepart title1" v-if="item.level == 'title1'">{{ item.content }}</h2>
                    <h3 class="passagepart title1" v-if="item.level == 'title2'">{{ item.content }}</h3>
                    <div class="passagepart paragraph" v-if="item.level == 'paragraph'">{{ item.content
                    }}</div>
                    <div class="passagepart img" v-if="item.level == 'img'">
                        <img :src="item.content" alt="loading.." style="height: 200px;text-align: center;">
                    </div>

                </div>
            </el-scrollbar>
        </el-col>
        <transition name="el-zoom-in-bottom">
            <el-col style="position: fixed;bottom: 10px;" v-show="addmenushow" :span="24">
                <el-card shadow="always" height="200" v-loading="loading">
                    <div style="height: 200px;width: 500px;">
                        <el-form :model="form" :inline="false">
                            <el-form-item label="添加类型:">
                                <el-select v-model="form.level" placeholder="请选择类型">
                                    <el-option label="一级标题" value="title1" />
                                    <el-option label="二级标题" value="title2" />
                                    <el-option label="正文" value="paragraph" />
                                    <el-option label="图片" value="img" />
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="!isImg" label="文字内容:">
                                <el-input v-model="form.content" type="textarea" />

                            </el-form-item>
                            <el-form-item v-else label="图片内容:">
                                <el-upload ref="myupload" class="upload-demo" action="/api/upload" :limit="1"
                                    :on-exceed="handleExceed" :auto-upload="false" name="photo" :data="{ aid: this.aid }">
                                    <template #trigger>
                                        <el-button type="danger">选择文件</el-button>
                                    </template>
                                    <!-- <el-button class="ml-3" type="success" @click="submitUpload">
                                upload to server
                            </el-button> -->
                                </el-upload>


                            </el-form-item>
                            <el-form-item>

                                <el-button style="margin-left: 20px;" type="danger"
                                    @click="addPassageContent()">添加</el-button>
                                <!-- <el-button>Cancel</el-button> -->
                            </el-form-item>
                        </el-form>

                    </div>
                </el-card>
            </el-col>
        </transition>
    </el-row>
    <el-button style="position: fixed;right: 20px;bottom:10px" type="danger" @click="indexshow = !indexshow">
        目录
        <el-icon>
            <Expand />
        </el-icon>
    </el-button>
    <el-button style="position: fixed;right: 350px;bottom:10px" type="danger" @click="addmenushow = !addmenushow">
        添加
        <el-icon>
            <Expand />
        </el-icon>
    </el-button>
    <el-button style="position: fixed;right: 230px;bottom:10px" type="danger" @click="deleteTableRow()">
        删除选中行
    </el-button>
    <el-button style="position: fixed;right: 110px;bottom:10px" type="danger" @click="this.$refs.page.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })">
        回到顶部
        <el-icon>
            <Top />
        </el-icon>
    </el-button>
</template>
<script>
import { getTransitionRawChildren } from "vue"
import { deleteNoteByAidOrderid, getIndex, getIndexNum, addIndexNode, deleteIndexNode, getPassage, addPassageText, deletePassageContent } from "../api/api.js"
export default {
    data() {
        return {
            xuanzhongorderid: 0,
            indexshow: false,
            addmenushow: true,
            dataonLineListSelections: {},
            aid: 0,
            form: {
                level: '',
                content: '',
            },
            passageData: [],
            loading: false,
            data: [],
            dataNum: 0,
            dialogFormVisible: false,
            nodename: ''
        }
    },
    mounted() {
        this.fetchData()
    },
    computed: {
        isImg() {
            if (this.form.level != 'img') {
                return false;
            }
            return true;
        }
    },
    methods: {
        async fetchData() {
            await getIndex().then(res => {
                console.log(res)
                this.data = res.data
            })
            await getIndexNum().then(res => {
                console.log(res)
                this.dataNum = res.data
            })
        },
        async appendRootNode() {
            if (this.nodename == '') {
                ElNotification({
                    title: '错误',
                    message: '节点名称为空！',
                    type: 'error'
                })
                return
            }
            //前端增加
            const newChild = { id: ++this.dataNum, pid: this.dataNum, label: this.nodename, children: [] };
            this.data.push(newChild);
            // 后端增加
            this.loading = true
            await addIndexNode({
                id: newChild.id,
                pid: newChild.pid,
                label: newChild.label
            }).then(res => {
                console.log(res)
            })
            this.loading = false
        },
        async append(data) {
            if (this.nodename == '') {
                ElNotification({
                    title: '错误',
                    message: '节点名称为空！',
                    type: 'error'
                })
                return
            }
            const p = this.$refs.myTree.getNode({ id: data.pid })
            const pp = this.$refs.myTree.getNode({ id: p.data.pid })
            console.log(data.pid)
            console.log(p.data.pid)
            console.log(pp.data.pid)
            if (p.data.pid == data.pid && pp.data.pid == p.data.pid) {
                console.log(p)
                //前端增加
                const newChild = { id: ++this.dataNum, pid: data.id, label: this.nodename, children: [] };
                if (!data.children) {
                    this.$set(data, 'children', []);
                }
                data.children.push(newChild);
                // 后端增加
                this.loading = true
                await addIndexNode({
                    id: newChild.id,
                    pid: newChild.pid,
                    label: newChild.label
                }).then(res => {
                    console.log(res)
                })
                this.loading = false
                console.log(data)
            }
            else {
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
            this.loading = true
            await deleteIndexNode(data.id).then(res => {
                console.log(res)
            })
            this.loading = false;
        },
        edit(node, data) {
            getPassage(data.id).then(res => {
                console.log(res)
                this.passageData = res.data
            })
            this.aid = data.id
        },
        async addPassageContent() {
            if (this.form.level == '') {
                ElNotification({
                    title: '错误',
                    message: '请选择类型！',
                    type: 'error'
                })
                return
            }
            if (this.aid == 0) {
                ElNotification({
                    title: '错误',
                    message: '请先选择章节进行编辑！',
                    type: 'error'
                })
                return
            }
            if (this.form.level != "img") {
                console.log(this.form.level)
                if (this.form.content == '') {
                    ElNotification({
                        title: '错误',
                        message: '文字内容不能为空！',
                        type: 'error'
                    })
                    return
                }
                addPassageText({
                    aid: this.aid,
                    level: this.form.level,
                    content: this.form.content
                }).then(res => {
                    console.log(res)

                })
            } else {
                this.$refs.myupload.submit()


            }
            await getPassage(this.aid).then(res => {
                console.log(res)
                this.passageData = res.data
                ElNotification({
                    title: '成功',
                    message: '添加成功！',
                    type: 'sucess'
                })

                this.$forceUpdate()
            })
            console.log(this.passageData)
            this.$forceUpdate()
        },
        async deleteTableRow() {
            if (this.xuanzhongorderid != -1 && this.aid != 0) {
                this.xuanzhong(this.xuanzhongorderid)
                await deletePassageContent({
                    aid: this.aid,
                    orderid: this.xuanzhongorderid
                }).then(res => {
                    deleteNoteByAidOrderid({
                        aid: this.aid,
                        orderid: this.xuanzhongorderid
                    }).then(res => {
                        console.log("deletenotebyorderid", res)
                    })
                    console.log(res)
                    if (res.code == 200) {
                        getPassage(this.aid).then(res => {
                            console.log(res)
                            this.passageData = res.data
                        })
                        this.$forceUpdate()
                        ElNotification({
                            title: '成功',
                            message: '删除成功！',
                            type: 'sucess'
                        })
                    }
                })
            }
            // console.log(this.$refs.myTable.selection)
            console.log(this.dataonLineListSelections.aid);
            await deletePassageContent({
                aid: this.dataonLineListSelections.aid,
                orderid: this.dataonLineListSelections.orderid
            }).then(res => {
                //  删除文章片段 对应的笔记也删除
                deleteNoteByAidOrderid({
                    aid: this.dataonLineListSelections.aid,
                    orderid: this.dataonLineListSelections.orderid
                }).then(res => {
                    console.log(res)
                })
                console.log(res)
                if (res.code == 200) {
                    getPassage(this.aid).then(res => {
                        console.log(res)
                        this.passageData = res.data
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
        selectionLineChangeHandle(val) {
            this.dataonLineListSelections = val;
        },
        goAnchor(id) {
            var anchor = document.getElementById(id);
            console.log(anchor)

            this.$refs.page.scrollTo({
                top: anchor.offsetTop,
                left: 0,
                behavior: 'smooth'
            })

        },
        xuanzhong(orderid) {
            if (this.xuanzhongorderid == 0) {
                this.xuanzhongorderid = orderid
            }
            console.log(document.getElementById(orderid).style.backgroundColor)
            // document.getElementById(orderid).style.backgroundColor = "#ff5f5f"
            if (document.getElementById(orderid).style.backgroundColor != "rgb(255, 193, 189)") {
                document.getElementById(orderid).style.backgroundColor = "#FFC1BD"
            } else {
                document.getElementById(orderid).style.backgroundColor = "transparent"
            }
            if (orderid != this.xuanzhongorderid) {
                document.getElementById(this.xuanzhongorderid).style.backgroundColor = "transparent"
            }
            this.xuanzhongorderid = orderid
        }

    },

}
</script>
<style>
.passagepart:hover {
    background-color: #FFC1BD;
    cursor: default
}

.hoverchange:hover {
    background-color: red;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.title1 {
    text-decoration: solid;
    font-size: 25px;
    margin-bottom: 5px;
}

.title2 {
    text-decoration: solid;
    font-size: 20px;
    margin-bottom: 5px;
}

.paragraph {
    Text-indent: 2em;
    font-size: medium;
    margin-bottom: 10px;


}

.img {
    margin: 0 auto;

    img {
        height: 200px;
    }
}
</style>