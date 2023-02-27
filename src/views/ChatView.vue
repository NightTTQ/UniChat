<template>
  <n-layout style="height: 100vh" has-sider ref="containerRef">
    <ChatList :chats="chats" @select="select" />
    <ChatPanel v-if="curRoom.roomId" :chat="curRoom" />
  </n-layout>
</template>
<script setup lang="ts">
import {
  ref,
  onBeforeMount,
  Ref,
  VNodeRef,
  VNode,
  h,
  render,
  getCurrentInstance,
} from "vue";
import { storeToRefs } from "pinia";
import { useNotification } from "naive-ui";

import { ChatList } from "@/components/chat/chatList";
import { ChatPanel } from "@/components/chat/chatPanel";
import { useChatsStore } from "@/stores";
import { Chat } from "@/types";
import { getUnreadMessage } from "@/services/chatService";

// const instance = getCurrentInstance();
// const containerRef: VNodeRef = ref();
// const panels: Ref<VNode[]> = ref([]);
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
  // TODO:对于每个聊天面板分别进行缓存，动态渲染
  // console.log(instance);

  // const node = h(ChatPanel, { chat: room });
  // render(node, containerRef.value.$el.lastElementChild);
  // panels.value.push(node);
  // console.log(instance?.vnode);

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
