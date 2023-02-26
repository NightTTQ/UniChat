<template>
  <n-layout style="height: 100vh" has-sider>
    <ChatList :chats="chats" @select="select" />
    <ChatPanel v-if="curRoom.roomId" :chat="curRoom" />
  </n-layout>
</template>
<script setup lang="ts">
import { ref, onBeforeMount, Ref } from "vue";
import { storeToRefs } from "pinia";
import { useNotification } from "naive-ui";

import { ChatList } from "@/components/chat/chatList";
import { ChatPanel } from "@/components/chat/chatPanel";
import { useChatsStore } from "@/stores";
import { Chat } from "@/types";
import { getUnreadMessage } from "@/services/chatService";

const notification = useNotification();
const chatStore = useChatsStore();
const chats = storeToRefs(useChatsStore()).chats;
const curRoom: Ref<Chat> = ref({
  roomId: "",
  type: 1,
  avatar: "",
  name: "",
  lastMessage: undefined,
});

const select = (room: Chat) => {
  curRoom.value = room;
};

// 目前先在每次刷新页面时获取所有未读消息，正确做法应该封装为worker，只在需要时获取
onBeforeMount(() => {
  getUnreadMessage((chat: Chat) => {
    chatStore.addChat(chat);
  });
});
</script>
<style scoped lang="scss">
.wrapper {
  display: flex;
  height: 100vh;
  .bar {
    width: 5px;
    height: 100%;
    cursor: e-resize;
  }
}
</style>
