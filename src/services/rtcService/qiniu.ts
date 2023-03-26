import { RTCSDK, SupportTransportPolicy } from "./index";
import QNRTC, {
  QNTransportPolicy,
  QNConnectionState,
  QNConnectionDisconnectedReason,
  type QNLocalVideoTrack,
  type QNLocalAudioTrack,
  type QNRemoteVideoTrack,
  QNRemoteAudioTrack,
  type QNRTCClient,
  QNTrack,
  QNLocalTrack,
} from "qnweb-rtc";

export class QiNiuRTC implements RTCSDK {
  private client: QNRTCClient;
  private localTracks: {
    videoTracks: QNLocalVideoTrack[];
    audioTracks: QNLocalAudioTrack[];
  };
  private remoteTracks: {
    videoTracks: QNRemoteVideoTrack[];
    audioTracks: QNRemoteAudioTrack[];
  };
  private remoteTracksHook: (
    remoteTracks: MediaStreamTrack[],
    isCancel: boolean
  ) => void = () => {};
  constructor() {
    this.client = QNRTC.createClient();
    this.localTracks = {
      videoTracks: [],
      audioTracks: [],
    };
    this.remoteTracks = {
      videoTracks: [],
      audioTracks: [],
    };
    // 监听连接状态变化
    this.client.on("connection-state-changed", (state: string, info: any) => {
      if (
        state === QNConnectionState.DISCONNECTED &&
        info.reason === QNConnectionDisconnectedReason.ERROR
      ) {
        throw new Error("连接错误");
      }
    });
    // 自动订阅远端用户发布的音视频流
    this.client.on(
      "user-published",
      (userId: string, tracks: (QNRemoteAudioTrack | QNRemoteVideoTrack)[]) => {
        this.subscribeRemoteTracks(tracks);
      }
    );
    // 监听远端用户取消发布的音视频流
    this.client.on(
      "user-unpublished",
      (userId: string, tracks: (QNRemoteAudioTrack | QNRemoteVideoTrack)[]) => {
        this.unsubscribeRemoteTracks(tracks);
      }
    );
  }
  private transferTrackToRTC(QNTrack: QNTrack): MediaStreamTrack | null {
    return QNTrack.getMediaStreamTrack() || null;
  }
  private transferTrackToQN(track: MediaStreamTrack): QNLocalTrack | null {
    if (track.kind === "audio")
      return QNRTC.createCustomAudioTrack({ mediaStreamTrack: track });
    if (track.kind === "video")
      return QNRTC.createCustomVideoTrack({ mediaStreamTrack: track });
    return null;
  }
  /**
   * @desc 远端用户发布了新的音视频流
   * @param tracks 远端音视频流
   */
  private async subscribeRemoteTracks(
    tracks: (QNRemoteAudioTrack | QNRemoteVideoTrack)[]
  ) {
    // 订阅远端音视频流
    await this.client.subscribe(tracks);
    // 将新音视频流添加到远端音视频流列表中
    for (const track of tracks) {
      if (track.isAudio())
        this.remoteTracks.audioTracks.push(track as QNRemoteAudioTrack);
      if (track.isVideo())
        this.remoteTracks.videoTracks.push(track as QNRemoteVideoTrack);
    }
    // 生成钩子函数参数
    const remoteTracks: MediaStreamTrack[] = [];
    for (const track of tracks) {
      const tmp = this.transferTrackToRTC(track);
      if (tmp) remoteTracks.push(tmp);
    }
    // 调用钩子函数
    this.remoteTracksHook(remoteTracks, false);
  }
  /**
   * @desc 远端用户取消发布了音视频流
   * @param tracks 远端音视频流
   */
  private async unsubscribeRemoteTracks(
    tracks: (QNRemoteAudioTrack | QNRemoteVideoTrack)[]
  ) {
    // 取消订阅
    await this.client.unsubscribe(tracks);
    // 将取消发布的音视频流从远端音视频流列表中移除
    for (const track of tracks) {
      if (track.isAudio()) {
        this.remoteTracks.audioTracks.splice(
          this.remoteTracks.audioTracks.indexOf(track as QNRemoteAudioTrack),
          1
        );
      }
      if (track.isVideo()) {
        this.remoteTracks.videoTracks.splice(
          this.remoteTracks.videoTracks.indexOf(track as QNRemoteVideoTrack),
          1
        );
      }
    }
    // 生成钩子函数参数
    const remoteTracks: MediaStreamTrack[] = [];
    for (const track of tracks) {
      const tmp = this.transferTrackToRTC(track);
      if (tmp) remoteTracks.push(tmp);
    }
    // 调用钩子函数
    this.remoteTracksHook(remoteTracks, true);
  }

