import { defineStore } from "pinia";

import { UserInfo, Contact, Group, Chat, LocalMessage } from "@/types";
import { serializeChat, deserializeChat } from "@/utils/serializer";
import { info } from "@/services/userService";

const useUserStore = defineStore({
  id: "user",
  state: (): { userInfo: UserInfo; sessionID?: string } => {
    return {
      userInfo: {
        _id: "",
        username: undefined,
        avatar: undefined,
      },
      sessionID: undefined,
    };
  },
  getters: {},
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
    setSessionID(sessionID: string) {
      this.sessionID = sessionID;
    },
  },
  persist: {
    key: "user",
    storage: window.localStorage,
  },
});

const useContactsStore = defineStore({
  id: "contacts",
  state: (): { contacts: Record<string, Contact> } => {
    return { contacts: {} };
  },
  getters: {},
  actions: {
    addContact(item: Contact) {
      this.contacts[item._id] = {
        _id: item._id,
        username: item.username,
        avatar: item.avatar,
        roomId: item.roomId,
      };
    },
    removeContact(item: Contact) {
      delete this.contacts[item._id];
    },
  },
  persist: {
    key: "contacts",
    storage: window.localStorage,
  },
});

const useGroupsStore = defineStore({
  id: "groups",
  state: (): { groups: Record<string, Group> } => {
    return { groups: {} };
  },
  getters: {},
  actions: {
    addGroup(item: Group) {
      this.groups[item._id] = {
        _id: item._id,
        groupAvatar: item.groupAvatar,
        groupName: item.groupName,
        groupInfo: item.groupInfo,
        user: item.user,
        admin: item.admin,
        owner: item.owner,
      };
    },
    removeGroup(item: Group) {
      delete this.groups[item._id];
    },
  },
  persist: {
    key: "groups",
    storage: window.localStorage,
  },
});

/** @desc 会话列表 */
const useChatsStore = defineStore({
  id: "chats",
  state: (): { chats: Chat[] } => {
    return { chats: [] };
  },
  getters: {},
  actions: {
    addChat(item: Chat) {
      if (item.lastMessage) {
        item.lastMessage.createdAt = new Date(item.lastMessage.createdAt);
        item.lastMessage.updatedAt = new Date(item.lastMessage.updatedAt);
      }
      if (item.lastSeenReadTime) {
        item.lastSeenReadTime = new Date(item.lastSeenReadTime);
      }
      const index = this.chats.findIndex(
        (chat) => chat.roomId === item.roomId && chat.type === chat.type
      );
      if (index !== -1) {
        // 本地有会话缓存，需要判断是否有本地会话未发送完成的信息。TODO：支持重发
        const existMessage = this.chats[index].lastMessage;
        if (existMessage?.status === 2) item.lastMessage = existMessage;
        this.chats[index] = item;
      } else {
        this.chats.push(item);
      }
    },
    /**
     * @desc 更新会话的最后一条消息。用于列表预览
     * @param chat 需要更新的会话。只包含roomId和type即可。
     * @param message 最新的最后一条消息。若原消息比新消息更新则不会替换
     */
    updateLastMessage(chat: Chat, message: LocalMessage) {
      const room = this.chats.find(
        (item) => item.roomId === chat.roomId && item.type === chat.type
      );
      if (room) {
        if (room.lastMessage) {
          if (message.status === 1) {
            // 新消息是在发送中的消息，优先级最高直接替换
            room.lastMessage = message;
          } else if (room.lastMessage.status === 1) {
            // 新消息是服务器推送，同时会话有正在发送的消息，不替换
          } else {
            // 会话没有正在发送的消息，新消息正常替换
            if (room.lastMessage.createdAt < message.createdAt)
              room.lastMessage = message;
          }
        } else {
          // 会话没有最后一条消息，直接将此消息作为最后一条消息
          room.lastMessage = message;
        }
      }
    },
  },
  persist: {
    key: "chats",
    storage: window.localStorage,
    serializer: {
      serialize: serializeChat,
      deserialize: deserializeChat,
    },
  },
});

/**
 * @desc 请使用getUserById方法用用户id获取用户信息，如果不存在会自动向服务器获取。
 * 也能够使用addUser方法强制新增用户信息。
 */
const useUsersStore = defineStore({
  id: "users",
  state: (): { users: Record<string, UserInfo> } => {
    return { users: {} };
  },
  getters: {},
  actions: {
    addUser(userInfo: UserInfo) {
      this.users[userInfo._id] = userInfo;
    },
    async getUserById(userId: string) {
      if (this.users[userId]) {
        return this.users[userId];
      } else {
        const sessionID = useUserStore().sessionID;
        const res = await info(sessionID!, userId);
        if (res.code === 200) {
          this.addUser(res.data);
          return this.users[userId];
        } else {
          return null;
        }
      }
    },
  },
  persist: {
    key: "users",
    storage: window.localStorage,
    // serializer:{
    //   deserialize:"",
    //   serialize:
    // }
  },
});

/**
 * @desc 全局状态
 */
const useGlobalStore = defineStore({
  id: "global",
  state: (): {
    theme: { useDarkTheme?: boolean };
    callModal: {
      show: boolean;
      roomId: string;
      userId: string;
      status: -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;
      callConfig: { method: string; roomToken: string };
      incomeCallBack: (res: { accept: boolean }) => void;
    };
  } => ({
    theme: { useDarkTheme: undefined },
    callModal: {
      show: false,
      roomId: "",
      userId: "",
      /** @desc -1呼入等待0正在呼叫1正在振铃2正在连接3通话中4通话结束5无人接听6拒绝通话 */
      status: 0,
      callConfig: { method: "", roomToken: "" },
      incomeCallBack: (res: { accept: boolean }): void => {},
    },
  }),
  actions: {
    toggleCallModal() {
      this.callModal.show = !this.callModal.show;
    },
  },
});

// 当前联系人面板信息
const useCurrentContactStore = defineStore({
  id: "currentContact",
  state: () => ({
    _id: "",
  }),
  actions: {
    toggleId(_id: string) {
      this._id = _id;
    },
  },
});

export {
  useUserStore,
  useContactsStore,
  useGroupsStore,
  useChatsStore,
  useUsersStore,
  useGlobalStore,
  useCurrentContactStore,
};
