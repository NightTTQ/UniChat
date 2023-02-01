<template>
  <div class="chat-display">
    <div class="chat-display-header">
        <span style="text-align:center">头部导航条</span >
    </div>
    <div class="chat-content"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>

<style scoped>
.chat-display {
    height: 60%;
}

.chat-display-header {
    display: flex;
    height: 40px;
    padding: 10px;
    text-align: center;
    border-bottom: 1px red;
}
</style>
