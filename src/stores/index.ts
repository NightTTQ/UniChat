import { defineStore } from "pinia";

import { UserInfo, Contact, Group, Chat } from "@/types";
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

const useChatsStore = defineStore({
  id: "chats",
  state: (): { chats: Chat[] } => {
    return { chats: [] };
  },
  getters: {},
  actions: {
    addChat(item: Chat) {
      const index = this.chats.findIndex(
        (chat) => chat.roomId === item.roomId && chat.type === chat.type
      );
      if (index !== -1) {
        this.chats[index] = item;
      } else {
        this.chats.push(item);
      }
    },
  },
  persist: {
    key: "chats",
    storage: window.localStorage,
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
  useCurrentContactStore,
};
