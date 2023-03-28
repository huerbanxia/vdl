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
      <el-aside width="200px">
        <el-button>Default</el-button>
        <el-button type="primary">Primary</el-button>
        <el-button type="success">Success</el-button>
        <el-button type="info">Info</el-button>
        <el-button type="warning">Warning</el-button>
        <el-button type="danger">Danger</el-button>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<style lang="less">
@import '../assets/css/home.less';
</style>
