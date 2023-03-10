<template>
  <div class="wrapper">
    <div class="img-area">
      <n-icon size="30" class="icon">
        <PersonAddOutline />
      </n-icon>
    </div>
    <div class="text-area">
      <n-h3 class="text">好友/群聊请求</n-h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PersonAddOutline } from "@vicons/ionicons5";
const toRequest = () => {};
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: rgb(24,24,28);
  padding: 0 1em;
  height: 7em;
  display: flex;
  justify-content: left;
  cursor: pointer;
  .img-area {
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      height: 60px;
      width: 60px;
      border-radius: 50%;
    }
  }
  .text-area {
    display: flex;
    width: 0;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .text {
      font-size: 1.4em;
      margin: 0;
      white-space: nowrap;
    }
  }
}
</style>
