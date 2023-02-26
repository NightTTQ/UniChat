<template>
  <n-layout-sider class="group-list" :native-scrollbar="false" width="100%">
    <!-- <div class="group-list-item" v-for="group in mockGroups" :key="group._id" :native-scrollbar="false">
      <img :src="group.groupAvatar" alt="error" />
      <div style="display: flex; flex-direction: column;">
        <h2>{{ group.groupName }}</h2>
        <h5>last message</h5>
      </div>
    </div> -->
    <n-layout-sider class="list" :native-scrollbar="false">
      <div class="list-wrapper">
        <ContactItem
          v-for="item in groups"
          :key="item._id"
          :native-scrollbar="false"
          :avatar="item.groupAvatar"
          :name="item.groupName"
          :info="item.groupInfo"
          :type="ChatType.GROUP"
        />
      </div>
    </n-layout-sider>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupsStore } from "@/stores";

import { ChatType } from "./type";

const groupsStore = useGroupsStore();
const groups = storeToRefs(groupsStore).groups;

</script>

<style scoped lang="scss">
.group-list-item {
  height: 80px;
  display: flex;
  box-sizing: content-box;
  align-items: center;
  font-size: 15px;

  img {
    height: 40px;
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>
