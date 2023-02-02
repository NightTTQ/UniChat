import { defineStore } from "pinia";

import { UserInfo } from "@/types";

const useUserStore = defineStore({
  id: "user",
  state: (): { userInfo: UserInfo; sessionID: string | null } => {
    return {
      userInfo: {
        username: null,
        password: null,
        avatar: null,
        createdAt: null,
        updatedAt: null,
      },
      sessionID: null,
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
