<template>
  <n-layout-sider class="group-list" :native-scrollbar="false" width="100%">
    <div class="group-list-item" v-for="group in mockGroups" :key="group._id" :native-scrollbar="false">
      <img :src="group.groupAvatar" alt="error" />
      <div style="display: flex; flex-direction: column;">
        <h2>{{ group.groupName }}</h2>
        <h5>last message</h5>
      </div>
    </div>
  </n-layout-sider>
</template>

<script setup lang="ts">
import { useGroupsStore } from "@/stores";
import { Group } from "@/types";

const groupsStore = useGroupsStore();

const mockGroup = (): Group => ({
  _id: "111",
  groupAvatar:
    "https://ts2.cn.mm.bing.net/th?id=OIP-C.ei7qo_LySD7h3QNJaHJO-AAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2",
  groupName: "group",
  groupInfo: "groupInfo",
  user: [],
  admin: [],
  owner: "owner",
});

const mockGroups: Record<string, Group> = {
  "111": mockGroup(),
  "222": mockGroup(),
};
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
