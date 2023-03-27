<template>
  <div class="sider">
    <div class="bar" style="width: 250px">
      <n-input
        type="text"
        size="large"
        placeholder="搜索"
        style="width: 250px"
      />
    </div>
    <div class="list">
      <!-- 好友/群聊 切换 Tab  -->
      <div class="tab-wrapper">
        <n-tabs
          size="large"
          justify-content="space-evenly"
          animated
          @update:value="changeActive"
        >
          <n-tab-pane name="friend" tab="好友">
            <n-layout-sider class="list" :native-scrollbar="false">
              <div class="list-wrapper">
                <ContactItem
                  v-for="item in contacts"
                  :key="item._id"
                  :native-scrollbar="false"
                  :room-id="item.roomId"
                  :avatar="item.avatar"
                  :name="item.username"
                  :id="item._id"
                  type="friend"
                  :item="item"
                  @click="toggleId(item)"
                ></ContactItem>
              </div>
            </n-layout-sider>
          </n-tab-pane>
          <n-tab-pane name="group" tab="群聊">
            <n-layout-sider class="list" :native-scrollbar="false">
              <div class="list-wrapper">
                <ContactItem
                  v-for="item in groups"
                  :key="item._id"
                  :native-scrollbar="false"
                  :avatar="item.groupAvatar"
                  :name="item.groupName"
                  :info="item.groupInfo"
                  type="group"
                  :id="item._id"
                  :item="item"
                  @click="toggleId(item)"
                />
              </div>
            </n-layout-sider>
          </n-tab-pane>
        </n-tabs>
      </div>

      <!-- 好友/群聊请求 -->
      <div class="request">
        <ContactRequest @click="toShowRequest" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "@/router";
import { storeToRefs } from "pinia";
import { useContactsStore, useGroupsStore } from "@/stores";
import ContactRequest from "@/components/contact/contactRequest/contactRequest.vue";
import { Contact, Group } from "@/types";

const emit = defineEmits<{
  (event: "toggleId", item: Contact | Group): void;
  (event: "toShowRequest"): void;
}>();

// 定义好友列表
const contacts = storeToRefs(useContactsStore()).contacts;
// 定义群聊列表
const groupsStore = useGroupsStore();
const groups = storeToRefs(groupsStore).groups;

// 跳转路由
const changeActive = (value: string) => {
  router.push({ name: value });
};
// 切换 item
const toggleId = (item: Contact | Group) => {
  // console.log(item);
  emit("toggleId", item);
};
// 显示 好友/群聊 请求列表
const toShowRequest = () => {
  emit("toShowRequest");
};
</script>

<style lang="scss" scoped>
.sider {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  min-width: 200px;
  z-index: 1;
  .bar {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
  }
  .list {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    .tab-wrapper {
      width: 250px;
      overflow: hidden;
    }
    .request {
      background-color: inherit;
    }
  }
}
</style>
