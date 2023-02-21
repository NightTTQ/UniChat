<template></template>
<script lang="ts" setup>
import { onMounted } from "vue";
import { useNotification } from "naive-ui";
import router from "@/router";
import { useUserStore } from "@/stores";
import userService from "@/services/userService";

const notification = useNotification();
const userStore = useUserStore();

onMounted(() => {
  doLogout();
});

const doLogout = async () => {
  const sessionID = userStore.sessionID;
  if (!sessionID) {
    notification.error({
      content: "请重新登录",
      duration: 3000,
    });
  } else {
    try {
      const result = await userService.logout(sessionID);
      if (result) {
        notification.success({
          content: "已退出登录",
          duration: 3000,
        });
      } else {
        notification.error({
          content: "请重新登录",
          duration: 3000,
        });
      }
    } catch (error) {
      notification.error({
        content: "请重新登录",
        duration: 3000,
      });
    }
  }
  router.push({ name: "login" });
};
</script>
