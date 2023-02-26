<template>
  <div class="content-wrapper">
    <div class="content-header">
      <h4>{{ props.name }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ name: string }>();
</script>

<style scoped>
.content-wrapper {
  flex: 1;
}
.content-header {
  display: flex;
  height: 64px;
  padding: 1em;
  text-align: center;
  background-color: rgb(24, 24, 28);
}
</style>
