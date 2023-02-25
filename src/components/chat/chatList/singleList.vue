<template>
  <n-layout-sider class="list" :native-scrollbar="false" width="100%">
    <ListItem v-for="item in 50" :key="item" :native-scrollbar="false" />
  </n-layout-sider>
</template>

<script setup lang="ts"></script>

<style scoped></style>
