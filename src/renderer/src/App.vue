<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import Home from './components/Home.vue'

import useWinStore from './store/useWinStore'

const options = reactive({})

const winstore = useWinStore()

// 重设组件大小
const winReSize = () => {
  // 获取窗口改变后的宽高
  options.height = window.innerHeight
  options.width = window.innerWidth
  // 存储到store
  winstore.set(options)
  // 修改主窗口的大小
  const mainContiner = document.getElementById('main-continer')
  mainContiner.style.height = options.height + 'px'
  mainContiner.style.width = options.width + 'px'
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
  <div id="main-continer" height="720px">
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
</style>
