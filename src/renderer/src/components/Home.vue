<!-- 项目主窗口 组织所有页面 -->
<script setup>
import TitleBar from './TitleBar.vue'
</script>
<template>
  <el-container>
    <el-header class="header">
      <TitleBar></TitleBar>
    </el-header>
    <el-container>
      <el-aside width="200px"> Aside </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<style lang="less">
@import '../assets/css/home.less';
</style>
