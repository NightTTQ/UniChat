<template>
  <div class="bar-wrapper">
    <n-h4 class="chat-name">{{ name }}</n-h4>
    <div class="action-area">
      <Call
        class="action-call"
        v-if="chat.type === 1 && chat.userId"
        @click="emit('call')"
      />
      <EllipsisVertical class="action-more" @click="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Call, EllipsisVertical } from "@vicons/ionicons5";

import { Chat } from "@/types";

const props = defineProps<{ chat: Chat; name: string }>();

const emit = defineEmits<{
  (event: "call"): void;
}>();
</script>

<style lang="scss" scoped>
.bar-wrapper {
  display: flex;
  height: 5em;
  padding: 1em;
  text-align: center;
  justify-content: space-between;
  background-color: rgb(24, 24, 28);
  .chat-name {
    font-weight: bold;
  }
  .action-area {
    display: flex;
    align-items: center;
    justify-content: center;

    .action-call {
      width: 3em;
      padding: 0.5em;
      cursor: pointer;
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
    }
    .action-more {
      width: 3em;
      padding: 0.5em;
      cursor: pointer;
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
