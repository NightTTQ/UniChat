<template>
  <n-layout-sider class="group-list" :native-scrollbar="false" width="100%">
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
  </n-layout-sider>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGroupsStore } from "@/stores";

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
