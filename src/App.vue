<template>
  <n-config-provider
    :theme="globalTheme.useDarkTheme === true ? darkTheme : null"
  >
    <n-el tag="div">
      <n-notification-provider>
        <!-- <n-button @click="useDarkTheme = !useDarkTheme"> 切换主题 </n-button> -->
        <router-view />
      </n-notification-provider>
      <n-global-style />
    </n-el>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { darkTheme, useOsTheme } from "naive-ui";

import { useGlobalStore } from "@/stores";

const globalTheme = storeToRefs(useGlobalStore()).theme;
if (globalTheme.value.useDarkTheme === undefined) {
  globalTheme.value.useDarkTheme = useOsTheme().value === "dark";
}
</script>
<style>
* {
  border: 0;
  box-sizing: border-box;
  margin: 0;
}
html body {
  margin: 0;
  border: 0;
}
</style>
