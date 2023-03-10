<template>
  <div class="chat-wrapper">
    <!-- 顶部常驻栏 -->
    <PanelBar :name="name" :chat="props.chat" @call="call" />
    <!-- 消息内容显示区 -->
    <ChatContent :chat="props.chat" ref="contentRef" />
    <!-- 消息输入发送区 -->
    <ChatInput @send="sendNewMessage" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { storeToRefs } from "pinia";

import {
  useUserStore,
  useContactsStore,
  useGroupsStore,
  useChatsStore,
  useGlobalStore,
} from "@/stores";
import { Chat, LocalMessage } from "@/types";
import { sendMessage } from "@/services/chatService";
import { messagePersistence } from "@/services/messageService";
import PanelBar from "./chatPanelBar.vue";
import ChatContent from "./chatContent.vue";
import ChatInput from "./chatInput.vue";

const props = defineProps<{ chat: Chat }>();

const userStore = useUserStore();
const chatsStore = useChatsStore();
const contacts = storeToRefs(useContactsStore()).contacts;
const groups = storeToRefs(useGroupsStore()).groups;
const globalStore = useGlobalStore();
const callModalVars = storeToRefs(useGlobalStore()).callModal;
const contentRef = ref<InstanceType<typeof ChatContent>>();

/**
 * @desc 主动发起通话，打开通话面板
 */
const call = () => {
  if (props.chat.roomId && props.chat.userId) {
    callModalVars.value.roomId = props.chat.roomId;
    callModalVars.value.userId = props.chat.userId;
    callModalVars.value.status = 0;
    globalStore.toggleCallModal();
  }
};

const name = computed(() => {
  if (props.chat.type === 1) {
    return contacts.value[props.chat.userId!].username;
  }
  if (props.chat.type === 2) {
    return groups.value[props.chat.roomId].groupName;
  }
  return "";
});

// 发送新消息
const sendNewMessage = async (message: string) => {
  const tmpMessage: LocalMessage = {
    _id: "",
    roomId: props.chat.roomId,
    fromId: userStore.userInfo._id,
    msgType: 1,
    content: message,
    edited: false,
    deleted: false,
    status: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  // 更新会话信息，展示正在发送的最新消息
  chatsStore.updateLastMessage(props.chat, tmpMessage);
  // 将正在发送的消息放入展示数组
  contentRef.value!.updateMessages([tmpMessage], false, false);
  sendMessage(tmpMessage, props.chat.type)
    .then(async (message) => {
      // 发送成功，根据服务器返回进行本地序列化
      const unlinkMessages = [message];
      // 已序列化的消息
      const localMessages = await messagePersistence(
        unlinkMessages,
        props.chat.type
      );
      // 将发送中的消息替换掉
      contentRef.value!.messages[
        contentRef.value!.messages.indexOf(tmpMessage)
      ] = localMessages[localMessages.length - 1];

      tmpMessage.status = 0;
      chatsStore.updateLastMessage(
        props.chat,
        localMessages[localMessages.length - 1]
      );
    })
    .catch((err) => {
      // 发生错误
      console.log(err);
      tmpMessage.status = 2;
      // 5s后将临时消息删除。TODO：支持重新发送功能
      setTimeout(() => {
        contentRef.value?.messages.slice(
          contentRef.value.messages.indexOf(tmpMessage),
          1
        );
      }, 5000);
    });
};

defineExpose({
  /**
   * @desc 更新展示消息列表。建议更新列表为有序状态。
   * 只有面板展示的房间与新消息所属房间一致时才会更新。
   * @param newMessages 需要加入展示列表的消息
   * @param reverse 是否将新列表加在原列表前面
   * @param fullUpdate 是否为全量更新
   */
  updateMessages: (
    newMessages: LocalMessage[],
    reverse: boolean = false,
    fullUpdate: boolean = false
  ) => contentRef.value?.updateMessages(newMessages, reverse, fullUpdate),
});
</script>

<style scoped>
.chat-wrapper {
  display: flex;
  flex: 1;
  max-height: 100vh;
  flex-direction: column;
  position: relative;
}
</style>
