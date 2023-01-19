<template>
  <div class="wrapper">
    <div class="logo">
      <div class="img">
        <n-image
          width="40"
          src="http://cdn.cunese.com.cn/Fp0oHlNMGOoQheVqw4knPJm5Dk0Q"
        />
      </div>
      <div class="text"><span>UniChat</span></div>
    </div>
    <div class="nav">
      <div class="nav-item"><a href="#features">Features</a></div>
      <div class="nav-item"><a href="#about">About</a></div>
      <div class="nav-item"><a href="#contact">Contact</a></div>
      <div class="nav-item">
        <a @click="$router.push({ path: '/login' })">Login</a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  background-color: white;
  .logo {
    display: flex;
    height: 5em;
    margin-left: 5em;
    margin-top: 0.2em;
    .img {
      margin: auto;
    }
    .text {
      margin: auto;
      font-size: 25px;
      font-weight: 600;
      margin-left: 0.2em;
    }
  }
  .nav {
    right: 0;
    margin-left: 50em;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    justify-content: center;
    align-items: center;
    gap: 4em;
    .nav-item {
      a {
        font-family: "Lato", sans-serif;
        font-size: 15px;
        font-weight: 400;
        color: #555;
      }
    }
  }
}
</style>
