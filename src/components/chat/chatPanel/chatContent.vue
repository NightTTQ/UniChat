<template>
  <div class="content-wrapper">
    <div class="content">
      <div v-for="message of messages">
        <Bubble
          :message="message"
          :is-user-send="userInfo._id === message.fromId"
          :sender-avatar="users[message.fromId]?.avatar || ''"
          :sender-name="users[message.fromId]?.username || message.fromId"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from "vue";
import { storeToRefs } from "pinia";

import Bubble from "./messageBubble.vue";
import { Chat, LocalMessage } from "@/types";
import { useUserStore, useUsersStore } from "@/stores";
import { getMessages } from "@/services/messageService";

const userInfo = storeToRefs(useUserStore()).userInfo;

const usersStore = useUsersStore();
const users = storeToRefs(usersStore).users;
const messages = ref<LocalMessage[]>([]);
const messageLoading = ref(false);

const props = defineProps<{ chat: Chat }>();

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
    // 强制全量更新，不排序
    messages.value = newMessages;
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
  async (chat) => {
    if (chat.lastSeenMessageId) {
      // 有上次阅读记录，则从阅读记录处读取上下的消息记录
      const beforeMessages = await getMessages(
        chat.roomId,
        chat.type,
        -1,
        10,
        chat.lastSeenMessageId
      );
      updateMessages(beforeMessages, true, true);
      // updateMessages(beforeMessages, true, false);
      const afterMessages = await getMessages(
        chat.roomId,
        chat.type,
        1,
        20,
        chat.lastSeenMessageId
      );
      updateMessages(afterMessages, false, false);
    } else {
      // 没有上次阅读记录，说明从未阅读过，直接获取全部消息
      const message = await getMessages(chat.roomId, chat.type, 1, 20);
      updateMessages(message, false, true);
      // updateMessages(message, false, false);
    }
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
    padding: 1em;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    row-gap: 1em;
  }
}
</style>
