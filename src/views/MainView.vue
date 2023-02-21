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
          <transition>
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
import { useUserStore } from "@/stores";
import router from "@/router";
import { info } from "@/services/userService";

const notification = useNotification();
const userStore = useUserStore();
const userInfo = userStore.userInfo;
const active = ref(router.currentRoute.value.name);

const handleClick = (icon: string) => {
  if (icon === "chat") {
    active.value = "chat";
    router.push({ name: "chat" });
  }
  if (icon === "contact") {
    active.value = "contact";
    router.push({ name: "contact" });
  }
  if (icon === "settings") {
  }
};

onBeforeMount(async () => {
  if (!userStore.sessionID) {
    // session不存在，认为未登录跳到介绍页
    notification.error({ content: "请先登录", duration: 3000 });
    router.push({ name: "home" });
    return null;
  } else {
    // session存在，获取用户信息
    try {
      const res = await info(userStore.sessionID);
      if (res.code === 200) {
        userStore.setUserInfo(res.data);
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
