<template>
  <n-config-provider :theme="useDarkTheme === true ? darkTheme : null">
    <n-notification-provider>
      <!-- <n-button @click="useDarkTheme = !useDarkTheme"> 切换主题 </n-button> -->
      <router-view />
    </n-notification-provider>
    <n-global-style />
  </n-config-provider>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { darkTheme, useOsTheme } from "naive-ui";

const useDarkTheme = ref(useOsTheme().value === "dark" ? true : false);
</script>
<style scoped>
* {
  border: 0;
  box-sizing: border-box;
  margin: 0;
  border: 0;
}

html body {
  margin: 0;
  border: 0;
}
</style>
