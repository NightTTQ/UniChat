<template>
  <div class="call-wrapper">
    <div class="call-content">
      <div class="call-header">
        <div class="call-setting"></div>
      </div>
      <div class="call-info">
        <img
          v-show="callModalVars.status !== 3"
          :src="user?.avatar"
          class="avatar"
        />
        <h1 class="name">{{ user?.username }}</h1>
        <p class="status">{{ statusText[callModalVars.status] }}</p>
      </div>
      <CallContent ref="callRef" />
      <div class="action">
        <div class="action-item">
          <VideocamOff
            v-if="settings.camera"
            class="icon active"
            @click="enableCamera(false)"
          />
          <Videocam v-else class="icon" @click="enableCamera(true)" />
          <div class="text">
            {{ settings.camera ? "视频已开" : "视频" }}
          </div>
        </div>
        <div class="action-item">
          <VolumeHigh
            v-if="settings.silence"
            class="icon active"
            @click="disableVolume(false)"
          />
          <VolumeMute v-else class="icon" @click="disableVolume(true)" />
          <div class="text">{{ settings.silence ? "已静音" : "静音" }}</div>
        </div>
        <div
          v-if="callModalVars.status === -1"
          class="action-item"
          @click="accept"
        >
          <Call class="icon accept" />
          <div class="text">接听</div>
        </div>
        <div class="action-item" @click="decline">
          <Call class="icon decline" />
          <div class="text">挂断</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { storeToRefs } from "pinia";
import {
  Videocam,
  VideocamOff,
  VolumeHigh,
  VolumeMute,
  Call,
} from "@vicons/ionicons5";

import CallContent from "./callContent.vue";
import { UserInfo } from "@/types";
import { useUsersStore, useGlobalStore } from "@/stores";
import { requestCall, cancelCall, hangupCall } from "@/services/chatService";

const statusText = [
  "正在呼叫",
  "正在振铃",
  "正在连接",
  "通话中",
  "通话结束",
  "无人接听",
  "通话被拒绝",
];

const globalStore = useGlobalStore();
const callModalVars = storeToRefs(useGlobalStore()).callModal;
const usersStore = useUsersStore();

// 通话设置
const settings = ref({
  camera: false,
  silence: false,
});
const user = ref<UserInfo | null>(null);
const callRef = ref<InstanceType<typeof CallContent>>();

// 摄像头
const enableCamera = (value: boolean) => {
  settings.value.camera = value;
  callRef.value?.toggleCamera(value);
};
// 静音
const disableVolume = (value: boolean) => {
  settings.value.silence = value;
  callRef.value?.toggleMicrophone(!value);
};
/**
 * @desc 停止通话中的本地预览
 */
const stop = () => {
  callRef.value?.leave();
};
// 接听通话
const accept = () => {
  callModalVars.value.status = 2;
  if (callModalVars.value.incomeCallBack) {
    // 向服务器返回接受通话
    callModalVars.value.incomeCallBack({ accept: true });
  }
  connect();
};
// 连接通话
const connect = async () => {
  try {
    // 使用roomToken进行连接
    if (callModalVars.value.callConfig.method === "qiniu") {
      await callRef.value?.join(callModalVars.value.callConfig.roomToken);
      callModalVars.value.status = 3;
    }
  } catch (error) {
    console.log(error);

    throw new Error("连接通话失败");
  }
};
// 拒绝通话或挂断通话
const decline = () => {
  if (callModalVars.value.status === -1) {
    // 拒绝通话
    callModalVars.value.status = 4;
    if (callModalVars.value.incomeCallBack) {
      callModalVars.value.incomeCallBack({ accept: false });
    }
    stop();
    setTimeout(() => {
      globalStore.toggleCallModal();
    }, 3000);
  } else if (callModalVars.value.status < 3) {
    // 中止呼叫
    callModalVars.value.status = 4;
    cancelCall();
    stop();
    setTimeout(() => {
      globalStore.toggleCallModal();
    }, 3000);
  } else if (callModalVars.value.status === 3) {
    // 挂断通话
    callModalVars.value.status = 4;
    hangupCall(callModalVars.value.roomId);
    stop();
    setTimeout(() => {
      globalStore.toggleCallModal();
    }, 3000);
  }
};
// 呼叫超时
const timeout = () => {
  callModalVars.value.status = 5;
  stop();
  setTimeout(() => {
    globalStore.toggleCallModal();
  }, 3000);
};
// 对方拒绝
const rejected = () => {
  callModalVars.value.status = 6;
  stop();
  setTimeout(() => {
    globalStore.toggleCallModal();
  }, 3000);
};

/**
 * @desc 初始化面板数据。打开面板时自动调用
 */
const init = async () => {
  settings.value.camera = false;
  settings.value.silence = false;
  // 主动呼叫
  if (callModalVars.value.status === 0 && callModalVars.value.userId) {
    user.value = await usersStore.getUserById(callModalVars.value.userId);
    try {
      const res = await requestCall(
        callModalVars.value.roomId,
        callModalVars.value.userId,
        (res: { roomId: string; status: number }) => {
          if (res.roomId === callModalVars.value.roomId && res.status === 1) {
            // 收到服务器发起通话的回应，说明通话请求已发起，对方振铃
            callModalVars.value.status = res.status;
          }
        }
      );
      // 服务器返回通话信息，说明对方已接听，开始连接
      if (res.method && res.roomToken) {
        callModalVars.value.callConfig.method = res.method;
        callModalVars.value.callConfig.roomToken = res.roomToken;
        connect();
      } else {
        console.log("未获取到token");
      }
    } catch (error: any) {
      // 服务器返回错误，说明对方未接听，呼叫失败
      if (error.error.timeout) {
        // 超时
        timeout();
      } else if (error.error.accept === false) {
        console.log("对方拒绝了通话");
        // 拒绝
        rejected();
      } else {
        console.log(error);
      }
    }
  }
  // 被叫，显示用户信息，等待操作
  else if (callModalVars.value.status === -1 && callModalVars.value.userId) {
    user.value = await usersStore.getUserById(callModalVars.value.userId);
  }
};
init();
defineExpose({ decline });
</script>
<style lang="scss" scoped>
.call-wrapper {
  z-index: 1000;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 480px;
  height: 640px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  &::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: inherit;
    backdrop-filter: blur(5px);
  }
  .call-content {
    display: grid;
    align-items: center;
    height: 100%;
    width: 100%;
    .call-info {
      z-index: 1000;
      align-self: center;
      justify-self: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .avatar {
        width: 200px;
        height: 200px;
        border-radius: 50%;
      }
      .name {
        margin-top: 10px;
      }
      .status {
        margin-top: 10px;
      }
    }
  }
  .action {
    z-index: 1;
    align-self: flex-end;
    justify-self: center;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 2em;
    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 1em;
      .icon {
        cursor: pointer;
        background-color: rgba($color: #000, $alpha: 0.5);
        color: #fff;
        border-radius: 50%;
        padding: 1em;
        width: 4em;
        height: 4em;
      }
      .icon.active {
        background-color: #fff;
        color: #000;
      }
      .accept {
        background-color: green;
      }
      .decline {
        background-color: red;
        transform: rotate(135deg);
      }
      .text {
        margin-top: 0.5em;
      }
    }
  }
}
</style>
