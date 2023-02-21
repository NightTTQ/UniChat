import { defineStore } from "pinia";

import { UserInfo } from "@/types";

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

export { useUserStore };
