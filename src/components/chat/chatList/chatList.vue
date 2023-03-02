<template>
  <div class="sider">
    <div class="bar">
      <n-input type="text" size="large" placeholder="搜索" />
    </div>
    <n-layout-sider class="list" :native-scrollbar="false">
      <ListItem
        v-for="item in chats"
        :key="item.roomId"
        :native-scrollbar="false"
        :room-id="item.roomId"
        :type="item.type"
        :avatar="
          item.type === 1
            ? contacts[item.userId!]?.avatar
            : groups[item.roomId]?.groupAvatar
        "
        :name="
          item.type === 1
            ? contacts[item.userId!]?.username
            : groups[item.roomId]?.groupName
        "
        :last-message="item.lastMessage"
        :from-user="
          item.type !== 1 &&
          item.lastMessage?.fromId !== userInfo._id &&
          item.lastMessage
            ? users[item.lastMessage.fromId].username
            : ''
        "
        :active="item === curChat"
        @select="select"
      />
    </n-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import {
  useUsersStore,
  useContactsStore,
  useGroupsStore,
  useUserStore,
} from "@/stores";

import ListItem from "./listItem.vue";
import { Chat } from "@/types";

const props = defineProps<{ chats: Chat[] }>();
const emit = defineEmits<{
  (event: "select", chat: Chat): void;
}>();
const curChat = ref<Chat>();

const userInfo = storeToRefs(useUserStore()).userInfo;
const users = storeToRefs(useUsersStore()).users;
const contacts = storeToRefs(useContactsStore()).contacts;
const groups = storeToRefs(useGroupsStore()).groups;

const select = (roomId: string, type: number) => {
  const chat = props.chats.find(
    (item) => item.roomId === roomId && item.type === type
  );
  if (chat) {
    emit("select", chat);
    curChat.value = chat;
  }
};
</script>

<style lang="scss" scoped>
.sider {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  min-width: 200px;
  .bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    background-color: rgb(24, 24, 28);
  }
  .list {
    flex: 1;
    overflow-y: auto;
    user-select: none;
  }
}
</style>
