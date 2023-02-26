<template>
  <n-layout-sider class="list" :native-scrollbar="false">
    <div class="list-wrapper">
      <ContactItem
        v-for="item in contacts"
        :key="item._id"
        :native-scrollbar="false"
        :room-id="item.roomId"
        :avatar="item.avatar"
        :name="item.username"
        :id="item._id"
        type="friend"
        :item="item"
      ></ContactItem>
    </div>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useContactsStore } from "@/stores";

const contacts = storeToRefs(useContactsStore()).contacts;

</script>

<style scoped></style>
