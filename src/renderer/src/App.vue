<script setup>
import { onMounted, onUnmounted } from 'vue'
import Home from './components/Home.vue'
// 重设组件大小
const winReSize = () => {
  const mainContiner = document.getElementById('main-continer')
  mainContiner.style.height = window.innerHeight + 'px'
  mainContiner.style.width = window.innerWidth + 'px'
}
// 组件创建添加窗口变化事件
onMounted(() => {
  winReSize()
  window.addEventListener('resize', winReSize)
})
// 组件卸载移除监听
onUnmounted(() => {
  window.removeEventListener('resize', winReSize, false)
})
</script>

<template>
  <div id="main-continer" class="main-continer">
    <Home></Home>
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html body {
  height: 100%;
}
body {
  overflow: hidden;
}
.main-continer {
  height: 718px;
}
</style>
