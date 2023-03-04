<template>
  <div class="bubble-wrapper" :class="isUserSend ? 'reverse' : ''">
    <div v-if="!isUserSend" class="avatar">
      <img
        class="avatar-img"
        draggable="false"
        :src="senderAvatar"
        alt="avatar"
      />
    </div>
    <div class="bubble">
      <div class="sender-text">{{ senderName }}</div>
      <div class="content">{{ message.content }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick } from "vue";
import { LocalMessage } from "@/types";

const props = defineProps<{
  message: LocalMessage;
  /** @desc 发送者头像 */
  senderAvatar: string;
  /** @desc 发送者名称 */
  senderName: string;
  /** @desc 此消息是否是用户自己发送的 */
  isUserSend: boolean;
}>();

nextTick(() => {
  document.querySelector(".content")?.scrollIntoView(false);
});
</script>
<style lang="scss" scoped>
.bubble-wrapper {
  display: flex;
  column-gap: 1em;
  .avatar {
    .avatar-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  }
  .bubble {
    background-color: var(--tag-color);
    padding: 1em;
    border-radius: 1em;
    .sender-text {
      font-weight: bold;
    }
    .content {
    }
  }
}
.bubble-wrapper.reverse {
  flex-direction: row-reverse;
}
</style>
