import os from "os";
import { types as mediasoupTypes } from "mediasoup";

const LOGGING = true;

export const getLocalIPAddress = (): string => {
  let networkInterfaces = os.networkInterfaces();
  let ipv4Object = networkInterfaces["en0"]?.find((el) => el.family === "IPv4");
  return ipv4Object?.address || "192.168.1.64";
};

export const log = function (...args: any[]) {
  if (LOGGING) {
    console.log(...args);
  }
};

export const mediaCodecs: mediasoupTypes.RtpCodecCapability[] = [
  {
    kind: "audio",
    mimeType: "audio/opus",
    clockRate: 48000,
    channels: 2,
  },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
];
