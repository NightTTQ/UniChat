<template>
  <div class="chat-wrapper">
    <ChatContent />
    <ChatInput />
  </div>
</template>

<script setup lang="ts">
import ChatContent from "./chatContent.vue";
import ChatInput from "./chatInput.vue";
</script>

<style scoped>
.chat-wrapper {
  height: 100%;
  margin: 0;
  border: 0;
  width: 100%;
  position: relative;
}
</style>
