export class WebRTC {
  private static instance: WebRTC;
  private constructor() {}
  public static getInstance(): WebRTC {
    if (!WebRTC.instance) {
      WebRTC.instance = new WebRTC();
    }
    return WebRTC.instance;
  }
  public async getDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices();
  }
  public async getStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
  }
}
