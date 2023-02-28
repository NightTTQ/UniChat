<template>
  <n-layout-sider class="list" :native-scrollbar="false">
    <div class="list-wrapper">
      <ContactItem
        v-for="item in groups"
        :key="item._id"
        :native-scrollbar="false"
        :avatar="item.groupAvatar"
        :name="item.groupName"
        :info="item.groupInfo"
        type="group"
        :id="item._id"
        :item="item"
      />
    </div>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupsStore } from "@/stores";

const groupsStore = useGroupsStore();
const groups = storeToRefs(groupsStore).groups;
</script>

<style scoped lang="scss"></style>
