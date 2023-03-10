<template>
  <div class="wrapper" @click="select" :class="active ? 'active' : ''">
    <div class="img-area">
      <img class="img" draggable="false" :src="avatar" />
    </div>
    <div class="text-area">
      <div class="first-line">
        <n-h3 class="chat-name"> {{ name }}</n-h3>
        <div class="last-time" v-if="lastMessage">
          {{ format(lastMessage.createdAt, "HH:mm") }}
        </div>
      </div>

      <div class="second-line">
        <n-p class="last-message">{{
          fromUser
            ? `${fromUser}: ${lastMessage?.content}`
            : `${lastMessage?.content || ""}`
        }}</n-p>
        <div class="unread-count" v-if="unreadCount">{{ unreadCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from "date-fns";

import { LocalMessage } from "@/types";

const props = defineProps<{
  avatar: string;
  name: string;
  roomId: string;
  type: number;
  unreadCount?: number;
  lastMessage?: LocalMessage;
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
    .first-line {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      column-gap: 1em;
      .chat-name {
        margin: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .second-line {
      display: flex;
      justify-content: space-between;
      column-gap: 1em;
      .unread-count {
        border-radius: 9999rem;
        height: 1.5em;
        display: flex;
        align-items: center;
        padding: 0 0.5em;
        font-size: small;
        background-color: var(--primary-color);
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
}
</style>
