<template>
  <n-card size="huge">
    <n-layout>
      <n-layout-header>
        <div class="header">
          <img :src="panelInfo.groupAvatar" alt="暂无图片" />
          <div class="group-info">
            <h1>{{ panelInfo.groupName }}</h1>
            <h4>房间号</h4>
          </div>
        </div>
      </n-layout-header>
      <n-layout-content content-style="padding: 20px">
        <div class="info-item" v-for="label in labels" :key="label.key">
          <div class="label-name">{{ label.labelname }}</div>
          <div v-if="label.key === 'admin'" class="label-content">
            <img
              class="admin-avatar"
              v-for="admin in panelInfo[label.key]"
              :src="admin"
              alt=""
            />
          </div>
          <div v-else class="label-content">
            {{ panelInfo[label.key] || "" }}
          </div>
        </div>
      </n-layout-content>
      <PanelFooter></PanelFooter>
    </n-layout>
  </n-card>
</template>

<script setup lang="ts">
import { Group } from "@/types";
import { Label } from "./type";

import { info } from "@/services/userService";
import { useUserStore } from "@/stores";

import PanelFooter from "./panelFooter.vue";

const props = defineProps<{
  panelInfo: Group & {
    type: "group";
  };
}>();

const labels: Label<Group>[] = [
  {
    labelname: "群介绍",
    key: "groupInfo",
  },
  {
    labelname: "群主/管理员",
    key: "admin",
  },
];

const sessionID = useUserStore().sessionID;

// info(sessionID, props.panelInfo.user[1]).then(res => {
//   console.log(res)
// })
</script>

<style scoped lang="scss">
.header {
  display: flex;
  height: 120px;
  box-sizing: border-box;
  padding: 10px;
  border-bottom: 1px solid white;

  img {
    width: 80px;
    height: 80px;
    border-radius: 2px;
  }

  .group-info {
    margin-left: 20px;
    vertical-align: middle;

    h1 {
      margin-bottom: 15px;
    }

    h4 {
      width: 500px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
  }
}

.info-item {
  display: flex;
  font-size: 14px;
  margin-bottom: 20px;
  align-items: center;

  .label-name {
    width: 80px;
    margin-right: 10px;
  }

  .label-content {
    flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .admin-avatar {
    width: 50px;
    height: 50px;
    margin-right: 8px;
  }
}
</style>
