<template>
  <n-popover trigger="click" placement="top-start" :show-arrow="false">
    <template #trigger>
      <div class="icon">
        <n-icon size="24" class="icon">
          <Menu />
        </n-icon>
      </div>
    </template>
    <div class="more-wrapper">
      <div class="logout">
        <n-button type="text" @click="handleLogout">退出登录</n-button>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Menu } from "@vicons/ionicons5";

import router from "@/router";

const handleLogout = () => {
  router.push({ name: "logout" });
};
</script>

<style scoped lang="scss">
.more-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 0.3em;
}
</style>
