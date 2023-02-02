<template>
  <div>
    <n-layout style="height: 100vh" has-sider>
      <UserList></UserList>
      <ChatRoom></ChatRoom>
    </n-layout>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useNotification } from "naive-ui";

import { useUserStore } from "@/stores";
import { info } from "@/services/userService";
import ChatRoom from "@/components/chat/chatRoom.vue";
import UserList from "@/components/chat/userList.vue";
import { getMessage } from "@/services/chatService";

const notification = useNotification();
const userStore = useUserStore();
const userInfo = ref({});

onBeforeMount(async () => {
  const data = await info();
  if (data.code === 200) {
    userStore.setUserInfo(data.data);
    userInfo.value = userStore.userInfo;
  } else {
    notification.error({
      content: "获取用户信息失败",
      duration: 3000,
      keepAliveOnHover: true,
    });
  }
});
const refreshData = (data: any) => {
  console.log(data);
};

const get = () => {
  getMessage(refreshData);
};
</script>
<style scoped lang="scss">
.wrapper {
  display: flex;
  height: 100vh;
  .side {
  }
  .bar {
    width: 5px;
    height: 100%;
    cursor: e-resize;
  }
  .content {
  }
}
</style>
