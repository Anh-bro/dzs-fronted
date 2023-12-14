<template>
  <el-empty v-if='passageData.length == 0' :description="this.emptydescription" style="width: 100%;"/>
  <el-row>
    <transition name="el-fade-in-linear">
      <el-col v-show="indexshow" :span="12" style="z-index: 1; position: fixed;right: 20px;bottom: 50px;">
        <el-card shadow="always" @click="clickTreeNode" v-loading="loading">
          <div style="justify-content: space-between;">
            <el-input style="display:inline" placeholder="输入节点名称" v-model='nodename'></el-input>
            <el-button @click="appendRootNode()">增加</el-button>
          </div>

          <el-scrollbar max-height="400px">
            <el-tree :data="data" :expand-on-click-node="false" node-key="id" default-expand-all ref="myTree">
              <template #default="{ node, data }">
                                <span class="custom-tree-node">
                                    <span>{{ node.label }}</span>
                                    <span>
                                        <a v-if="data.children.length == 0" class="hoverchange"
                                           @click="edit(node, data)">
                                            <el-icon>
                                                <Position/>
                                            </el-icon>
                                        </a>
                                        <a class="hoverchange" @click="append(data)" style="margin-left: 8px">
                                            <el-icon>
                                                <Plus/>
                                            </el-icon>
                                        </a>
                                        <a class="hoverchange" style="margin-left: 8px" @click="remove(node, data)">
                                            <el-icon>
                                                <Minus/>
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
        <!-- //文章样式 -->
        <div class="adminpassage" v-for="(item) in passageData" @click="xuanzhong(item.orderid)" :id="item.orderid">
          <h2 class="passagepart title1" v-if="item.level == 'title1'">{{ item.content }}</h2>
          <h3 class="passagepart title2" v-if="item.level == 'title2'">{{ item.content }}</h3>
          <div class="passagepart paragraph" v-if="item.level == 'paragraph'">{{
              item.content
            }}
          </div>
          <div class="passagepart img" style="text-align: center;" v-if="item.level == 'img'">
            <img :src="item.content.split('_')[0]" alt="loading.." style="height: 200px;text-align: center;">
            <div>{{ item.content.split('_')[1] }}</div>
          </div>
          <div class="passagepart vid" style="text-align: center;" v-if="item.level == 'vid'">
            <video :src="item.content.split('_')[0]" controls style="height: 200px;text-align: center;"></video>

            <div>{{ item.content.split('_')[1] }}</div>
          </div>

        </div>
      </el-scrollbar>
    </el-col>
    <transition name="el-zoom-in-bottom">
      <el-col style="position: fixed;left: 80px; bottom: 10px;" v-show="addmenushow" :span="24">
        <el-card shadow="always" height="200" v-loading="loading">
          <div style="width: 500px;">
            <el-form :model="form" :inline="false">
              <el-form-item label="添加类型:">
                <el-select v-model="form.level" placeholder="请选择类型">
                  <el-option label="一级标题" value="title1"/>
                  <el-option label="二级标题" value="title2"/>
                  <el-option label="正文" value="paragraph"/>
                  <el-option label="图片" value="img"/>
                  <el-option label="视频" value="vid"/>
                </el-select>
              </el-form-item>
              <el-form-item v-if="this.form.level != 'img' && this.form.level != 'vid'" label="文字内容:">
                <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"/>

              </el-form-item>
              <el-form-item v-if="this.form.level == 'img'" label="图片内容:">
                <el-upload ref="myimgupload" class="upload-demo" action="/api/upload" :limit="1"
                           :on-exceed="handleExceed" :auto-upload="false" name="photo" :on-success="uploadSuccess"
                           :data="{ aid: this.aid, description: this.description ,xuanzhongorderid:this.xuanzhongorderid}">
                  <template #trigger>
                    <el-button type="primary">选择文件</el-button>
                  </template>
                  <!-- <el-button class="ml-3" type="success" @click="submitUpload">
              upload to server
          </el-button> -->
                </el-upload>
                <el-input v-model="this.description" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
                          placeholder="请输入图注"/>

              </el-form-item>
              <el-form-item v-if="this.form.level == 'vid'" label="视频内容:">
                <el-upload ref="myvidupload" class="upload-demo" action="/api/upload" :limit="1"
                           :on-exceed="handleExceed" :auto-upload="false" name="photo" :on-success="uploadSuccess"
                           :data="{ aid: this.aid, description: this.description,xuanzhongorderid:this.xuanzhongorderid }">
                  <template #trigger>
                    <el-button type="primary">选择文件</el-button>
                  </template>
                </el-upload>
                <el-input v-model="this.description" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }"
                          placeholder="请输入标注"/>
              </el-form-item>
              <el-form-item>

                <el-button style="margin-left: 10px;" type="primary"
                           @click="addPassageContent()"
                            >添加
                </el-button>
                <el-button style="margin-left: 30px;" type="primary" @click="addPassageContentUp">在上面添加</el-button>
                <el-button style="margin-left: 30px;" type="primary" @click="refresh()">刷新页面</el-button>
                <!-- <el-button>Cancel</el-button> -->
              </el-form-item>
            </el-form>

          </div>
        </el-card>
      </el-col>
    </transition>
  </el-row>
  <el-button style="position: fixed;right: 20px;bottom:10px" type="primary" @click="indexshow = !indexshow">
    目录
    <el-icon>
      <Expand/>
    </el-icon>
  </el-button>
  <el-button style="position: fixed;right: 350px;bottom:10px" type="primary" @click="addmenushow = !addmenushow">
    添加
    <el-icon>
      <Expand/>
    </el-icon>
  </el-button>
  <el-button style="position: fixed;right: 230px;bottom:10px" type="primary" @click="deleteTableRow()">
    删除选中行
  </el-button>
  <el-button style="position: fixed;right: 110px;bottom:10px" type="primary" @click="this.$refs.page.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })">
    回到顶部
    <el-icon>
      <Top/>
    </el-icon>
  </el-button>
