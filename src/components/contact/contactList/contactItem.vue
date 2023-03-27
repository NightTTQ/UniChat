<template>
  <div class="wrapper">
    <div class="img-area">
      <img class="img" draggable="false" :src="avatar" />
    </div>
    <div class="text-area">
      <n-h3 class="name-text"> {{ name }}</n-h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from "@/types";

defineProps<{
  avatar: string;
  name: string;
  roomId?: string;
  type: "friend" | "group";
  lastMessage?: Message;
  fromUser?: string;
  info?: string;
  _id?: string;
  item: any;
}>();
</script>

<style lang="scss" scoped>
.wrapper {
  box-sizing: border-box;
  width: 250px;
  height: 80px;
  display: flex;
  justify-content: left;
  column-gap: 1em;
  cursor: pointer;
  padding: 1.5em;
  overflow: hidden;
  .img-area {
    display: flex;
    align-items: center;
    justify-content: center;
    .img {
      height: 55px;
      width: 55px;
      border-radius: 50%;
    }
  }
  .text-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    .name-text {
      margin: 0;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      white-space: nowrap;
    }
  }
}
</style>
