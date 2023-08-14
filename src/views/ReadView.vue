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
    <el-col :span="6" style="overflow-x: hidden;">
      <el-card shadow="hover" @click="clickTreeNode" v-loading="loading">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-scrollbar max-height="600px">
          <el-tree style="max-height: 350px;" class="filter-tree" :data="data" :props="defaultProps" 
            :filter-node-method="filterNode" ref="tree">

            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="data.children.length==0">
                  <a @click="jump(data)"> 跳转 </a>
                </span>
              </span>
            </template>

          </el-tree>
        </el-scrollbar>

      </el-card>
      <el-card shadow="hover" style="margin-top: 20px;">
        <div class="dohistry" style="height:140px">

          <el-button @click="open">Add Item</el-button>
          <el-button @click="onDelete">Delete Item</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col style="overflow-x: hidden;" :span="18" ref="asd">
      <el-scrollbar max-height="600px" ref="page" style="scroll-bahavior: smooth;">

        <div v-for="(item, itemIndex) in textData" :class="item.level" class="pa" @mouseup="handleMouseUp" >
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
</template>
<script>
import { getIndex,getPassage,getNote,updateNote } from '../api/api';
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData(){
      await getIndex().then(res => {
        console.log(res)
        this.data= res.data
      })
      await getPassage(this.aid).then(res=>{
        console.log(res)
        this.textData=res.data
      })
      await getNote(this.aid).then(res=>{
        console.log(res)
        this.noteData=res.data
      })
      this.loading=false
    },
    async fetchNote(){        //获取笔记数据
      await getNote(this.aid).then(res=>{
        this.noteData=res.data
      })
    },
    async addNote(){          // 点击确定按钮
      this.tempnote.aid=this.aid
      await updateNote(this.tempnote).then(res=>{   //调用后端接口
        console.log(res)
      })
      this.fetchNote()          //更新页面的笔记数据

      this.dialogFormVisible=false
    },
    handleNote(e) {
      console.log(e)
      this.orderid=e
      this.tempnote.orderid=e
      
      let note = this.noteData.filter((t) => t.orderid == e)
      this.tempnote.content=note[0]?.content

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
    async jump(data) {
      console.log(data.pid)
      // this.goAnchor(data.tagId)
      await getPassage(data.pid).then(res=>{
        console.log(res)

        this.textData=res.data
        // this.textData.splice(res.length)
        // for(var i = 0; i < res.length; i++) {
        //   Vue.set(this.data,i,res[i])
        // }
        // this.textData.splice(0,1,res[0])
        console.log(this.textData)
        
      })
      await getNote(data.pid).then(res=>{
        console.log(res)
        this.noteData=res.data
      })
      this.$forceUpdate()
      

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
      pid:1,
      aid:3,
      dialogFormVisible: false,
      loading: true,
      filterText: '',
      count: 23,
      noteindex: 2,
      tempnote:{
        noteid:0,
        content:""
      },
      noteData: [
        {
          orderid: 2,
          content: "这是一段笔记"
        }
      ],
      markData: ['3-2'
      ],
      textData: [
        {
          level: "title1",
          content: "理论综述"
        },
        {
          level: "paragraph",
          content: "中国特色社会主义是中国共产党对现阶段纲领的概括，其科学涵义是要求把马克思主义的普遍真理同本国的具体实际结合起来，走适合中国特点的道路，逐步实现工业、农业、国防和科学技术现代化，把中国建设成为一个富强、民主、文明、和谐、美丽的社会主义现代化强国 [3]  ，即一方面要坚持马克思主义的基本原理，走社会主义道路；另一方面必须从中国的实际出发，不照抄、照搬别国经验、模式，而是走具有中国特色的路。"
        },
        {
          level: "paragraph",
          content: "中国特色社会主义是中国共产党对现阶段纲领的概括，其科学涵义是要求把马克思主义的普遍真理同本国的具体实际结合起来，走适合中国特点的道路，逐步实现工业、农业、国防和科学技术现代化，把中国建设成为一个富强、民主、文明、和谐、美丽的社会主义现代化强国 [3]  ，即一方面要坚持马克思主义的基本原理，走社会主义道路；另一方面必须从中国的实际出发，不照抄、照搬别国经验、模式，而是走具有中国特色的路。"
        },
        {
          level: "paragraph",
          content: "中国共产党依据毛泽东倡导的马克思主义普遍真理同中国具体实际相结合的原则，总结长期探索所积累的经验，特别是十一届三中全会以来的实践，深刻地认识到建设中国社会主义的规律，在十二大提出“走自己的路，建设有中国特色的社会主义”的科学论断。党的十三大、十四大和十五大对这一论断形成一系列科学观点，制定一系列具体政策、措施。主要内容有：解放思想，实事求是，以实践作为检验真理的唯一标准；中国所要解决的主要矛盾是人民日益增长的美好生活需要和不平衡不充分的发展之间的矛盾， [1]  党和国家的工作重点必需转移到以经济建设为中心的社会主义现代化轨道上来；建设社会主义有一个很长的初级阶段，社会主义社会的根本任务是发展生产力，集中力量实现现代化；实行社会主义市场经济；改革是社会主义社会发展的重要动力，对外开放是实现社会主义现代化的必要条件；使社会主义民主制度化、法律化，依法治国，改革和完善国家的政治体制和领导体制；加强社会主义精神文明的建设，坚持四项基本原则与坚持改革开放两个基本点要互相结合，缺一不可；坚持和完善人民代表大会制度和共产党领导的多党合作和政治协商制度；改善和发展社会主义民族关系，加强民族团结：用一国两制来解决国家统一问题；执政党的党风问题关系到党的生死存亡；反对帝国主义、霸权主义、殖民主义、种族主义，维护世界和平。"
        },
        {
          level: 'img',
          content: 'https://pic.imgdb.cn/item/63ff5839f144a010072f258f.jpg'
        },
        {
          level: "title1",
          content: "内涵价值"

        },
        {
          level: "title2",
          content: "内涵"
        },
        {
          level: "paragraph",
          content: "马克思列宁主义、毛泽东思想、邓小平理论、三个代表重要思想、科学发展观、共产党行动指南、共青团核心价值、实体经济基础指导和无产阶级专政的人民民主的社会主义国家。科学发展、文化经济、持续发展是中华人民共和国的社会主义和谐社会构成的核心体系。"
        },
        {
          level: "paragraph",
          content: "中国特色社会主义的内涵，随着中国改革开放实践的发展而不断丰富和完善。党的十八大报告对统一于中国特色社会主义实践道路、理论和制度关系，作深刻阐述。这是党和人民九十多年奋斗、创造、积累的成就。学习贯彻十八大精神，是要坚持和发展中国特色社会主义，深入理解把握其科学内涵、掌握其发展规律。"
        },
        {
          level: "paragraph",
          content: "从中国特色社会主义这一科学命题的提出，到中国特色社会主义道路的确立和发展, 党在改革开放和社会主义现代化建设过程中, 对中国特色社会主义道路内涵的认识逐步深化。在纪念毛泽东同志诞辰110周年座谈会上，胡锦涛同志对道路内涵作表述。党的十八大报告，进一步阐述中国特色社会主义道路的科学涵义。"
        },
        {
          level: "paragraph",
          content: "中国特色社会主义道路，是形成和发展中国特色社会主义理论体系、坚持和完善中国特色社会主义制度的重要途径。新中国成立初期，中国共产党领导中国人民取得新民主主义革命的胜利，建立了社会主义制度，并初步实践建设社会主义，为中国特色社会主义道路的形成奠定了坚实基础。党的十一届三中全会以来，中国共产党带领中国人民在总结前期探索的经验和教训的基础上，开辟了中国特色社会主义道路，形成了中国特色社会主义理论体系。正因为依托中国特色社会主义道路，所以形成和发展了中国特色社会主义理论体系。而确立中国特色社会主义制度，则从根本上改变了中国的历史命运。由于坚定不移地走中国特色社会主义道路，又在不断地促进社会主义制度的完善。由于紧紧依托中国特色社会主义道路，则更好地坚持和完善了社会主义制度。"
        },
        {
          level: "paragraph",
          content: "中国特色社会主义理论体系，消除中国在发展社会主义时遇到的困惑，明确中国特色社会主义道路的本质要求和价值目标，是党开辟和坚持中国特色社会主义道路的行动指南。中国特色社会主义理论体系中的邓小平理论，在社会主义本质论、社会主义初级阶段论、社会主义改革开放论和社会主义市场经济论等重要理论方面，对如何建设和发展社会主义作明确的、系统的回答，为坚持中国特色社会主义道路奠定理论基础；中国特色社会主义理论体系中的“三个代表”重要思想，科学回答“建设什么样的党、怎样建设党”这个关键性问题，增强了人们对中国共产党执政的信心，并在经济、政治、文化、军事、外交等方面提出一系列新理论，把中国特色社会主义事业成功推向新世纪；中国特色社会主义理论体系中的科学发展观，以其对“实现什么样的发展、怎样发展”的精辟阐释，成为坚持中国特色社会主义道路的重要思想保障，把中国特色社会主义推向了新的发展阶段。"
        },
        {
          level: "title2",
          content: "核心价值观"
        },
        {
          level: "paragraph",
          content: "社会主义核心价值体系主要由坚持马克思主义指导思想，坚持中国特色社会主义共同理想，坚持以爱国主义为核心的民族精神和以改革创新为核心的时代精神和坚持社会主义荣辱观组成。2012年11月，党的十八大报告首次以12个词概括社会主义核心价值观：倡导富强、民主、文明、和谐，倡导自由、平等、公正、法治，倡导爱国、敬业、诚信、友善，积极培育社会主义核心价值观。"
        }


      ],
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            tagId: '3',
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      },
      {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      },
      {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      },
      {
        id: 11,
        label: '一级 4',
        children: [{
          id: 12,
          label: '二级 4-1'
        }, {
          id: 13,
          label: '二级 4-2'
        }, {
          id: 14,
          label: '二级 4-3'
        }, {
          id: 15,
          label: '二级 4-4'
        }]
      }],
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
