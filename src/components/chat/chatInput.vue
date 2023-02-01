<template>
  <div style="height: 40%;">
    <textarea :value="message">
    </textarea>
    <!-- <button style="position: absolute; bottom: 10px">发送</button> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const message = ref("");

const sendMessage = () => {
  // unimplemented
};
</script>

<style scoped>
textarea {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  resize: none;
  text-align: left;
  font: 16px 宋体;
  border: 0;
  outline-color: red;
}

</style>
