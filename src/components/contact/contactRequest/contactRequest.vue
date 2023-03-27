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
import { PersonAddOutline } from "@vicons/ionicons5";
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: rgba($color: #fff, $alpha: 0.05);
  padding: 0 2em;
  height: 7em;
  display: flex;
  flex-direction: row;
  justify-content: left;
  cursor: pointer;
  overflow: hidden;
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
    overflow: hidden;
    .text {
      font-size: 1.4em;
      margin: 0;
      white-space: nowrap;
    }
  }
}
</style>
