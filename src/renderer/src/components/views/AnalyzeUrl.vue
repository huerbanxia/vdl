<!--
 * 我的订阅页面下载组件
 * @author: zgy
 * @since: 2023-03-29
 * AnalyzeUrl.vue
-->
<script setup>
import { ref, onMounted } from 'vue'
import useWinStore from '../../store/useWinStore'
import { ElMessage } from 'element-plus'

const winStore = useWinStore()
const word = ref('')
const tableRef = ref()
const tableLoading = ref(true)
const tableData = ref([])

// 日期数据 格式化 （公共函数）+ 数字补0操作
function addZero(num) {
  return num < 10 ? '0' + num : num
}
function formatDateTime(date) {
  const time = new Date(Date.parse(date))
  time.setTime(time.setHours(time.getHours()))
  const Y = time.getFullYear() + '-'
  const M = addZero(time.getMonth() + 1) + '-'
  const D = addZero(time.getDate()) + ' '
  const h = addZero(time.getHours()) + ':'
  const m = addZero(time.getMinutes()) + ':'
  const s = addZero(time.getSeconds())
  return Y + M + D + h + m + s
}

const loadData = () => {
  tableLoading.value = true
  api
    .getVideoPageList()
    .then((res) => {
      // https://i.iwara.tv/image/thumbnail/id/thumbnail-00.jpg
      res.results.forEach((item) => {
        // 添加进度数据
        item.process = 0
        // 添加进度状态数据
        item.status = true
        item.createdAtFormat = formatDateTime(item.createdAt)
      })
      tableData.value = res.results
      tableLoading.value = false
    })
    .catch((e) => {
      console.log(e)
      tableLoading.value = false
      ElMessage.error('数据加载失败 请检查网络连接')
    })
}
// 下载按钮点击事件
const download = () => {
  let rows = tableRef.value.getSelectionRows()
  let data = []
  rows.forEach((item) => {
    let info = {
      id: item.id,
      title: item.title,
      slug: item.slug,
      author: item.user.name,
      fileId: item.file.id,
      createdAt: item.createdAt.substring(0, 10).replaceAll('-', '%2F')
    }
    data.push(info)
  })
  api.downloadVideo(data)
}

const updateTableProcess = (id, process, status) => {
  tableData.value.forEach((item) => {
    if (item.id === id) {
      item.process = process
      item.status = status
    }
  })
}

const getColor = (row) => {
  if (row.status) {
    if (row.process === 100) {
      return '#5cb87a'
    }
    return '#1989fa'
  }
  return '#E06202'
}

// 手动登录按钮
const login = () => {
  api.login()
}

const deleteData = () => {
  api.testPool()
  ElMessage.success('删除成功')
}

onMounted(() => {
  loadData()
  // 注册下载进度侦听器
  api.updateProcess((e, data) => {
    updateTableProcess(data.id, data.process, data.status)
  })
})
</script>
<template>
  <el-card class="container">
    <el-row :gutter="4">
      <el-col :span="2"
        ><el-button type="success" style="width: 100%" @click="login">登录</el-button></el-col
      >
      <el-col :span="16"><el-input v-model="word" placeholder="请输入关键字" /></el-col>

      <el-col :span="2"><el-button style="width: 100%" @click="loadData">刷新</el-button></el-col>
      <el-col :span="2"
        ><el-button type="primary" plain style="width: 100%" @click="download"
          >下载</el-button
        ></el-col
      >
      <el-col :span="2"
        ><el-button style="width: 100%" type="danger" plain @click="deleteData"
          >删除</el-button
        ></el-col
      >
    </el-row>
    <div class="data-table">
      <el-table
        ref="tableRef"
        v-loading="tableLoading"
        :data="tableData"
        :height="winStore.tableHeight"
        :border="true"
        stripe
      >
        <el-table-column type="selection" width="45" />
        <el-table-column type="index" width="45" />
        <!-- <el-table-column prop="" label="预览" width="100" /> -->
        <el-table-column prop="title" label="标题" width="180" show-overflow-tooltip />
        <el-table-column prop="user.name" label="作者" width="100" show-overflow-tooltip />
        <el-table-column prop="numLikes" sortable label="Likes" width="90" />
        <!-- <el-table-column prop="numViews" label="Views" width="70" /> -->
        <el-table-column
          prop="createdAtFormat"
          label="创建时间"
          width="165"
          sortable
          show-overflow-tooltip
        />
        <el-table-column label="下载进度">
          <template #default="scope">
            <el-progress :percentage="scope.row.process" :color="getColor(scope.row)" />
          </template>
        </el-table-column>
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
  margin-top: 15px;
}
</style>
