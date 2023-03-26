<template>
  <div class="content-wrapper">
    <n-scrollbar>
      <div class="content" ref="contentRef">
        <div class="bubbles-wrapper">
          <Bubble
            v-for="message of messages"
            ref="bubblesRef"
            v-intersect="observer"
            :key="message._id"
            :data-id="message._id"
            :message="message"
            :is-user-send="userInfo._id === message.fromId"
            :sender-avatar="users[message.fromId]?.avatar || ''"
            :sender-name="users[message.fromId]?.username || message.fromId"
          />
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { throttle } from "lodash-es";

import Bubble from "./messageBubble.vue";
import { Chat, LocalMessage } from "@/types";
import { useUserStore, useUsersStore } from "@/stores";
import { getMessages } from "@/services/messageService";
import { readMessage } from "@/services/chatService";

const userInfo = storeToRefs(useUserStore()).userInfo;

const usersStore = useUsersStore();
const users = storeToRefs(usersStore).users;
const messages = ref<LocalMessage[]>([]);
const contentRef = ref<Element>();
const bubblesRef = ref<InstanceType<typeof Bubble>[]>([]);
const lastTime = ref<Date>(new Date(0));
const messageLoadStatus = ref({
  loading: { new: false, old: false },
  done: { new: false, old: false },
});

const props = defineProps<{ chat: Chat }>();

// 向服务器更新已读时间（节流函数）
const throttleToServer = throttle(async (message: LocalMessage) => {
  const chat = props.chat;
  const res = await readMessage(
    message.createdAt,
    message.roomId,
    props.chat.type
  );
  // 更新服务器记录的已读时间
  chat.lastSeenReadTime = new Date(res);
}, 1000);
// 更新已读时间
const updateReadTime = (message: LocalMessage) => {
  // 客户端记录的最后阅读消息id立即更新
  props.chat.lastSeenMessageId = message._id;
  // 如果新阅读的消息比记录的最后阅读时间新，更新已读时间
  if (message.createdAt > lastTime.value) {
    lastTime.value = message.createdAt;
    // 如果新阅读的消息比服务器记录的已读时间新，向服务器发送已读时间
    if (
      !props.chat.lastSeenReadTime ||
      lastTime.value > props.chat.lastSeenReadTime
    ) {
      props.chat.unreadCount = Math.max(props.chat.unreadCount - 1, 0);
      throttleToServer(message);
    }
  }
};
// 获取更多消息记录
const getMoreMessages = async (baseMessage: LocalMessage, dir: 1 | -1) => {
  if (dir === 1) {
    // 已经加载到最先消息，不再加载新消息。或正在加载新消息，不再重复加载。
    if (messageLoadStatus.value.loading.new || messageLoadStatus.value.done.new)
      return;
    messageLoadStatus.value.loading.new = true;
    const newMessages = await getMessages(
      props.chat.roomId,
      props.chat.type,
      dir,
      20,
      baseMessage._id
    );
    if (newMessages.length < 20) messageLoadStatus.value.done.new = true;
    updateMessages(newMessages, false, false);
    messageLoadStatus.value.loading.new = false;
  }
  if (dir === -1) {
    // 已经加载到最早消息，不再加载旧消息。或正在加载旧消息，不再重复加载。
    if (messageLoadStatus.value.loading.old || messageLoadStatus.value.done.old)
      return;
    messageLoadStatus.value.loading.old = true;
    const oldMessages = await getMessages(
      props.chat.roomId,
      props.chat.type,
      dir,
      20,
      baseMessage._id
    );
    if (oldMessages.length < 20) messageLoadStatus.value.done.old = true;
    updateMessages(oldMessages, true, false);
    nextTick(() => {
      messageLoadStatus.value.loading.old = false;
    });
  }
};
// 监听消息气泡的可见性变化
const observer = new IntersectionObserver(
  (entries) => {
    // 遍历所有被观察的元素，对于在视口内的元素，更新已读时间
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const messageEl = entry.target;
        const messageId = messageEl.getAttribute("data-id");
        const index = messages.value.findIndex(
          (message) => message._id === messageId
        );
        updateReadTime(messages.value[index]);
        if (index < 3) {
          getMoreMessages(messages.value[0], -1);
        }
        if (index >= messages.value.length - 3) {
          getMoreMessages(messages.value[messages.value.length - 1], 1);
        }
      }
    }
  },
  { threshold: 0.5, root: contentRef.value }
);
/**
 * @desc 更新展示消息列表。建议更新列表为有序状态
 * @param newMessages 需要加入展示列表的消息
 * @param reverse 是否将新列表加在原列表前面
 * @param fullUpdate 是否为全量更新
 */
