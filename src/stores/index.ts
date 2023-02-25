import { defineStore } from "pinia";

import { UserInfo, Contact, Group, Chat } from "@/types";

const useUserStore = defineStore({
  id: "user",
  state: (): { userInfo: UserInfo; sessionID?: string } => {
    return {
      userInfo: {
        username: undefined,
        password: undefined,
        avatar: undefined,
        createdAt: undefined,
        updatedAt: undefined,
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

export { useUserStore, useContactsStore, useGroupsStore, useChatsStore };
