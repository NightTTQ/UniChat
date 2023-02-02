<template>
  <div class="wrapper" id="contact">
    <div class="left">
      <div class="left-title">Contact Info</div>
      <div class="left-item">
        <div class="icon">
          <n-icon size="20"><HomeOutline /> </n-icon>
          <span>Address</span>
        </div>
        <div class="content">San Francisco, CA 12345</div>
      </div>
      <div class="left-item">
        <div class="icon">
          <n-icon size="20"><CallOutline /> </n-icon>
          <span> Phone</span>
        </div>
        <div class="content">+1 123 456 1234</div>
      </div>
      <div class="left-item">
        <div class="icon">
          <n-icon size="20"><MailOutline /> </n-icon>
          <span>Email</span>
        </div>
        <div class="content">info@UniChat.com</div>
      </div>
    </div>
    <div class="main">
      <div class="text">
        <h2>用UniChat，让直播更有价值</h2>
        <p>搭建私域流量专属直播平台，高效实现直播聊天互动</p>
      </div>
    </div>
    <div class="right">
      <n-button
        type="info"
        size="large"
        class="button"
        @click="$router.push({ path: '/login' })"
      >
        <span>立即体验</span>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { CallOutline, HomeOutline, MailOutline } from "@vicons/ionicons5";
</script>

<style scoped lang="scss">
.wrapper {
  height: 260px;
  font-size: 24px;
  color: #fff;
  // background: url(https://static1.weizan.cn/zhibo/static/img/vzan/pc/index_image/block8.png)
  background: url(http://cdn.cunese.com.cn/FlRLZ6sTeWnkizPa4oVYe9tiCD33)
    no-repeat;
  background-size: cover;
  display: grid;
  grid-template-columns: 18% 62% 20%;
  .left {
    .left-title {
      font-size: 1em;
      margin-top: 0.5em;
      margin-bottom: 1em;
      margin-left: 3em;
    }
    .left-item {
      font-size: 0.5em;
      margin-top: 0.6em;
      margin-left: 6.5em;
      .icon {
        display: flex;
        span {
          margin-left: 1em;
        }
      }
      .content {
        margin-top: 1em;
      }
    }
  }
  .main {
    .text {
      margin-left: 5em;
      margin-top: 3em;
    }
  }
  .right {
    display: flex;
    margin: auto 0;
    .button {
      width: 180px;
      height: 60px;
    }
    span {
      font-size: 1.5em;
    }
  }
}
</style>
