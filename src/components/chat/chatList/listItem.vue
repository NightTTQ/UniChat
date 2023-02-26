<template>
  <div class="wrapper" @click="select" :class="active ? 'active' : ''">
    <div class="img-area">
      <img class="img" draggable="false" :src="avatar" />
    </div>
    <div class="text-area">
      <n-h3 class="name-text">{{ name }}</n-h3>
      <n-p class="last-message">{{
        fromUser
          ? `${fromUser}:${lastMessage?.content}`
          : `${lastMessage?.content}`
      }}</n-p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Message } from "@/types";

const props = defineProps<{
  avatar: string;
  name: string;
  roomId: string;
  type: number;
  lastMessage?: Message;
  fromUser?: string;
  active: boolean;
}>();

const emit = defineEmits<{
  (event: "select", roomId: string, type: number): void;
}>();

const select = () => {
  emit("select", props.roomId, props.type);
};
</script>

<style lang="scss" scoped>
.wrapper:hover {
  background-color: rgba($color: #fff, $alpha: 0.05);
}
.wrapper.active {
  background-color: rgba($color: #fff, $alpha: 0.1);
}
.wrapper {
  padding: 0 1em;
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
    width: 0;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    .name-text {
      margin: 0;
    }
    .last-message {
      margin: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      opacity: 0.8;
    }
  }
}
</style>
