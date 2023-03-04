<template>
  <div class="content-wrapper">
    <n-scrollbar>
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
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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

const updateMessages = async (
  newMessages: LocalMessage[],
  reverse: boolean = false,
  fullUpdate: boolean = false
) => {
  messageLoading.value = true;

  for (const message of newMessages) {
    await usersStore.getUserById(message.fromId);
  }
  if (fullUpdate) messages.value = newMessages;
  else if (reverse) messages.value.unshift(...newMessages);
  else messages.value.push(...newMessages);
  messageLoading.value = false;
};

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
      updateMessages(afterMessages, false, false)
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
