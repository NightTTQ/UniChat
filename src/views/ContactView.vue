<template>
  <n-layout style="height: 100vh" has-sider>
    <ContactList
      @toggleId="toggleId"
      @toShowRequest="toShowRequest"
    ></ContactList>
    <ContactPanel v-show="show === 'contact'" :_id="PanelItemID"></ContactPanel>
    <RequestList v-show="show === 'requst'"></RequestList>
  </n-layout>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { ContactList } from "@/components/contact/contactList";
import { ContactPanel } from "@/components/contact/contactPanel";

import RequestList from "@/components/contact/contactRequest/requestList.vue";
import { Contact, Group } from "@/types";

const show = ref<"contact" | "requst">();
const PanelItemID = ref("");

// 切换item
const toggleId = (item: Contact | Group) => {
  PanelItemID.value = item._id;
  show.value = "contact";
};

// 显示好友/群聊请求列表
const toShowRequest = () => {
  show.value = "requst";
};
</script>
<style scoped lang="scss">
.ContactRequest {
  position: fixed;
  bottom: 0.5em;
  width: 15em;
  z-index: 2;
}
</style>