  /**
   * @desc 设置传输模式（全局影响）
   * @param policy 传输模式
   */
  public setTransportPolicy(policy: SupportTransportPolicy) {
    if (policy === "TCP") QNRTC.setTransportPolicy(QNTransportPolicy.FORCE_TCP);
    else if (policy === "UDP")
      QNRTC.setTransportPolicy(QNTransportPolicy.FORCE_UDP);
    else QNRTC.setTransportPolicy(QNTransportPolicy.PREFER_UDP);
  }
  /**
   * @desc 订阅远端的音视频流
   * @param cb 当远端音视频流变化时的回调
   */
  public subscribeTracks(
    cb: (remoteTracks: MediaStreamTrack[], isCancel: boolean) => void
  ) {
    this.remoteTracksHook = cb;
  }
  /**
   * @desc 发布音视频流
   */
  public async publishTracks(tracks: MediaStreamTrack[]) {
    // 只有当前已经连接的情况下才能发布音视频流
    if (this.client.roomName) {
      // 先将原生的音视频流转换为七牛的音视频流
      const QNTracks: QNLocalTrack[] = [];
      for (const track of tracks) {
        const tmp = this.transferTrackToQN(track);
        if (tmp) QNTracks.push(tmp);
      }
      // 发布音视频流
      await this.client.publish(QNTracks);
      // 将新发布的音视频流添加到本地音视频流列表中
      for (const track of QNTracks) {
        if (track.isAudio())
          this.localTracks.audioTracks.push(track as QNLocalAudioTrack);
        if (track.isVideo())
          this.localTracks.videoTracks.push(track as QNLocalVideoTrack);
      }
    }
  }
  /**
   * @desc 取消发布音视频流
   */
  public async unpublishTracks(tracks: MediaStreamTrack[]) {
    // 只有当前已经连接的情况下才能取消发布音视频流
    if (this.client.roomName) {
      // 从本地音视频流列表中找出需要取消发布的音视频流
      const QNTracks: QNLocalTrack[] = [];
      for (const track of tracks) {
        if (track.kind === "audio") {
          const tmp = this.localTracks.audioTracks.find(
            (audioTrack) => audioTrack.getMediaStreamTrack()?.id === track.id
          );
          if (tmp) QNTracks.push(tmp);
        }
        if (track.kind === "video") {
          const tmp = this.localTracks.videoTracks.find(
            (videoTrack) => videoTrack.getMediaStreamTrack()?.id === track.id
          );
          if (tmp) QNTracks.push(tmp);
        }
      }
      // 取消发布音视频流
      await this.client.unpublish(QNTracks);
      // 将取消发布的音视频流从本地音视频流列表中移除
      for (const track of QNTracks) {
        if (track.isAudio())
          this.localTracks.audioTracks.splice(
            this.localTracks.audioTracks.indexOf(track as QNLocalAudioTrack),
            1
          );
        if (track.isVideo())
          this.localTracks.videoTracks.splice(
            this.localTracks.videoTracks.indexOf(track as QNLocalVideoTrack),
            1
          );
      }
    }
  }
  /**
   * @desc 建立连接加入房间
   */
  public async join(roomToken: string) {
    await this.client.join(roomToken);
  }
  /**
   * @desc 离开房间并销毁全部音视频轨道
   */
  public async leave() {
    // 只有当前已经连接的情况下才能离开房间
    if (this.client.roomName) {
      await this.client.leave();
      this.remoteTracks.audioTracks.splice(0);
      this.remoteTracks.videoTracks.splice(0);
    }
    this.localTracks.videoTracks.forEach((track) => track.destroy());
    this.localTracks.videoTracks.splice(0);
    this.localTracks.audioTracks.forEach((track) => track.destroy());
    this.localTracks.audioTracks.splice(0);
  }
}
