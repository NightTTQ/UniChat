<template>
  <div class="bar-wrapper">
    <div class="bar-header">
      <h4>{{ props.name }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ name: string }>();
</script>

<style lang="scss" scoped>
.bar-wrapper {
  .bar-header {
    display: flex;
    height: 64px;
    padding: 1em;
    text-align: center;
    background-color: rgb(24, 24, 28);
  }
}
</style>
