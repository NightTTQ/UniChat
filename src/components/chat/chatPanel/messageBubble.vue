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
      <div v-if="message.msgType === 1" class="content-text">
        {{ message.content }}
      </div>
    </div>
    <div class="icons">
      <n-spin v-if="message.status === 1" class="loading" />
      <Checkmark v-else class="check" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Checkmark } from "@vicons/ionicons5";
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
    .content-text {
      white-space: pre-wrap;
    }
  }
  .icons {
    align-self: flex-end;
    .loading {
      width: 24px;
      height: 24px;
    }
    .check {
      width: 24px;
      height: 24px;
      color: var(--primary-color);
    }
  }
}
.bubble-wrapper.reverse {
  flex-direction: row-reverse;
}
</style>
