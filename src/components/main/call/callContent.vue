<template>
  <div class="content-wrapper">
    <div class="call-header">
      <div></div>
      <n-popover trigger="click" placement="left-start" :show-arrow="false">
        <template #trigger>
          <div class="setting-icon">
            <Settings />
          </div>
        </template>
        <div class="call-settings">
          <div>
            <h4>摄像头</h4>
            <n-select
              v-model:value="selectedCameraId"
              value-field="deviceId"
              label-field="label"
              :options="cameras"
              :on-update:value="switchCamera"
              :disabled="switchingTracks.video"
            />
          </div>
          <div>
            <h4>麦克风</h4>
            <n-select
              v-model:value="selectedMicrophoneId"
              value-field="deviceId"
              label-field="label"
              :options="microphones"
              :on-update:value="switchMicrophone"
              :disabled="switchingTracks.audio"
            />
          </div>
        </div>
      </n-popover>
    </div>

    <div class="remote-track">
      <video
        autoplay
        ref="remoteVideoRef"
        style="visibility: hidden; height: 100%; width: 100%"
      ></video>
      <audio autoplay ref="remoteAudioRef" style="visibility: hidden"></audio>
    </div>
    <div class="local-track">
      <video
        autoplay
        ref="localVideoRef"
        style="visibility: hidden; height: 100%; width: 100%"
      ></video>
      <audio autoplay ref="localAudioRef" style="visibility: hidden"></audio>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Settings } from "@vicons/ionicons5";

import { SDKs, RTC, SupportRTCSDK } from "@/services/rtcService";

const emits = defineEmits<{
  (event: "disconnected", reason: string): void;
}>();

const remoteVideoRef = ref<HTMLVideoElement>();
const remoteAudioRef = ref<HTMLAudioElement>();
const localVideoRef = ref<HTMLVideoElement>();
const localAudioRef = ref<HTMLAudioElement>();
const cameras = ref<MediaDeviceInfo[]>([]);
const microphones = ref<MediaDeviceInfo[]>([]);
const selectedCameraId = ref();
const selectedMicrophoneId = ref();
const useCamera = ref(false);
const useMicrophone = ref(true);
const switchingTracks = ref({ video: false, audio: false });
let RTCMethod: SupportRTCSDK | null = null;
let localVideoTrack: MediaStreamTrack | null = null;
let localAudioTrack: MediaStreamTrack | null = null;
let remoteVideoTrack: MediaStreamTrack | null = null;
let remoteAudioTrack: MediaStreamTrack | null = null;
/** @desc 当前面板激活状态，若进入关闭流程则应为false */
let active = true;

// 刷新设备列表
const refreshDevices = async () => {
  const devices = await RTC.getInstance().getDevices();
  cameras.value = devices.filter((d) => d.kind === "videoinput");
  microphones.value = devices.filter((d) => d.kind === "audioinput");
};
// 渲染音视频流
const renderTrack = (
  type: "localVideo" | "localVoice" | "remoteVideo" | "remoteVoice",
  isCancle = false
) => {
  if (type === "localVideo" && localVideoRef.value) {
    if (!isCancle && localVideoTrack) {
      // 渲染本地视频流
      localVideoRef.value.srcObject = new MediaStream([localVideoTrack]);
      localVideoRef.value.style.visibility = "visible";
    } else {
      // 取消渲染本地视频流
      localVideoRef.value.srcObject = null;
      localVideoRef.value.style.visibility = "hidden";
    }
  }
  if (type === "localVoice" && localAudioRef.value) {
    if (!isCancle && localAudioTrack) {
      // 渲染本地音频流
      localAudioRef.value.srcObject = new MediaStream([localAudioTrack]);
    } else {
      // 取消渲染本地音频流
      localAudioRef.value.srcObject = null;
    }
  }
  if (type === "remoteVideo" && remoteVideoRef.value) {
    if (!isCancle && remoteVideoTrack) {
      // 渲染远端视频流
      remoteVideoRef.value.srcObject = new MediaStream([remoteVideoTrack]);
      remoteVideoRef.value.style.visibility = "visible";
    } else {
      // 取消渲染远端视频流
      remoteVideoRef.value.srcObject = null;
      remoteVideoRef.value.style.visibility = "hidden";
    }
  }
  if (type === "remoteVoice" && remoteAudioRef.value) {
    if (!isCancle && remoteAudioTrack) {
      // 渲染远端音频流
      remoteAudioRef.value.srcObject = new MediaStream([remoteAudioTrack]);
    } else {
      // 取消渲染远端音频流
      remoteAudioRef.value.srcObject = null;
    }
  }
};
/**
 * @desc 建立连接加入房间
 */
const join = async (method: string, roomToken: string) => {
  // 根据协商结果选择连接方式
  if (method === "qiniu") {
    RTCMethod = new SDKs.qiniu();
  }
  // 建立连接
  await RTCMethod?.join(roomToken);
  // 发布本地音视频轨道
  if (localVideoTrack) {
    RTCMethod?.publishTracks([localVideoTrack]);
  }
  if (localAudioTrack) {
    RTCMethod?.publishTracks([localAudioTrack]);
  }
  // 订阅远端音视频轨道
  RTCMethod?.subscribeTracks((tracks) => {
    for (const track of tracks) {
      if (track.kind === "video") {
        remoteVideoTrack = track;
        renderTrack("remoteVideo");
      }
      if (track.kind === "audio") {
        remoteAudioTrack = track;
        renderTrack("remoteVoice");
      }
    }
  });
};
/**
 * @desc 断开连接离开房间
 */
