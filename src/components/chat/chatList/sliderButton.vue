<template>
  <div class="slider-wrapper">
    <div v-for="item in callbackInfo" :key="item.labelname" class="slider-item">
      <button @click="item.callback">{{ item.labelname }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CallbackInfo } from "./type";

defineProps<{
  callbackInfo: CallbackInfo[];
}>();
</script>

<style scoped>
.slider-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: inherit;
}

.slider-item {
  flex: 1;
  height: 100%;
  background-color: inherit;
  justify-content: center;
  display: flex;
}

.slider-item button {
  border: 0;
  height: 50px;
  color: white;
  background-color: inherit;
  font-size: 15px;
  cursor: pointer;
  border-bottom:  2px solid blue;
}
</style>
