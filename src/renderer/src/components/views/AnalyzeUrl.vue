<!--
 * 网站分析组件
 * @author: zgy
 * @since: 2023-03-29
 * AnalyzeUrl.vue
-->
<script setup>
import { ref, onMounted } from 'vue'
import useWinStore from '../../store/useWinStore'
// import http from '../../utils/http'

const word = ref('')

const winStore = useWinStore()

const tableData = ref([])

const analyzeHandle = () => {
  api.getVideoPageList().then((res) => {
    console.log(res)
    // https://i.iwara.tv/image/thumbnail/id/thumbnail-00.jpg
    tableData.value = res.results
  })
}
const download = () => {}

onMounted(() => {
  analyzeHandle()
})
</script>
<template>
  <el-card class="container">
    <el-row :gutter="4">
      <el-col :span="20"><el-input v-model="word" placeholder="请输入关键字" /></el-col>
      <el-col :span="2"
        ><el-button style="width: 100%" @click="analyzeHandle">刷新</el-button></el-col
      >
      <el-col :span="2"><el-button style="width: 100%" @click="download">下载</el-button></el-col>
    </el-row>
    <div class="data-table">
      <el-table :data="tableData" :height="winStore.tableHeight" border stripe>
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" width="45" />
        <el-table-column prop="" label="预览" width="100" />
        <el-table-column prop="title" label="标题" width="180" show-overflow-tooltip />
        <el-table-column prop="user.name" label="作者" width="180" show-overflow-tooltip />
        <el-table-column prop="numLikes" label="Likes" width="60" />
        <el-table-column prop="numViews" label="Views" width="70" />
        <el-table-column prop="updatedAt" label="更新时间" width="120" show-overflow-tooltip />
        <!-- <el-table-column prop="id" label="ID" width="50" show-overflow-tooltip /> -->
        <el-table-column prop="address" label="下载进度" />
      </el-table>
    </div>
  </el-card>
</template>

<style lang="less" scoped>
.container {
  margin: 0;
  height: 100%;
}
.data-table {
  // height: 80%;
  margin-top: 15px;
}
</style>
