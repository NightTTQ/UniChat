<template>
  <n-popover trigger="click" placement="left-end" :show-arrow="false">
    <template #trigger>
      <n-icon size="24" class="icon">
        <Menu />
      </n-icon>
    </template>
    <div class="more-wrapper">
      <div class="logout">
        <n-button type="text" @click="handleLogout">退出登录</n-button>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { Menu } from "@vicons/ionicons5";

import router from "@/router";

const handleLogout = () => {
  router.push({ name: "logout" });
};
</script>

<style scoped lang="scss">
.icon {
  cursor: pointer;
  &:hover {
    color: var(--primary-color);
  }
}
.more-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 0.3em;
}
</style>
