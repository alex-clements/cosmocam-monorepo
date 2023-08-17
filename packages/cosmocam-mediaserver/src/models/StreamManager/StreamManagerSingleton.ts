import { StreamManager } from "./StreamManager";

export class StreamManagerSingleton {
  private static streamManager: StreamManager | undefined;
  constructor() {}

  public static getStreamManager() {
    if (!this.streamManager) {
      this.streamManager = new StreamManager();
    }
    return this.streamManager;
  }
}
