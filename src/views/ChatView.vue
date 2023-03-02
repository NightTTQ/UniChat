<template>
  <n-layout style="height: 100vh" has-sider ref="containerRef">
    <ChatList :chats="chats" @select="select" />
    <ChatPanel v-if="curRoom.roomId" :chat="curRoom" ref="panelRef" />
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
import { useUserStore, useChatsStore } from "@/stores";
import { Chat } from "@/types";
import { getUnreadMessage, listenNewMessage } from "@/services/chatService";
import { getContactInfo } from "@/services/contactService";
import { getGroupInfo } from "@/services/groupService";

// const instance = getCurrentInstance();
// const containerRef: VNodeRef = ref();
// const panels: Ref<VNode[]> = ref([]);
const notification = useNotification();
const userStore = useUserStore();
const chatsStore = useChatsStore();
const chats = storeToRefs(useChatsStore()).chats;
const panelRef = ref<InstanceType<typeof ChatPanel>>();
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
    chatsStore.addChat(chat);
  });
});

// 监听服务器推送新消息，将新消息同步至消息面板及消息列表
listenNewMessage(async (message, type) => {
  if (message.roomId === curRoom.value.roomId && type === curRoom.value.type) {
    // 同步至消息面板。若没打开任何面板则无需更新。
    panelRef.value?.updateMessages([message], false, false);
  }
  // 同步至消息列表。一定需要更新。
  // 先查找消息列表中是否有该消息所属的房间
  const chat = chatsStore.chats.find(
    (chat) => chat.roomId === message.roomId && chat.type === type
  );
  if (chat) {
    // 已有此房间，直接更新即可
    chatsStore.updateLastMessage(chat, message);
  } else {
    // 没有此房间，先从服务器获取房间信息
    if (type === 1) {
      // 对于私聊
      const chat = await getContactInfo(userStore.sessionID!, message.roomId);
      if (chat.code === 200) {
        chat.data.lastMessage = message;
        chatsStore.addChat(chat.data);
      }
    }
    if (type === 2) {
      // 对于群聊
      const group = await getGroupInfo(userStore.sessionID!, message.roomId);
      if (group.code === 200) {
        chatsStore.addChat({
          roomId: group.data._id,
          type: 2,
          avatar: group.data.groupAvatar,
          name: group.data.groupName,
          lastMessage: message,
        });
      }
    }
  }
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
