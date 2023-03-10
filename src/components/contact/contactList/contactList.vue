<template>
  <div class="sider">
    <div class="bar" style="width: 250px;">
      <n-input type="text" size="large" placeholder="搜索" style="width: 250px;"/>
    </div>
    <SliderButton :callback-info="callbackInfo"></SliderButton>
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import SliderButton from "./sliderButton.vue"
import { CallbackInfo } from "./type";

const callbackInfo: CallbackInfo[] = [
  {
    labelname: "好友",
    callback: () => {
      router.push({ name: "friend" })
    },
    name: "friend"
  },
  {
    labelname: "群聊",
    callback: () => {
      router.push({ name: "group" })
    },
    name: "group"
  }
]

</script>

<style lang="scss" scoped>
.sider {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  min-width: 200px;
  width: 250px;
  z-index: 1;
  
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
    user-select: none;
    .list-wrapper {
      padding: 0 1em;
    }
  }
}
</style>
