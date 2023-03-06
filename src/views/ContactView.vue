<template>
  <n-layout style="height: 100vh" has-sider>
    <ContactList @click="show(true)"></ContactList>
    <ContactRequest @click="show(false)" class="ContactRequest" />
    <ContactPanel v-show="isShow"></ContactPanel>
    <RequestList v-show="!isShow"></RequestList>
  </n-layout>
</template>
<script setup lang="ts">
import { ref } from "vue";
import ContactRequest from "@/components/contact/contactRequest/contactRequest.vue";
import RequestList from "@/components/contact/contactRequest/requestList.vue";
const isShow = ref(true);

// 点击控制信息面板和请求面板的显示
const show = (item: boolean) => {
  isShow.value = item;
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