</template>
<script>
import {getTransitionRawChildren} from "vue"
import {
  addPassageTextUp,
  deleteAllNoteByAid,
  deleteNoteByAidOrderid,
  getIndex,
  getIndexNum,
  addIndexNode,
  deleteIndexNode,
  getPassage,
  addPassageText,
  deletePassageContent
} from "../api/api.js"

export default {
  data() {
    return {
      emptydescription: '请选择文章进行编辑',
      description: '',
      xuanzhongorderid: 0,
      indexshow: true,
      addmenushow: false,
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
      const newChild = {id: ++this.dataNum, pid: this.dataNum, label: this.nodename, children: []};
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
      const p = this.$refs.myTree.getNode({id: data.pid})
      const pp = this.$refs.myTree.getNode({id: p.data.pid})
      console.log(data.pid)
      console.log(p.data.pid)
      console.log(pp.data.pid)
      if (p.data.pid == data.pid && pp.data.pid == p.data.pid) {
        console.log(p)
        //前端增加
        const newChild = {id: ++this.dataNum, pid: data.id, label: this.nodename, children: []};
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
      } else {
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
        console.log("deleteIndexNode", res)
      })
      await deleteAllNoteByAid(data.id).then(res => {
        console.log("deleteAllNoteByAid", res)
      })
      this.loading = false;
    },
    edit(node, data) {
      this.emptydescription = '暂无数据'
      getPassage(data.id).then(res => {
        console.log("getPassage", res)
        this.passageData = res.data
      })
      this.aid = data.id
    },
    refresh() {
      getPassage(this.aid).then(res => {
        console.log(res)
        this.passageData = res.data
      })
    },
    addPassageContentUp() {
      console.log("asd")
      if (this.xuanzhongorderid == 0) {
        ElNotification({
          title: '错误',
          message: '请选中某一段！',
          type: 'error'
        })
      }
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

      if (this.form.level != "img" && this.form.level != "vid") {
        console.log(this.form.level)
        if (this.form.content == '') {
          ElNotification({
            title: '错误',
            message: '文字内容不能为空！',
            type: 'error'
          })
          return
        }
        addPassageTextUp({
          aid: this.aid,
          level: this.form.level,
          content: this.form.content,
          orderid:this.xuanzhongorderid
        }).then(res => {
          console.log(res)
        })
      } else if (this.form.level == "img") {
        this.$refs.myimgupload.submit()
      } else if (this.form.level == "vid") {
        this.$refs.myvidupload.submit()
      }

    },
    uploadSuccess(){
      console.log("asd")
      ElNotification({
            title: '成功',
            message: '添加成功！',
            type: 'sucess'
          })
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
      if (this.form.level != "img" && this.form.level != "vid") {
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
        ElNotification({
          title: '成功',
          message: '添加成功！',
          type: 'sucess'
        })
      } else if (this.form.level == "img") {
        this.$refs.myimgupload.submit()
      } else if (this.form.level == "vid") {
        this.$refs.myvidupload.submit()
      }

      await getPassage(this.aid).then(res => {
        console.log(res)
        this.passageData = res.data
        // ElNotification({
        //   title: '成功',
        //   message: '添加成功！',
        //   type: 'sucess'
        // })
        setTimeout(() => {
          this.$forceUpdate()
        }, 3000)
        console.log(this.passageData)
      })
    },
    async deleteTableRow() {
      if (this.xuanzhongorderid != -1 && this.aid != 0) {
        await deletePassageContent({
          aid: this.aid,
          orderid: this.xuanzhongorderid
        }).then(res => {
          console.log("deletePassageContent", res)
          if (res.code == 200) {
            document.getElementById(this.xuanzhongorderid).style.display = "none";
            // getPassage(this.aid).then(res => {
            //     console.log(res)
            //     this.passageData = res.data
            // })
            ElNotification({
              title: '成功',
              message: '删除成功！',
              type: 'sucess'
            })
          }
        })

      }
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
      if (document.getElementById(orderid).style.backgroundColor != "rgb(29, 161, 253)") {
        document.getElementById(orderid).style.backgroundColor = "#1da1fd"
      } else {
        document.getElementById(orderid).style.backgroundColor = "transparent"
      }

      console.log("点击的orderid", orderid)
      console.log("选中的orderid", this.xuanzhongorderid)
      if (this.xuanzhongorderid == 0) {
        this.xuanzhongorderid = orderid
      } else {
        if (this.xuanzhongorderid == orderid) {
          this.xuanzhongorderid = 0
          return
        }
      }
      console.log(document.getElementById(orderid).style.backgroundColor)
      if (orderid != this.xuanzhongorderid) {
        document.getElementById(this.xuanzhongorderid).style.backgroundColor = "transparent"
        this.xuanzhongorderid = orderid
      }
    }

  },

}
</script>
<style>
.adminpassage .passagepart:hover {
  background-color: #b4e0ff;
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
  font-size: 28px;
  margin-bottom: 5px;
}

.title2 {
  text-decoration: solid;
  font-size: 20px;
  margin-bottom: 5px;
}

.paragraph {
  Text-indent: 2em;
  font-size: 18px;
  margin-bottom: 10px;


}

.img {
  margin: 0 auto;
  text-align: center;

  img {
    height: 200px;
  }
}

.img div {
  font-size: 14px;
}
</style>