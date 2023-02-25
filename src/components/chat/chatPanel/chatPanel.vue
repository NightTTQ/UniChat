<template>
  <div class="chat-wrapper">
    <ChatContent :name="chatInfo.name" />
    <ChatInput />
  </div>
</template>

<script setup lang="ts">
import { useChatsStore } from "@/stores";
import { Chat } from "@/types";
import ChatContent from "./chatContent.vue";
import ChatInput from "./chatInput.vue";

const props = defineProps<{ chatInfo: Chat }>();
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
