<template>
  <div class="wrapper">
    <n-button type="primary" @click="goLogin">
      登录<n-icon class="icon"><ArrowForward /> </n-icon>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ArrowForward } from "@vicons/ionicons5";
import router from "@/router";

const goLogin = () => {
  router.push({ name: "login" });
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    margin-left: 0.5em;
  }
}
</style>
