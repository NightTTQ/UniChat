<template>
  <div class="chat-wrapper">
    <!-- 顶部常驻栏 -->
    <PanelBar :name="name" />
    <!-- 消息内容显示区 -->
    <ChatContent :chat="props.chat" />
    <!-- 消息输入发送区 -->
    <ChatInput />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useContactsStore, useGroupsStore } from "@/stores";
import { Chat } from "@/types";
import PanelBar from "./chatPanelBar.vue";
import ChatContent from "./chatContent.vue";
import ChatInput from "./chatInput.vue";

const props = defineProps<{ chat: Chat }>();

const contacts = storeToRefs(useContactsStore()).contacts;
const groups = storeToRefs(useGroupsStore()).groups;

const name = computed(() => {
  if (props.chat.type === 1) {
    return contacts.value[props.chat.userId!].username;
  }
  if (props.chat.type === 2) {
    return groups.value[props.chat.roomId].groupName;
  }
  return "";
});

const sendMessage = () => {};
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
