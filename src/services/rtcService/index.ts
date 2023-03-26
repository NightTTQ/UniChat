export class RTC {
  private static instance: RTC;
  private constructor() {}
  public static getInstance(): RTC {
    if (!RTC.instance) {
      RTC.instance = new RTC();
    }
    return RTC.instance;
  }
  /**
   * @desc 获取设备列表
   */
  public async getDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices();
  }
  /**
   * @desc 生成音频轨道
   * @param deviceId 抓取流的设备Id
   */
  public async genAudioTrack(deviceId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: deviceId,
      },
    });
    return stream.getAudioTracks()[0];
  }
  /**
   * @desc 生成视频轨道
   * @param deviceId 抓取流的设备Id
   */
  public async genVideoTrack(deviceId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: deviceId,
      },
    });
    return stream.getVideoTracks()[0];
  }
  /**
   * @desc 销毁轨道
   */
  public destroyTrack(track: MediaStreamTrack) {
    track.stop();
  }
}

export type SupportTransportPolicy = "AUTO" | "TCP" | "UDP";
export interface RTCSDK {
  setTransportPolicy?(method: SupportTransportPolicy): void;
  subscribeTracks(cb: (remoteTracks: MediaStreamTrack[]) => void): void;
  publishTracks(tracks: MediaStreamTrack[]): void;
  unpublishTracks(tracks: MediaStreamTrack[]): void;
  join(roomId: string): void;
  leave(): void;
}

import { QiNiuRTC } from "./qiniu";
export type SupportRTCSDK = QiNiuRTC;
export const SDKs = {
  qiniu: QiNiuRTC,
};
