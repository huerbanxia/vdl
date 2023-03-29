<!--
 * 项目主窗口 组织所有页面
 * @author: zgy
 * @since: 2023-03-29
 * AsideMenu.vue
-->
<script setup>
import { ref } from 'vue'
import AsideMenu from './AsideMenu.vue'
import TitleBar from './TitleBar.vue'

const isCollapse = ref(false)
const changeCollapse = (collapse) => {
  isCollapse.value = collapse
}
</script>
<template>
  <el-container>
    <el-aside :class="[isCollapse ? 'aside-fold' : 'aside-expand']">
      <AsideMenu @change-collapse="changeCollapse"></AsideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <TitleBar></TitleBar>
      </el-header>
      <el-main>内容区域</el-main>
    </el-container>
  </el-container>
</template>

<style lang="less" scoped>
@import '../assets/css/home.less';
</style>
