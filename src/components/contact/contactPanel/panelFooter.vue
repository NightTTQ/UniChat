<template>
  <n-layout-footer>
    <footer>
      <n-button @click="share" type="default">分享</n-button>
      <n-button @click="toRoom" type="info">发消息</n-button>
    </footer>
  </n-layout-footer>
</template>

<script setup lang="ts">
import router from "@/router";

const share = () => {

}

const toRoom = () => {

}
</script>

<style scoped lang="scss">
footer {
  display: flex;
  justify-content: space-around;

  button {
    width: 40%;
  }
}
</style>
