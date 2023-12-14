<style lang="less">
.hoverchange:hover {
  background-color: red;
}

.el-scrollbar {
  .noteText {
    color: red;
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

    .sentence {
      cursor: pointer;
    }

  }

  .img {
    text-align: center;

    img {
      height: 200px;
    }
  }

  .note {
    color: red;
    font-size: 12px;
    Text-indent: 0;
  }

  .addNoteBtn {
    display: none;
  }

  .ppart:hover .addNoteBtn {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 0px;
    height: 16px;
  }
  .markNoteBtn {
    display: none;
  }

  .ppart:hover .markNoteBtn {
    display: block;
    position: absolute;
    bottom: 0px;
    right: 30px;
    height: 16px;
  }



}
</style>

<template>
  <div style="width: 100%" v-loading="loading">
  <el-empty style="width: 100%;" v-if="passageData.length == 0" description="请从目录中选择文章阅读" />
  <el-row gutter="20" >
    <transition name="el-zoom-in-bottom">
      <el-col v-show="show" :span="12" style="z-index: 1; position: fixed; overflow-x: hidden; right: 10px;bottom: 50px;">
        <el-card shadow="always" @click="clickTreeNode" v-loading="loading">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-scrollbar>
            <el-tree style="max-height: 350px;" class="filter-tree" :data="data" :props="defaultProps"
              :filter-node-method="filterNode" node-key="id" :default-expanded-keys="expandkey" ref="tree">
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <span>{{ node.label }}</span>
                  <span v-if="data.children.length == 0">
                    <a class="hoverchange" @click="jump(node, data)">
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

    <el-col style="overflow-x: hidden;" :span="24" ref="asd">

      <el-scrollbar max-height="660px" ref="page" style="scroll-bahavior: smooth;">
        <div style="cursor: default; position: relative;margin-bottom: 14px;" v-for="(item) in passageData"
          :id="item.orderid" class="ppart">
          <h2 style="margin-bottom: 0px;" class="passagepart title1" v-if="item.level == 'title1'">{{ item.content }}</h2>
          <h3 style="margin-bottom: 0px;" class="passagepart title2" v-if="item.level == 'title2'">{{ item.content }}</h3>
          <div style="margin-bottom: 0px;" class="passagepart paragraph" v-if="item.level == 'paragraph'">{{ item.content
          }}</div>
          <div style="margin-bottom: 0px;text-align: center;" class="passagepart img" v-if="item.level == 'img'">
            <img :src="item.content.split('_')[0]" alt="loading.." style="height: 200px;text-align: center;">
            <div>{{ item.content.split('_')[1] }}</div>
          </div>
          <div style="margin-bottom: 0px;text-align: center;" class="passagepart vid" v-if="item.level == 'vid'">
            <video :src="item.content.split('_')[0]" controls style="height: 200px;text-align: center;"></video>

            <div>{{ item.content.split('_')[1] }}</div>
          </div>

          <button size="mini" class="addNoteBtn" @click="handleNote(item.orderid)">笔记</button>
          <div class="noteText" :id="item.orderid" style="display:block">
            {{ noteData.filter((t) => t.orderid == item.orderid)[0]?.content }}
          </div>

        </div>

        <el-dialog v-model="dialogFormVisible" title="请输入笔记内容">

          <el-form>
            <el-form-item label="笔记：">
              <el-input v-model="this.tempnote.content" type="textarea" />
            </el-form-item>
          </el-form>

          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="addNote()">
                确定
              </el-button>
            </span>
          </template>

        </el-dialog>

        <!-- //内容 -->

      </el-scrollbar>

    </el-col>
  </el-row>

  <el-button style="position: fixed;right: 20px;bottom:10px" type="primary" @click="show = !show">
    目录
    <el-icon>
      <Expand />
    </el-icon>
  </el-button>
    <el-button style="position: fixed;right: 110px;bottom:10px" type="primary" @click="this.$refs.page.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })">
      回到顶部
      <el-icon>
        <Top />
      </el-icon>
    </el-button>
    <el-button style="position: fixed;right: 230px;bottom:10px" type="primary" @click="handleMark">
      {{ this.ismark?"已添加书签":"添加书签" }}
      <el-icon>
        <Management/>
      </el-icon>
    </el-button>
