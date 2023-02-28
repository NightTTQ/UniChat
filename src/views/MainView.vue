<template>
  <div class="wrapper">
    <n-layout position="absolute" has-sider>
      <n-layout-sider
        content-style="padding:32px 0px"
        collapse-mode="width"
        width="64px"
      >
        <div class="sider-wrapper">
          <div class="sider-item">
            <div class="logo">UniChat</div>
            <img
              class="avatar"
              draggable="false"
              :src="userInfo?.avatar"
              alt="Avatar"
            />
            <div class="icon" @click="handleClick('chat')">
              <n-icon
                size="24"
                :color="active === 'chat' ? 'var(--primary-color)' : ''"
                class="icon"
              >
                <ChatbubbleOutline />
              </n-icon>
            </div>
            <div class="icon" @click="handleClick('contact')">
              <n-icon
                size="24"
                :color="active === 'contact' ? 'var(--primary-color)' : ''"
                class="icon"
              >
                <Person />
              </n-icon>
            </div>
          </div>
          <div class="sider-item">
            <div class="icon" @click="handleClick('settings')">
              <n-icon size="24" class="icon">
                <Settings />
              </n-icon>
            </div>
          </div>
        </div>
      </n-layout-sider>
      <n-layout-content content-style="overflow: hidden">
        <router-view v-slot="{ Component }">
          <transition mode="out-in">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from "vue";
import { useNotification } from "naive-ui";
import { ChatbubbleOutline, Person, Settings } from "@vicons/ionicons5";
import {
  useUserStore,
  useContactsStore,
  useGroupsStore,
  useUsersStore,
} from "@/stores";
import router from "@/router";
import { info } from "@/services/userService";
import { getList as getContacts } from "@/services/contactService";
import { getList as getGroups } from "@/services/groupService";

const notification = useNotification();
const userStore = useUserStore();
const usersStore = useUsersStore();
const contactStore = useContactsStore();
const groupStore = useGroupsStore();
const userInfo = userStore.userInfo;
const active = ref(router.currentRoute.value.name);

const handleClick = (icon: string) => {
  if (icon === "chat") {
    active.value = "chat";
    router.push({ name: "chat" });
  }
  if (icon === "contact") {
    active.value = "contact";
    router.push({ name: "friend" });
  }
  if (icon === "settings") {
  }
};

onBeforeMount(async () => {
  // 数据初始化
  if (!userStore.sessionID) {
    // session不存在，认为未登录跳到介绍页
    notification.error({ content: "请先登录", duration: 3000 });
    router.push({ name: "home" });
    return null;
  } else {
    // session存在，获取用户信息
    try {
      // step1 获取用户信息
      const userInfo = await info(userStore.sessionID);
      if (userInfo.code === 200) {
        userStore.setUserInfo(userInfo.data);
        usersStore.addUser(userInfo.data);
      }
      // step2 获取用户通讯录
      const contacts = await getContacts(userStore.sessionID);
      if (contacts.code === 200 && Array.isArray(contacts.data)) {
        for (const item of contacts.data) {
          contactStore.addContact(item);
        }
      }
      // step3 获取用户群聊列表
      const groups = await getGroups(userStore.sessionID);
      if (groups.code === 200 && Array.isArray(groups.data)) {
        for (const item of groups.data) {
          groupStore.addGroup(item);
        }
      }
    } catch (error: any) {
      if (error.response.data.code === 401) {
        // session无效，退出登录
        router.push({ name: "logout" });
      }
    }
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  height: 100vh;
  width: 100vw;
}
.sider-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  overflow: hidden;
  user-select: none;
  .sider-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 24px;
    .logo {
      font-size: 14px;
      font-weight: bold;
    }
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      cursor: pointer;
      :hover {
        color: var(--primary-color-hover);
      }
    }
  }
}
</style>
