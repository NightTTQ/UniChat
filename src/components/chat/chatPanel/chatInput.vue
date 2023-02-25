<template>
  <div class="input-wrapper">
    <n-input
      v-model:value="text"
      type="textarea"
      :autosize="{
        minRows: 1,
        maxRows: 12,
      }"
      placeholder=""
    />
    <div v-show="text !== ''">Send</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
</script>

<style scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 1em;
  background-color: var(--n-color);
  padding: 1em;
}
</style>
