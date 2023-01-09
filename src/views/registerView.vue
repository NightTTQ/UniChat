<template>
  <div class="wrapper">
    <div class="login"><RegisterCard /></div>
  </div>
</template>
<script setup lang="ts">
import RegisterCard from "@/components/register/registerCard.vue";
</script>
<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
