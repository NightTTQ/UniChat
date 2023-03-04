<template>
  <div class="bubble-wrapper" :class="isUserSend ? 'reverse' : ''" ref="bubble">
    <div v-if="!isUserSend" class="avatar">
      <img
        class="avatar-img"
        draggable="false"
        :src="senderAvatar"
        alt="avatar"
      />
    </div>
    <div class="bubble">
      <div class="first-line">
        <div class="sender-text">{{ senderName }}</div>
        <div class="time-text">{{ format(message.createdAt, "HH:mm") }}</div>
      </div>
      <div v-if="message.msgType === 1" class="content-text">
        {{ message.content }}
      </div>
    </div>
    <div class="icons" v-if="isUserSend">
      <n-spin v-if="message.status === 1" class="loading" />
      <Checkmark v-else class="check" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { Checkmark } from "@vicons/ionicons5";
import { format } from "date-fns";
import { LocalMessage } from "@/types";

const bubble = ref<Element>();

const props = defineProps<{
  message: LocalMessage;
  /** @desc 发送者头像 */
  senderAvatar: string;
  /** @desc 发送者名称 */
  senderName: string;
  /** @desc 此消息是否是用户自己发送的 */
  isUserSend: boolean;
  /** @desc 父级框 */
  container?: Element;
}>();

nextTick(() => {
  if (props.isUserSend) {
    console.log("自己的消息滑动")
    document.querySelector(".content")?.scrollIntoView(false);
  } else {
    console.log("别人新消息不滑")
  }
});

const emit = defineEmits<{
  (event: "visible", message: LocalMessage): void;
  (event: "invisible", message: LocalMessage): void;
}>();

// 监听消息是否进入可视区域
const observer = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      emit("visible", props.message);
    } else {
      emit("invisible", props.message);
    }
  },
  { threshold: 0.5, root: props.container }
);
// Dom渲染完成后，开始监听
nextTick(() => {
  if (bubble.value) {
    observer.observe(bubble.value);
  }
});
</script>
<style lang="scss" scoped>
.bubble-wrapper {
  display: flex;
  column-gap: 1em;
  .avatar {
    user-select: none;
    .avatar-img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  }
  .bubble {
    display: flex;
    flex-direction: column;
    background-color: var(--tag-color);
    padding: 1em;
    border-radius: 1em;
    .first-line {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      column-gap: 1em;
      .sender-text {
        font-weight: bold;
      }
      .time-text {
        font-size: small;
        opacity: 0.5;
      }
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
