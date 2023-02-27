<template>
  <div class="content-wrapper">
    <div class="content">
      <div class="">
        <div v-for="message of messages">
          <br />
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from "vue";

import { Chat, LocalMessage } from "@/types";
import { getMessages } from "@/services/messageService";

const messages = ref<LocalMessage[]>([]);

const props = defineProps<{ chat: Chat }>();

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
      const afterMessages = await getMessages(
        chat.roomId,
        chat.type,
        1,
        20,
        chat.lastSeenMessageId
      );
      messages.value = [...beforeMessages, ...afterMessages];
    } else {
      // 没有上次阅读记录，说明从未阅读过，直接获取全部消息
      const message = await getMessages(chat.roomId, chat.type, 1, 20);
      messages.value = message;
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
  flex-direction: column;
  justify-content: end;
  position: relative;
  .content {
    display: flex;
    flex-direction: column;
  }
}
</style>
