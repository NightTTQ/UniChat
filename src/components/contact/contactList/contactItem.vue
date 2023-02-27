<template>
  <div class="wrapper" @click="currentContactStore.toggleId(item._id)">
    <div class="img-area">
      <img class="img" draggable="false" :src="avatar" />
    </div>
    <div class="text-area">
      <n-h3 class="name-text">{{ name }}</n-h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from "@/types";

import { useCurrentContactStore } from "@/stores";

const currentContactStore = useCurrentContactStore();
defineProps<{
  avatar: string;
  name: string;
  roomId?: string;
  type: "friend" | "group";
  lastMessage?: Message;
  fromUser?: string;
  info?: string,
  _id: string,
  item: any
}>();

</script>

<style lang="scss" scoped>
.wrapper {
  height: 80px;
  display: flex;
  justify-content: left;
  column-gap: 1em;
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
    flex-direction: column;
    justify-content: center;
    .name-text {
      margin: 0;
    }
  }
}
</style>
