<script>
import {getLastAid, getAllNote, getSearch, getLastRead} from "../api/api"
import { useStore } from '../stores/globalStores.js'
export default {
  data() {
    const store = useStore()
    return {
      loading: false,
      lastread:"",
      lastaid:-1,
      recentNote: [],
      recentSearch: [],
      store: store,
      username: store.username,
      note: "",
      logintime:store.logintime
    }
  },
  mounted() {
    // 此时组件已经挂载。
    // console.log(this.$route.query)
    // console.log(this.username)
    console.log('isAdmin' + this.store.isAdmin)
    // username=this.$route.query
    this.loading = true
    this.fetchNote()
    this.fetchSearch()
    if (this.username == 'admin') {
      this.store.isadmin = true
    }
    getLastRead(this.store.username).then(res=>{
      console.log('getLastAid',res)
      if(res.data!=-1){
        this.lastread=res.data
      }
    })
    getLastAid(this.store.username).then(res=>{
      console.log('getLastAid',res)
      if(res.data!=-1){
        this.lastaid=res.data
      }
      console.log("aid",this.lastaid)
    })

  },
  methods: {
    async fetchNote() {
      getAllNote(this.store.username).then(res => {
        console.log("note", res)
        if (res.data.length <= 3) {
          this.recentNote = res.data
        }
        else {
          this.recentNote = res.data.slice(res.data.length - 4, res.data.length - 1)
        }
      })
    },
    async fetchSearch() {
      getSearch(this.store.username).then(res => {
        console.log("search", res)
        this.recentSearch = res.data
        this.loading = false
      })
    },
    notejump(aid, orderid) {
      console.log("aid", aid)
      console.log("orderid", orderid)
      this.$router.push({
        name: 'read',
        query: {
          aid: aid,
          orderid: orderid
        }
      });
    },
    jump(){
      this.$router.push({
        name:"read",
        query:{
          aid:this.lastaid
        }
      })
    }
  }
}
</script>

<template>
  <el-row class="home" :gutter="20" type="flex">
    <el-col :span="12" style="overflow-x: hidden;">
      <el-card shadow="always">
        <template #header>
          <div class="card-header">
            <span class="homecardtitle"><el-icon>
                <Postcard />
              </el-icon>用户基本资料</span>
          </div>
        </template>
        <div class="user">
          <img src="../assets/images/boy.png" alt="">
          <div class="userinfo">
            <p style="margin-left: 20px;" class="name">{{ this.store.username }}</p>
            <p style="margin-left: 20px;" class="role">{{ this.store.isAdmin ? '管理员' : '普通用户' }}</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间<span>{{ this.store.logintime.slice(0,10) }}</span></p>
          <p>上次阅读<a @click="jump" style="margin-left: 95px;cursor: pointer">{{ this.lastread }}</a></p>
        </div>

      </el-card>
    </el-col>
    <el-col :span="12" style="overflow-x: hidden;">
      <div class="block text-center" style="box-shadow:var(--el-box-shadow-light)" m="t-4">
        <el-carousel trigger="click" height="240px">
          <el-carousel-item style="text-align: center;">
            <img style="width: 100%;height: 100%;" src="../assets/images/1124825976_1564646047053_title0h.jpg" alt="">
          </el-carousel-item>
          <el-carousel-item style="text-align: center;">
            <img style="width: 100%;height: 100%;" src="../assets/images/1124819568_15645442123751n.jpg" alt="">
          </el-carousel-item>
          <el-carousel-item style="text-align: center;">
            <img style="width: 100%;height: 100%;" src="../assets/images/1124819568_15645442313421n.jpg" alt="">
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-col>
    <el-col :span="24">

      <el-card v-loading="loading" shadow="always" style="margin-top:20px;">

        <template #header>
          <div class="card-header">
            <span class="homecardtitle"><el-icon>
                <Notebook />
              </el-icon>最近的笔记</span>
          </div>
        </template>

        <div v-if="this.recentNote.length == 0" style="height:100px">暂无笔记</div>
        <div v-else style=" text-align: center; height:100px; font-size: 15px;">
          <span v-for="item in this.recentNote"
            style="display: inline-block; white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 600px; margin-left: 20px; margin-bottom: 8px;">
            <a class="homelink" style="font-style: oblique;cursor:pointer" @click="notejump(item.aid, item.orderid)">{{
              item.title }}</a>
            <span>-------{{ item.content }}</span>
          </span>
        </div>


      </el-card>
    </el-col>
    <el-col :span="24">

      <el-card v-loading="loading" shadow="always" style="margin-top:20px;">

        <template #header>
          <div class="card-header">
            <span class="homecardtitle"><el-icon>
                <Collection />
              </el-icon>最近的搜索</span>
          </div>
        </template>

        <div v-if="this.recentSearch.length == 0" style="height:100px;font-size: 15px;">暂无搜索</div>
        <div v-else style="text-align: center; height: 50px;px;font-size: 15px;margin-top: 20px; ">
          <span v-for="item in this.recentSearch" style="width: 50%; margin-right: 18px;">
            <a class="homelink" style="font-style: oblique;cursor:pointer">{{ item.value }}</a>
          </span>
        </div>

      </el-card>
    </el-col>
  </el-row>
</template>

<style>
.homecardtitle {
  font-size: 15px;
  color: #0379f1;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.homelink:hover {
  color: red;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__item h3 {
  text-align: center;
  color: #475669;
  opacity: 0.75;
  line-height: 240px;
  margin: 0;
}

.user {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}

.user img {
  width: 66px;
  height: 66px;
  border-radius: 50%;
  margin-right: 40px;
}

.userinfo>p {
  line-height: 30px;
  font-size: 14px;
  color: #999;
}

p>span {
  color: #666;
  margin-left: 70px;
}
</style>