const leave = async () => {
  active = false;
  // 取消发布并销毁本地音视频轨道
  if (localVideoTrack) {
    await RTCMethod?.unpublishTracks([localVideoTrack]);
    localVideoTrack.stop();
    localVideoTrack = null;
  }
  if (localAudioTrack) {
    await RTCMethod?.unpublishTracks([localAudioTrack]);
    localAudioTrack.stop();
    localAudioTrack = null;
  }
  // 重置本地音视频渲染元素状态
  renderTrack("localVideo", true);
  renderTrack("localVoice", true);
  // 销毁远端音视频轨道
  if (remoteVideoTrack) {
    remoteVideoTrack.stop();
    remoteVideoTrack = null;
  }
  if (remoteAudioTrack) {
    remoteAudioTrack.stop();
    remoteAudioTrack = null;
  }
  // 重置远端音视频渲染元素状态
  renderTrack("remoteVideo", true);
  renderTrack("remoteVoice", true);
  // 断开连接
  await RTCMethod?.leave();
};
/**
 * @desc 开关摄像头
 */
const toggleCamera = async (enable: boolean) => {
  switchingTracks.value.video = true;
  // 启用摄像头
  if (enable) {
    if (selectedCameraId.value === undefined) {
      selectedCameraId.value = cameras.value[0].deviceId;
    }
    useCamera.value = true;
    // 创建本地视频流
    localVideoTrack = await RTC.getInstance().genVideoTrack(
      selectedCameraId.value
    );
    // 发布本地视频流
    RTCMethod?.publishTracks([localVideoTrack]);
    // 渲染本地视频预览
    renderTrack("localVideo");
  } else {
    // 关闭摄像头
    useCamera.value = false;
    // 取消发布本地视频流
    if (localVideoTrack) RTCMethod?.unpublishTracks([localVideoTrack]);
    // 关闭本地视频渲染
    renderTrack("localVideo", true);
    // 销毁本地视频流
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack = null;
    }
  }
  switchingTracks.value.video = false;
};
/**
 * @desc 切换摄像头
 */
const switchCamera = async (value: string) => {
  switchingTracks.value.video = true;
  selectedCameraId.value = value;
  // 取消发布本地视频流
  if (localVideoTrack) RTCMethod?.unpublishTracks([localVideoTrack]);
  // 销毁本地视频轨道
  if (localVideoTrack) {
    localVideoTrack.stop();
    localVideoTrack = null;
  }
  if (useCamera.value) {
    // 若开启了摄像头则生成本地轨道
    localVideoTrack = await RTC.getInstance().genVideoTrack(
      selectedCameraId.value
    );
    // 再渲染本地轨道
    renderTrack("localVideo");
    // 发布本地视频流
    RTCMethod?.publishTracks([localVideoTrack]);
  }
  switchingTracks.value.video = false;
};
/**
 * @desc 开关麦克风
 */
const toggleMicrophone = async (enable: boolean) => {
  switchingTracks.value.audio = true;
  // 启用麦克风
  if (enable) {
    if (selectedMicrophoneId.value === undefined) {
      selectedMicrophoneId.value = microphones.value[0].deviceId;
    }
    useMicrophone.value = true;
    // 创建本地音频流
    localAudioTrack = await RTC.getInstance().genAudioTrack(
      selectedMicrophoneId.value
    );
    // 发布本地音频流
    RTCMethod?.publishTracks([localAudioTrack]);
  } else {
    // 关闭麦克风
    useMicrophone.value = false;
    // 取消发布本地音频流
    if (localAudioTrack) RTCMethod?.unpublishTracks([localAudioTrack]);
    // 销毁本地音频流
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack = null;
    }
  }
  switchingTracks.value.audio = false;
};
/**
 * @desc 切换麦克风
 */
const switchMicrophone = async (value: string) => {
  switchingTracks.value.audio = true;
  selectedMicrophoneId.value = value;
  // 取消发布音频流
  if (localAudioTrack) RTCMethod?.unpublishTracks([localAudioTrack]);
  if (useMicrophone.value) {
    // 若开启了麦克风则生成本地音频流
    localAudioTrack = await RTC.getInstance().genAudioTrack(
      selectedMicrophoneId.value
    );
    // 再发布本地音频流
    RTCMethod?.publishTracks([localAudioTrack]);
  }
  switchingTracks.value.audio = false;
};

const init = async (camera = false, silence = false) => {
  active = true;
  // 当设备列表发生变化时刷新设备列表
  navigator.mediaDevices.ondevicechange = refreshDevices;
  await refreshDevices();
  if (camera === true) toggleCamera(true);
  if (silence === false) toggleMicrophone(true);
};
defineExpose({ join, leave, toggleCamera, toggleMicrophone });
init();
</script>
<style lang="scss" scoped>
.content-wrapper {
  position: absolute;
  z-index: 0;
  display: flex;
  height: 100%;
  width: 100%;
  .call-header {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100%;
    height: 3em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .setting-icon {
      height: 3em;
      width: 3em;
      padding: 0.5em;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .call-settings {
      display: flex;
      flex-direction: column;
      row-gap: 1em;
    }
  }

  .remote-track {
    position: absolute;
    z-index: -1;
    border-radius: 1em;
    height: 100%;
    width: 100%;
  }
  .local-track {
    position: absolute;
    z-index: 1;
    bottom: 10em;
    right: 0;
    border-radius: 1em;
    width: 160px;
    height: 90px;
  }
}
</style>
