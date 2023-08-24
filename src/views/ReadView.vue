<style lang="less">
.el-scrollbar {
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

  .pa:hover .addNoteBtn {
    font-size: 10px;
    display: inline;
    float: right;
    height: 16px;
    // cursor: pointer;

  }



}
</style>

<template>
  <el-row gutter="20" v-loading="loading">
    <transition name="el-zoom-in-bottom">
      <el-col v-show="show" :span="6" style="z-index: 1; position: fixed; overflow-x: hidden; right: 10px;bottom: 50px;">
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
                    <a @click="jump(node, data)"> 跳转 </a>
                  </span>
                </span>
              </template>

            </el-tree>
          </el-scrollbar>

        </el-card>

      </el-col>
    </transition>

    <el-col class="passagepart" style="overflow-x: hidden;" :span="24" ref="asd">

      <el-scrollbar max-height="660px" ref="page" style="scroll-bahavior: smooth;">

        <div v-for="(item, itemIndex) in textData" :class="item.level" class="pa" @mouseup="handleMouseUp">
          <a @click="markText($event)" class="sentence"
            v-for="(sentence, index ) in item.content.split(/(?=，)|(?<=，)|(?=；)|(?<=；)|(?=。)|(?<=。)/)"
            v-if="item.level != 'img'" :id="itemIndex + '-' + index">

            {{ sentence }}

          </a>
          <img v-else :src="item.content" alt="暂无">
          <button size="mini" class="addNoteBtn" @click="handleNote(itemIndex)">笔记</button>


          <div class="note">

            <div :id="itemIndex" style="display:block">
              {{ noteData.filter((t) => t.orderid == itemIndex)[0]?.content }}
            </div>

          </div>

        </div>

        <el-dialog v-model="dialogFormVisible" title="Shipping address">

          <el-form>
            <el-form-item label="Activity form">
              <el-input v-model="this.tempnote.content" type="textarea" />
            </el-form-item>
          </el-form>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
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
</template>
<script>
import { getIndex, getPassage, getNote, updateNote, getNoteByAid } from '../api/api';
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
    }
    if (this.$route.query.orderid != undefined) {
      this.orderid = this.$route.query.orderid
      this.goAnchor(this.orderid)
    }
    console.log(this.expandkey)
    this.fetchData(this.aid)
  },
  methods: {
    async fetchPassageNote(aid) {
      await getPassage(aid).then(res => {
        console.log(res)
        this.textData = res.data
      })
      await getNote(aid).then(res => {
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
      await getNote(this.aid).then(res => {
        this.noteData = res.data
      })
    },
    async addNote() {          // 点击确定按钮
      this.tempnote.aid = this.aid
      await updateNote(this.tempnote).then(res => {   //调用后端接口
        console.log(res)
      })
      this.fetchNote()          //更新页面的笔记数据

      this.dialogFormVisible = false
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
      var anchor = document.getElementById(id);
      console.log(anchor)

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
    add() {
      this.goAnchor(9)
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    async jump(node, data) {
      console.log("id", node.data.id)
      this.aid = node.data.id
      // this.goAnchor(data.tagId)
      this.loading = true
      await getPassage(node.data.id).then(res => {
        console.log("getPassage", res)

        this.textData = res.data
        // this.textData.splice(res.length)
        // for(var i = 0; i < res.length; i++) {
        //   Vue.set(this.data,i,res[i])
        // }
        // this.textData.splice(0,1,res[0])
        console.log(this.textData)

      })
      await getNoteByAid(node.data.id).then(res => {
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

    return {
      show: true,
      pid: 1,
      aid: 0,
      dialogFormVisible: false,
      expandkey: [],
      loading: true,
      filterText: '',
      count: 23,
      noteindex: 2,
      tempnote: {
        noteid: 0,
        content: ""
      },
      noteData: [],
      markData: ['3-2'
      ],
      textData: [],
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
