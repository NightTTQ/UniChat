<template>
  <n-card size="huge">
    <n-layout>
      <n-layout-header>
        <div class="header">
          <img :src="panelInfo.avatar" alt="暂无图片" />
          <div class="contact-info">
            <h1>{{ panelInfo.username }}</h1>
            <h4>
              个性签名个性签名个性签名个性签名个性签名个性签名个性签名个性签名个性签名个性签名
            </h4>
          </div>
        </div>
      </n-layout-header>
      <n-layout-content
        content-style="backgroundColor: rgb(24,24,28); padding: 20px"
      >
        <div class="info-item" v-for="label in labels" :key="label.key">
          <div class="label-name">{{ label.labelname }}</div>
          <div class="label-content">
            {{ panelInfo[label.key] || "default" }}
          </div>
        </div>
      </n-layout-content>
      <PanelFooter></PanelFooter>
    </n-layout>
  </n-card>
</template>

<script setup lang="ts">
import { Contact } from "@/types";
import { Label } from "./type";

import PanelFooter from "./panelFooter.vue";

defineProps<{
  panelInfo: Contact & {
    type: "friend";
  };
}>();

// 支持定制 从 labelInfo 中取数据
const labels: Label<Contact>[] = [
  {
    labelname: "昵称",
    key: "username",
  },
];
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

  .contact-info {
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
  font-size: 17px;
  margin-bottom: 20px;
  align-items: center;

  .label-name {
    width: 50px;
  }

  .label-content {
    flex: 1;
  }
}
</style>
