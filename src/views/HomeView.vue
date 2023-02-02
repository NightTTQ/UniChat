<template>
  <div class="wrapper">
    <div class="header"><HomeHeader /></div>
    <div class="container"><HomeContent /></div>
    <div class="footer"><HomeFooter /></div>
    <n-back-top :right="40" />
  </div>
</template>

<script setup lang="ts">
import HomeHeader from "@/components/home/homeHeader.vue";
import HomeContent from "@/components/home/homeContent.vue";
import HomeFooter from "@/components/home/homeFooter.vue";
import router from "@/router";
</script>

<style scoped lang="scss">
.wrapper {
  .header {
    position: sticky;
    top: 0;
  }
}
</style>
