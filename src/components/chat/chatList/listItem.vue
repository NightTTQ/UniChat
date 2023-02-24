<template>
  <div>
    <div class="user-panel">
      <img :src="userInfo.avatarUrl" alt="error" />
      <n-h2>{{ userInfo.username }}</n-h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

// default
const userInfo = reactive({
  avatarUrl:
    "https://ts2.cn.mm.bing.net/th?id=OIP-C.ei7qo_LySD7h3QNJaHJO-AAAAA&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.4&pid=3.1&rm=2",
  username: "user",
});
</script>

<style scoped>
.user-panel {
  height: 80px;
  display: flex;
  box-sizing: content-box;
  align-items: center;
}

.user-panel img {
  height: 40px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
