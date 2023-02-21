<template>
  <div class="sider">
    <div class="bar">
      <n-input type="text" size="large" placeholder="搜索" />
    </div>
    <n-layout-sider class="list" :native-scrollbar="false" width="100%">
      <ListItem v-for="item in 50" :key="item" :native-scrollbar="false" />
    </n-layout-sider>
  </div>
</template>

<script setup lang="ts">
import ListItem from "./listItem.vue";
</script>

<style lang="scss" scoped>
.sider {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  min-width: 200px;
  .bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background-color: rgb(24, 24, 28);
  }
  .list {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