const updateMessages = async (
  newMessages: LocalMessage[],
  reverse: boolean = false,
  fullUpdate: boolean = false
) => {
  if (!newMessages.length) return;
  for (const message of newMessages) {
    // 新消息中的发送用户信息在本地缺失，先向服务器查询用户信息
    if (!message.status) await usersStore.getUserById(message.fromId);
  }
  let unOrder = false;
  if (fullUpdate) {
    // 强制全量更新，清空原数组且不排序。
    messages.value.slice(0);
    messages.value.push(...newMessages);
    return;
  } else if (reverse) {
    // 反转更新，将新消息放在数组前
    // 如果新消息的最后一条与原消息的第一条重复，删除新消息的最后一条
    if (newMessages[newMessages.length - 1]._id === messages.value[0]._id)
      newMessages.pop();
    messages.value.unshift(...newMessages);
    // 合并处数据无序，需要整体排序
    if (
      newMessages.length &&
      messages.value.length > newMessages.length &&
      newMessages[newMessages.length - 1].createdAt >
        messages.value[newMessages.length].createdAt
    )
      unOrder = true;
  } else {
    // 正常更新，将新消息放在数组后
    // 如果新消息的最后一条与原消息的最后一条重复，删除新消息的最后一条
    if (newMessages[0]._id === messages.value[messages.value.length - 1]._id)
      newMessages.shift();
    // 若合并处数据无序，需要整体排序
    if (
      newMessages.length &&
      messages.value.length &&
      messages.value[messages.value.length - 1].createdAt >
        newMessages[0].createdAt
    )
      unOrder = true;
    // 正常更新。将新消息放在数组后
    messages.value.push(...newMessages);
  }
  if (unOrder) {
    messages.value.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
  }
};

const init = async () => {
  if (props.chat.lastSeenMessageId || props.chat.lastSeenReadTime) {
    // 从阅读记录处读取上下的消息记录
    const beforeMessages = await getMessages(
      props.chat.roomId,
      props.chat.type,
      -1,
      20,
      props.chat.lastSeenMessageId,
      props.chat.lastSeenReadTime
    );
    const afterMessages = await getMessages(
      props.chat.roomId,
      props.chat.type,
      1,
      20,
      props.chat.lastSeenMessageId,
      props.chat.lastSeenReadTime
    );
    // 如果服务器返回的下一条消息id和上一条消息相同，需要合并
    if (
      beforeMessages.length &&
      afterMessages.length &&
      beforeMessages[beforeMessages.length - 1]._id === afterMessages[0]._id
    ) {
      afterMessages.shift();
    }
    messageLoadStatus.value.loading.old = true;
    await updateMessages([...beforeMessages, ...afterMessages], false, true);
    if (afterMessages.length) {
      // 有未读消息，滚动到上次阅读记录处
      nextTick(() => {
        bubblesRef.value
          .find((item) => {
            return item.message._id === afterMessages[0]._id;
          })
          ?.bubble?.scrollIntoView();
        messageLoadStatus.value.loading.old = false;
      });
    }
  } else {
    // 没有上次阅读记录，说明从未阅读过，直接从服务器从头开始获取消息
    const messages = await getMessages(
      props.chat.roomId,
      props.chat.type,
      1,
      20
    );
    await updateMessages(messages, false, true);
  }
};
defineExpose({ messages, updateMessages });
init();
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex: 1;
  height: 0;
  flex-direction: column;
  position: relative;
  .content {
    overflow-y: auto;
    height: 100%;
    padding: 1em;
    display: flex;
    flex-direction: column;
    .bubbles-wrapper {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
    }
  }
}
</style>
