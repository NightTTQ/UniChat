<template>
  <div class="content-wrapper">
    <n-select
      v-if="useCamera"
      v-model:value="selectedCameraId"
      value-field="deviceId"
      label-field="label"
      :options="cameras"
      :on-update:value="switchCamera"
    />

    <n-select
      v-if="useMicrophone"
      v-model:value="selectedMicrophoneId"
      value-field="deviceId"
      label-field="label"
      :options="microphones"
      :on-update:value="switchMicrophone"
    />

    <div class="remote-track" ref="remoteRef"></div>
    <div class="local-track" ref="localRef"></div>
  </div>
</template>
<script lang="ts" setup>
import { ref, nextTick } from "vue";
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
  videoTrack?: QNLocalVideoTrack;
  audioTrack?: QNLocalAudioTrack;
}>({ videoTrack: undefined, audioTrack: undefined });

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
  return await QNRTC.createCameraVideoTrack({
    cameraId: selectedCameraId.value,
  });
};
/**
 * @desc 生成音频轨道
 */
const genAudioTrack = async () => {
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
    // if (localTracks.value?.audioTrack)
    //   localTracks.value.audioTrack.play(localRef.value);
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
  // 启用摄像头
  if (enable) {
    if (selectedCameraId.value === undefined) {
      selectedCameraId.value = cameras.value[0].deviceId;
    }
    useCamera.value = true;
    localTracks.value.videoTrack = await genVideoTrack();
    if (client.roomName) {
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
};
/**
 * @desc 切换摄像头
 */
const switchCamera = async (value: string) => {
  selectedCameraId.value = value;
  if (client.roomName && localTracks.value?.videoTrack) {
    client.unpublish(localTracks.value.videoTrack);
  }
  if (localTracks.value?.videoTrack) {
    localTracks.value.videoTrack.destroy();
    localTracks.value.videoTrack = undefined;
  }
  localTracks.value.videoTrack = await genVideoTrack();
  renderLocalTracks();
  if (client.roomName) {
    await client.publish(localTracks.value.videoTrack);
  }
};
/**
 * @desc 开关麦克风
 */
const toggleMicrophone = async (enable: boolean) => {
  // 启用麦克风
  if (enable) {
    if (selectedMicrophoneId.value === undefined) {
      selectedMicrophoneId.value = microphones.value[0].deviceId;
    }
    useMicrophone.value = true;
    localTracks.value.audioTrack = await genAudioTrack();
    if (client.roomName) {
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
};
/**
 * @desc 切换麦克风
 */
const switchMicrophone = async (value: string) => {
  selectedMicrophoneId.value = value;
  if (client.roomName && localTracks.value?.audioTrack) {
    client.unpublish(localTracks.value.audioTrack);
  }
  if (localTracks.value?.audioTrack) {
    localTracks.value.audioTrack.destroy();
    localTracks.value.audioTrack = undefined;
  }
  localTracks.value.audioTrack = await genAudioTrack();
  if (client.roomName) {
    await client.publish(localTracks.value.audioTrack);
  }
};

const init = async (camera = false, silence = false) => {
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
  // selectedCameraId.value = cameras.value[0].deviceId;
  // selectedMicrophoneId.value = microphones.value[0].deviceId;
  if (camera === true) toggleCamera(true);
  if (silence === false) toggleMicrophone(true);
  // 本地用户预览
  // renderLocalTracks();
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
