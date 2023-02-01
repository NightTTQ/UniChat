<template>
  <n-layout-sider
    content-style="padding: 4px, width:25%"
    :native-scrollbar="false"
  >
    <UserPanel v-for="item in 10" :key="item"></UserPanel>
  </n-layout-sider>
</template>

<script setup lang="ts"></script>

<style scoped></style>
