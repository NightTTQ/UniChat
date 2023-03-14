<template>
  <div class="content-wrapper">
    <n-scrollbar>
      <div class="content" ref="contentRef">
        <div v-for="(message, index) of messages" ref="bubblesRef">
          <Bubble
            v-intersect="observer"
            :key="message._id"
            :data-index="index"
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
import { ref, watch } from "vue";
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
const messageLoading = ref(false);
const contentRef = ref<Element>();
const bubblesRef = ref<Element[]>([]);
const lastTime = ref<Date>(new Date(0));

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

const observer = new IntersectionObserver(
  (entries) => {
    // 遍历所有被观察的元素，对于在视口内的元素，更新已读时间
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const messageEl = entry.target;
        updateReadTime(
          messages.value[Number(messageEl.getAttribute("data-index"))]
        );
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
  messageLoading.value = true;
  for (const message of newMessages) {
    // 新消息中的发送用户信息在本地缺失，先向服务器查询用户信息
    if (!message.status) await usersStore.getUserById(message.fromId);
  }
  let unOrder = false;
  if (fullUpdate) {
    // 强制全量更新，清空原数组且不排序。
    messages.value.slice(0);
    messages.value.push(...newMessages);
    messageLoading.value = false;
    return;
  } else if (reverse) {
    // 反转更新，将新消息放在数组前
    messages.value.unshift(...newMessages);
    // 合并处数据无序，需要整体排序
    if (
      messages.value.length > newMessages.length &&
      newMessages[newMessages.length - 1].createdAt >
        messages.value[newMessages.length].createdAt
    )
      unOrder = true;
  } else {
    // 合并处数据无序，需要整体排序
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
  messageLoading.value = false;
};

defineExpose({ messages, updateMessages });

watch(
  () => props.chat,
  async (chat, oldChat) => {
    messageLoading.value = true;
    // 切换聊天对象时，清空消息列表和已读时间
    if (chat.roomId !== oldChat?.roomId || chat.type !== oldChat?.type) {
      messages.value.splice(0);
      lastTime.value = new Date(0);
    }
    if (chat.lastSeenMessageId || chat.lastSeenReadTime) {
      // 从阅读记录处读取上下的消息记录
      const beforeMessages = await getMessages(
        chat.roomId,
        chat.type,
        -1,
        10,
        chat.lastSeenMessageId,
        chat.lastSeenReadTime
      );
      const afterMessages = await getMessages(
        chat.roomId,
        chat.type,
        1,
        20,
        chat.lastSeenMessageId,
        chat.lastSeenReadTime
      );
      // 如果服务器返回的下一条消息id和上一条消息相同，需要合并
      if (
        beforeMessages.length &&
        afterMessages.length &&
        beforeMessages[beforeMessages.length - 1]._id === afterMessages[0]._id
      ) {
        afterMessages.shift();
      }
      await updateMessages([...beforeMessages, ...afterMessages], false, true);
    } else {
      // 没有上次阅读记录，说明从未阅读过，直接从服务器从头开始获取消息
      const messages = await getMessages(chat.roomId, chat.type, 1, 20);
      await updateMessages(messages, false, true);
    }
    messageLoading.value = false;
  },
  { immediate: true }
);

// onBeforeMount(async () => {
//   console.log("render");
//   if (props.chat.lastSeenMessageId) {
//     // 有上次阅读记录，则从阅读记录处读取上下的消息记录
//     const beforeMessages = await getMessages(
//       props.chat.roomId,
//       props.chat.type,
//       -1,
//       10,
//       props.chat.lastSeenMessageId
//     );
//     const afterMessages = await getMessages(
//       props.chat.roomId,
//       props.chat.type,
//       1,
//       20,
//       props.chat.lastSeenMessageId
//     );
//     messages.value = [...beforeMessages, ...afterMessages];
//   } else {
//     // 没有上次阅读记录，说明从未阅读过，直接获取全部消息
//     const message = await getMessages(
//       props.chat.roomId,
//       props.chat.type,
//       1,
//       20
//     );
//     messages.value = message;
//   }
// });
</script>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex: 1;
  height: 0;
  flex-direction: column;
  justify-content: end;
  position: relative;
  .content {
    height: 100%;
    padding: 1em;
    display: flex;
    flex-direction: column;
    row-gap: 1em;
    overflow-y: hidden;
  }

  .scroll-bar {
    position: absolute;
    right: 0;
    width: 10px;
    height: 100%;
    border-radius: 2px;
    background-color: white;

    .scroll-thumb {
      width: 10px;

      background-color: aqua;
    }
  }
}
</style>