</div>
</template>
<script>
import {
  deleteMark,
  isMark,
  addMark,
  getIndex,
  getPassage,
  getNote,
  updateNote,
  getNoteByAid,
  setLastAid
} from '../api/api';
import {useStore} from "@/stores/globalStores";
import {ElNotification} from "element-plus";
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    // console.log(this.$route.query)
    if (this.$route.query.aid != undefined) {
      this.aid = this.$route.query.aid
      this.expandkey.push(Number(this.$route.query.aid))
      this.fetchPassageNote(this.$route.query.aid)
      isMark({
        'aid':this.aid,
        'username':this.store.username
      }).then(res=>{
        console.log("ismark",res)
        this.ismark=res;
      })
    }
    if (this.$route.query.orderid != undefined) {
      this.orderid = this.$route.query.orderid
      setTimeout(() => {
        console.log("id2", document.getElementById(this.orderid))
        this.$refs.page.scrollTo({
          top: document.getElementById(this.orderid).offsetTop,
          left: 0,
          behavior: 'smooth'
        })
      }, 2000)
      // this.goAnchor(this.orderid)
    }
    console.log(this.expandkey)
    this.fetchData(this.aid)
  },
  methods: {
    async fetchPassageNote(aid) {
      await getPassage(aid).then(res => {
        console.log(res)
        this.passageData = res.data
      })
      await getNote(aid,this.store.username).then(res => {
        console.log(res)
        this.noteData = res.data
      })
    },
    async fetchData() {
      console.log(this.aid)
      await getIndex().then(res => {
        console.log("index")
        console.log(res)
        this.data = res.data
      })

      this.loading = false
      console.log(this.expandkey)

    },
    async fetchNote() {        //获取笔记数据
      await getNoteByAid(this.aid,this.store.username).then(res => {
        console.log("getNoteByAid", res)
        this.noteData = res.data
      })
    },
    async addNote() {          // 点击确定按钮
      this.tempnote.aid = this.aid
      console.log(this.aid)
      await updateNote(this.tempnote).then(res => {   //调用后端接口
        console.log("updateNote", res)
      })
      this.fetchNote()          //更新页面的笔记数据

      this.dialogFormVisible = false
    },
    handleMark(e){
      if(!this.ismark){
        addMark({
          'aid':this.aid,
          'username' : this.store.username
        }).then(res=>{
          console.log(res)
          this.ismark=true
          ElNotification({
            title: '成功',
            message: '添加书签成功',
            type: 'success'
          })
        })
      }else{
        deleteMark({
          'aid':this.aid,
          'username' : this.store.username
        }).then(res=>{
          console.log(res)
          this.ismark=false
          ElNotification({
            title: '成功',
            message: '删除书签成功',
            type: 'success'
          })
        })
      }

    },
    handleNote(e) {
      console.log(e)
      this.orderid = e
      this.tempnote.orderid = e

      let note = this.noteData.filter((t) => t.orderid == e)
      this.tempnote.content = note[0]?.content

      // console.log(this.tempnote)
      this.dialogFormVisible = true
    },
    markText(e) {

      let p = e.target.id.split('-')[0]
      let i = e.target.id.split('-')[1]
      if (!e.target.style['background-color']) {
        e.target.style['background-color'] = 'yellow'
        addMark(e.target.id)
      }
      else {
        e.target.style['background-color'] = ''
        reduceMark(e.target.id)
      }
    },
    randerNote() {
      let i = 0
      for (i = 0; i < this.noteData.length; i++) {
        document.getElementById(this.noteData[i].orderid).innerText += this.noteData[i].content
      }
    },
    randerMark() {
      console.log('randmark ')
      let i = 0
      for (i = 0; i < this.markData.length; i++) {
        document.getElementById(this.markData[i]).style.cssText = `background-color:yellow`
      }
    },

    goAnchor(id) {
      console.log(id)
      var anchor = document.getElementById(id);


      this.$refs.page.scrollTo({
        top: anchor.offsetTop,
        left: 0,
        behavior: 'smooth'
      })

    },
    onDelete() {
      if (this.count > 0) {
        this.count--
      }
    },
    // add() {
    //   this.goAnchor(9)
    // },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async jump(node, data) {
      console.log("id", node.data.id)
      this.aid = node.data.id
      isMark({
        'aid':this.aid,
        'username':this.store.username
      }).then(res=>{
        console.log("ismark",res)
        this.ismark=res;
      })
      //TODO
      setLastAid({
        "aid":this.aid,
        "username":this.store.username
      }).then(res=>{
        console.log("setLastAid",res)

      })
      // this.goAnchor(data.tagId)
      this.loading = true
      await getPassage(node.data.id).then(res => {
        console.log("getPassage", res)
        this.passageData = res.data
      })
      await getNoteByAid(node.data.id,this.store.username).then(res => {
        console.log("getNote", res)
        this.noteData = res.data
      })
      this.$forceUpdate()
      this.loading = false

    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
  },



  data() {
    const store=useStore()
    return {
      store: store,
      passageData: [],
      show: true,
      pid: 1,
      aid: 0,
      ismark:false,
      dialogFormVisible: false,
      expandkey: [],
      loading: true,
      filterText: '',
      count: 23,
      noteindex: 2,
      tempnote: {
        noteid: 0,
        content: "",
        username:store.username
      },
      noteData: [],
      markData: ['3-2'],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  }
};
</script>
<style>
.el-col {
  flex-grow: 1;
}

.page {
  height: 500px;
}

.scrollbar-demo-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
