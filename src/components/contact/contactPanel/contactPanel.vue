<template>
  <n-layout style="height: 100vh;width:70%">
    <n-layout-content content-style="padding: 50px">
      <n-space vertical>
        <friendInfo v-if="panelInfo.type == 'friend'" :panelInfo="panelInfo"/>
        <groupInfo v-else :panelInfo="panelInfo"/>
      </n-space>
    </n-layout-content>
  </n-layout>
</template>

<script setup lang="ts">
import { Info } from "./type";
import { watch, ref } from "vue";

import { storeToRefs } from 'pinia';
import { useCurrentContactStore, useContactsStore, useGroupsStore } from '@/stores';

const _id = storeToRefs(useCurrentContactStore())._id;
const contacts = storeToRefs(useContactsStore()).contacts;
const groups = storeToRefs(useGroupsStore()).groups;

// 根据好友群聊显示不同面板
const formatPanelInfo = (_id: string): Info => {
  const type = groups.value[_id] ? "group" : "friend";
  const detailInfo = groups.value[_id] || contacts.value[_id];
  return {
    type,
    ...detailInfo
  }
}

let panelInfo = ref(formatPanelInfo(_id.value));
// 点击事件发生时，改变 panel
watch(_id, (newId) => {
  panelInfo.value = formatPanelInfo(newId);
})
</script>

<style scoped></style>
