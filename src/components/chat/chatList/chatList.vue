<template>
  <div class="sider">
    <div class="bar">
      <n-input type="text" size="large" placeholder="搜索" />
    </div>
    <n-layout-sider class="list" :native-scrollbar="false">
      <div class="list-wrapper">
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
        />
      </div>
    </n-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useContactsStore, useGroupsStore } from "@/stores";

import ListItem from "./listItem.vue";
import { Chat } from "@/types";

const props = defineProps<{ chats: Chat[] }>();

const contacts = storeToRefs(useContactsStore()).contacts;
const groups = storeToRefs(useGroupsStore()).groups;
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
    .list-wrapper {
      padding: 0 1em;
    }
  }
}
</style>
