<template>
  <div class="request-wrapper">
    <div class="header">
      <n-tabs size="large" justify-content="space-evenly">
        <n-tab-pane name="friend" tab="好友请求">
          <RequestItem :requests="FriendRequests" :message="'好友'" />
        </n-tab-pane>
        <n-tab-pane name="group" tab="群聊请求">
          <RequestItem :requests="GroupRequests" :message="'群聊'" />
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import RequestItem from "./requestItem.vue";
import {
  getRequest as getFriendRequest,
  handleRequest as handleFriendRequest,
} from "@/services/contactService";
import {
  getRequest as getGroupRequest,
  handleRequest as handleGroupRequest,
} from "@/services/groupService";

import { useUserStore, useUsersStore } from "@/stores";
import { FriendRequest, GroupRequest } from "@/types";

const usersStore = useUsersStore();
const sessionID = useUserStore().sessionID;
// 好友请求列表
const FriendRequests = ref<FriendRequest[]>([]);
// 群聊请求列表
const GroupRequests = ref<GroupRequest[]>([]);
onMounted(() => {
  updateFriendRequests();
  updateGroupRequests();
});

// 获取好友请求
const updateFriendRequests = async () => {
  const res = await getFriendRequest(sessionID!);
  FriendRequests.value = res.data;
  FriendRequests.value.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  for (const request of FriendRequests.value) {
    await usersStore.getUserById(request.fromUser);
    // 进入页面请求变成已读,遍历请求列表,全部标记为已读
    if (request.status === 0) {
      const res = await handleFriendRequest(sessionID!, request._id, 1);
      request.status = 1;
      // console.log(res);
    }
  }
};

// 获取群聊请求
const updateGroupRequests = async () => {
  const res = await getGroupRequest(sessionID!);
  GroupRequests.value = res.data;
  GroupRequests.value.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  // 进入页面请求变成已读,遍历请求列表,全部标记为已读
  for (const request of GroupRequests.value) {
    if (request.status === 0) {
       const res = await handleGroupRequest(sessionID!, request._id, 1);
       request.status = 1;
       // console.log(res);
    }
  }
};
</script>

<style lang="scss" scoped>
.request-wrapper {
  padding: 0 1em;
  margin: 1em auto;
  .header {
    width: 100%;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    text-align: center;
    .tab-item {
      width: 20em;
    }
  }
}
</style>
