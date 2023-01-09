<template></template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useNotification } from "naive-ui";
import router from "@/router";
import userService from "@/services/userService";

const notification = useNotification();

onMounted(() => {
  doLogout();
});

const doLogout = async () => {
  const result = await userService.logout();
  if (result) {
    notification.success({
      content: "已退出登录",
      duration: 3000,
      keepAliveOnHover: true,
    });
    router.push({ name: "login" });
  } else {
    notification.error({
      content: "退出登录失败",
      duration: 3000,
      keepAliveOnHover: true,
    });
  }
};
</script>
