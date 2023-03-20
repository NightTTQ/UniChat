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

    <div class="remote-track" ref="remoteRef"></div>
    <div class="local-track" ref="localRef"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { Settings } from "@vicons/ionicons5";
import QNRTC, {
  QNTransportPolicy,
  QNConnectionState,
  QNConnectionDisconnectedReason,
  type QNLocalTrack,
  type QNLocalVideoTrack,
  type QNLocalAudioTrack,
  type QNRemoteTrack,
  type QNRemoteVideoTrack,
  type QNRemoteAudioTrack,
  type QNRTCClient,
} from "qnweb-rtc";

const emits = defineEmits<{
  (event: "disconnected", reason: string): void;
}>();

const remoteRef = ref<HTMLElement>();
const localRef = ref<HTMLElement>();
const cameras = ref<MediaDeviceInfo[]>([]);
const microphones = ref<MediaDeviceInfo[]>([]);
const selectedCameraId = ref();
const selectedMicrophoneId = ref();
const useCamera = ref(false);
const useMicrophone = ref(true);
const localTracks = ref<{
  videoTrack?: QNLocalVideoTrack | null;
  audioTrack?: QNLocalAudioTrack | null;
}>({ videoTrack: undefined, audioTrack: undefined });
const switchingTracks = ref({ video: false, audio: false });
let active = true;

QNRTC.onCameraChanged = async () => {
  cameras.value = await QNRTC.getCameras();
};
QNRTC.onMicrophoneChanged = async () => {
  microphones.value = await QNRTC.getMicrophones();
};

const client = QNRTC.createClient();
QNRTC.setTransportPolicy(QNTransportPolicy.PREFER_UDP);
// 订阅远端用户发布的音视频流
const subscribe = async (client: QNRTCClient, tracks: QNRemoteTrack[]) => {
  // 传入远端用户发布的音视频轨道执行订阅操作。
  // 订阅成功后异步返回订阅成功的远端音视频轨道
  const remoteTracks = await client.subscribe(tracks);
  // 播放远端的音视频轨
  renderRemoteTracks(remoteTracks);
};
// 自动订阅
const autoSubscribe = (client: QNRTCClient) => {
  // 监听远端用户发布的音视频流
  client.on(
    "user-published",
    async (userId: string, tracks: QNRemoteTrack[]) => {
      subscribe(client, tracks);
    }
  );
};
/**
 * @desc 生成视频轨道
 */
const genVideoTrack = async () => {
  if (!active) return null;
  return await QNRTC.createCameraVideoTrack({
    cameraId: selectedCameraId.value,
  });
};
/**
 * @desc 生成音频轨道
 */
const genAudioTrack = async () => {
  if (!active) return null;
  return await QNRTC.createMicrophoneAudioTrack({
    microphoneId: selectedMicrophoneId.value,
  });
};
/**
 * @desc 渲染远端音视频轨道
 * @param tracks 远端音视频轨道
 */
const renderRemoteTracks = (tracks: {
  videoTracks: QNRemoteVideoTrack[];
  audioTracks: QNRemoteAudioTrack[];
}) => {
  if (remoteRef.value) {
    for (const remoteTrack of [...tracks.videoTracks, ...tracks.audioTracks]) {
      remoteTrack.play(remoteRef.value);
    }
  }
};
/**
 * @desc 渲染本地视频轨道
 */
const renderLocalTracks = () => {
  if (localRef.value) {
    if (localTracks.value?.videoTrack)
      localTracks.value.videoTrack.play(localRef.value);
  }
};

/**
 * @desc 建立连接加入房间
 */
const join = async (roomToken: string) => {
  await client.join(roomToken);
  // 发布本地音视频轨道
  if (useCamera.value && localTracks.value?.videoTrack) {
    await client.publish(localTracks.value.videoTrack);
  }
  if (useMicrophone.value && localTracks.value?.audioTrack) {
    await client.publish(localTracks.value.audioTrack);
  }
};
/**
 * @desc 断开连接离开房间
 */
const leave = async () => {
  active = false;
  if (client.roomName) {
    if (localTracks.value?.videoTrack)
      client.unpublish(localTracks.value.videoTrack);
    if (localTracks.value?.audioTrack)
      client.unpublish(localTracks.value.audioTrack);
    client.leave();
  }

  if (localTracks.value?.videoTrack) localTracks.value.videoTrack.destroy();
  if (localTracks.value?.audioTrack) localTracks.value.audioTrack.destroy();
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
    localTracks.value.videoTrack = await genVideoTrack();
    if (client.roomName && localTracks.value.videoTrack) {
      await client.publish(localTracks.value.videoTrack);
    }
    renderLocalTracks();
  } else {
    // 关闭摄像头
    useCamera.value = false;
    if (client.roomName && localTracks.value?.videoTrack) {
      client.unpublish(localTracks.value.videoTrack);
    }
    if (localTracks.value?.videoTrack) {
      localTracks.value.videoTrack.destroy();
      localTracks.value.videoTrack = undefined;
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
  // 如果已经发布了视频轨道，先取消发布
  if (client.roomName && localTracks.value?.videoTrack) {
    client.unpublish(localTracks.value.videoTrack);
  }
  // 销毁本地视频轨道
  if (localTracks.value?.videoTrack) {
    localTracks.value.videoTrack.destroy();
    localTracks.value.videoTrack = undefined;
  }
  // 只有开启了摄像头才生成本地轨道并渲染
  if (useCamera.value) {
    localTracks.value.videoTrack = await genVideoTrack();
    renderLocalTracks();
  }
  if (client.roomName && localTracks.value.videoTrack) {
    await client.publish(localTracks.value.videoTrack);
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
    localTracks.value.audioTrack = await genAudioTrack();
    if (client.roomName && localTracks.value.audioTrack) {
      await client.publish(localTracks.value.audioTrack);
    }
  } else {
    // 关闭麦克风
    useMicrophone.value = false;
    if (client.roomName && localTracks.value?.audioTrack) {
      client.unpublish(localTracks.value.audioTrack);
    }
    if (localTracks.value?.audioTrack) {
      localTracks.value.audioTrack.destroy();
      localTracks.value.audioTrack = undefined;
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
  // 如果已经发布了音频轨道，先取消发布
  if (client.roomName && localTracks.value?.audioTrack) {
    client.unpublish(localTracks.value.audioTrack);
  }
  if (localTracks.value?.audioTrack) {
    localTracks.value.audioTrack.destroy();
    localTracks.value.audioTrack = undefined;
  }
  // 只有开启了麦克风才生成本地轨道
  if (useMicrophone.value) localTracks.value.audioTrack = await genAudioTrack();
  if (client.roomName && localTracks.value.audioTrack) {
    await client.publish(localTracks.value.audioTrack);
  }
  switchingTracks.value.audio = false;
};

const init = async (camera = false, silence = false) => {
  active = true;
  autoSubscribe(client);
  // 监听连接状态变化
  client.on("connection-state-changed", (state: string, info: any) => {
    if (
      state === QNConnectionState.DISCONNECTED &&
      info.reason === QNConnectionDisconnectedReason.ERROR
    ) {
      emits("disconnected", "连接错误");
    }
  });
  // 监听远端用户取消发布的音视频流
  client.on(
    "user-unpublished",
    async (userId: string, track: QNRemoteTrack) => {
      // 取消订阅
      await client.unsubscribe(track);
    }
  );
  cameras.value = await QNRTC.getCameras();
  microphones.value = await QNRTC.getMicrophones();
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
