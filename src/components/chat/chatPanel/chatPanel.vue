<template>
  <div class="chat-wrapper">
    <!-- 顶部常驻栏 -->
    <PanelBar :name="name" />
    <!-- 消息内容显示区 -->
    <ChatContent :chat="props.chat" ref="contentRef" />
    <!-- 消息输入发送区 -->
    <ChatInput @send="sendNewMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useUserStore, useContactsStore, useGroupsStore } from "@/stores";
import { Chat, LocalMessage } from "@/types";
import { sendMessage } from "@/services/chatService";
import { messagePersistence } from "@/services/messageService";
import PanelBar from "./chatPanelBar.vue";
import ChatContent from "./chatContent.vue";
import ChatInput from "./chatInput.vue";

const props = defineProps<{ chat: Chat }>();

const userStore = useUserStore();
const contacts = storeToRefs(useContactsStore()).contacts;
const groups = storeToRefs(useGroupsStore()).groups;
const contentRef = ref<InstanceType<typeof ChatContent>>();

const name = computed(() => {
  if (props.chat.type === 1) {
    return contacts.value[props.chat.userId!].username;
  }
  if (props.chat.type === 2) {
    return groups.value[props.chat.roomId].groupName;
  }
  return "";
});

// 发送新消息
const sendNewMessage = async (message: string) => {
  const tmpMessage: LocalMessage = {
    _id: "",
    roomId: props.chat.roomId,
    fromId: userStore.userInfo._id,
    msgType: 1,
    content: message,
    edited: false,
    deleted: false,
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // 将正在发送的消息放入展示数组
  contentRef.value!.updateMessages([tmpMessage], false, false);
  sendMessage(tmpMessage, props.chat.type)
    .then(async (message) => {
      // 发送成功，根据服务器返回进行本地序列化
      const unlinkMessages = [message];
      const index = contentRef.value!.messages.indexOf(tmpMessage);
      if (index) {
        // 新消息不是第一条消息，能够与前一条消息链表化
        unlinkMessages.unshift(contentRef.value!.messages[index - 1]);
      }
      // 已序列化的消息
      const localMessages = await messagePersistence(
        unlinkMessages,
        props.chat.type
      );
      // 将发送中的消息替换掉
      contentRef.value!.messages[
        contentRef.value!.messages.indexOf(tmpMessage)
      ] = localMessages[localMessages.length - 1];
    })
    .catch((err) => {
      // 发生错误
      console.log(err);
      tmpMessage.status = 2;
      // 5s后将临时消息删除。TODO：支持重新发送功能
      setTimeout(() => {
        contentRef.value?.messages.slice(
          contentRef.value.messages.indexOf(tmpMessage),
          1
        );
      }, 5000);
    });
};
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex: 1;
  max-height: 100vh;
  flex-direction: column;
  position: relative;
}
</style>
