<script>
export default {
    data() {
        cardHeight:window.innerHeight-180
    }
}
</script>
<template>
    <el-row >
        <el-col :span="24" >
            <el-card shadow="hover" :height="cardHeight" class="el-card-define" >
                <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
            </el-card>
        </el-col>
    </el-row>
</template>
<style>
.el-card-define {
  min-height: 100%;
  height: 100%;
}
.el-card-define >>> .el-card__body {
  height: 100%;
}
</style>