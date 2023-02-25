<template>
  <div class="sider">
    <div class="bar">
      <n-input type="text" size="large" placeholder="搜索" />
    </div>
    <SliderButton :callbackInfo="callbackInfo"></SliderButton>
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";

import { CallbackInfo } from "./type";

// 传递给导航组件的信息
const callbackInfo: CallbackInfo[] = [
  {
    labelname: "好友",
    callback: () => {
      router.push({ name: "single" });
    },
  },
  {
    labelname: "群聊",
    callback: () => {
      router.push({ name: "group" });
    },
  },
];
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
