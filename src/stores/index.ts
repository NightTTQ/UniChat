import { defineStore } from "pinia";

import { UserInfo } from "@/types";

const useUserStore = defineStore({
  id: "user",
  state: (): { userInfo: UserInfo } => {
    return {
      userInfo: {
        username: null,
        password: null,
        avatar: null,
        createdAt: null,
        updatedAt: null,
      },
    };
  },
  getters: {},
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
  },
});

export { useUserStore };
