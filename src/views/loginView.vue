<template>
  <div class="wrapper">
    <div class="login"><LoginCard /></div>
  </div>
</template>
<script setup lang="ts">
import LoginCard from "@/components/login/loginCard.vue";
</script>
<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
