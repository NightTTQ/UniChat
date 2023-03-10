import { StateTree } from "pinia";

import { Chat } from "@/types";

/** @desc 反序列化Chat */
function serializeChat(value: StateTree): string {
  // console.log(`正在反序列化${value}`);
  return JSON.stringify(value);
}

/** @desc 序列化Chat */
function deserializeChat(value: string): StateTree {
  // console.log(`正在序列化${value}`);
  const state = JSON.parse(value);
  state.chats = state.chats.map((chat: Chat) => {
    if (chat.lastMessage) {
      chat.lastMessage.createdAt = new Date(chat.lastMessage.createdAt);
      chat.lastMessage.updatedAt = new Date(chat.lastMessage.updatedAt);
    }
    return chat;
  });
  return state;
}

export { deserializeChat, serializeChat };
export default { deserializeChat, serializeChat };
