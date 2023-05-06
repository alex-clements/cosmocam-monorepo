import React, { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { types as mediasoupTypes } from "mediasoup-client";
import { createLogger } from "@cosmocam/shared";
const mediasoupClient = require("mediasoup-client");

const loggingEnabled = false;
const log = createLogger(loggingEnabled);

let params: any = {
  encoding: [
    {
      rid: "r0",
      maxBitrate: 100000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r1",
      maxBitrate: 300000,
      scalabilityMode: "S1T3",
    },
    {
      rid: "r2",
      maxBitrate: 900000,
      scalabilityMode: "S1T3",
    },
  ],
  codecOptions: {
    videoGoogleStartBitrate: 1000,
  },
};

export const useProducerStream = ({
  socket,
  localVideo,
  deviceId,
}: {
  socket: Socket;
  localVideo: React.RefObject<HTMLVideoElement>;
  deviceId: string;
}) => {
  const streamRef = useRef<MediaStream>();
  let device: any;
  let rtpCapabilities: mediasoupTypes.RtpCapabilities;
  let producerTransport = useRef<any>();
  let producer: any;

  useEffect(() => {
    if (producerTransport.current) {
      producerTransport.current.close();
      producerTransport.current = undefined;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    getLocalStream(deviceId);
  }, [deviceId]);

  const streamSuccess = (stream: MediaStream) => {
    streamRef.current = stream;
    if (localVideo.current) {
      localVideo.current.srcObject = stream;
      localVideo.current.play();
    }
    const videoTrack = stream.getVideoTracks()[0];
    params = {
      ...params,
      track: videoTrack,
    };
    getRtpCapabilities();
  };

  const getLocalStream = (deviceId: string) => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          ...(deviceId && {
            deviceId: {
              exact: deviceId,
            },
          }),
          width: {
            min: 640,
            max: 1920,
          },
          height: {
            min: 400,
            max: 1080,
          },
        },
      })
      .then((stream) => streamSuccess(stream))
      .catch((error) => {
        log(error);
      });
  };

  const createDevice = async () => {
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      log("Device RTP Capabilities: ", rtpCapabilities);
      createSendTransport();
    } catch (err) {
      log(err);
    }
  };

  const getRtpCapabilities = () => {
    socket.emit(
      "createRoom",
      (data: { rtpCapabilities: mediasoupTypes.RtpCapabilities }) => {
        log(`rtpCapabilities: ${data.rtpCapabilities}`);
        rtpCapabilities = data.rtpCapabilities;
        createDevice();
      }
    );
  };

  const createSendTransport = () => {
    socket.emit(
      "createWebRtcTransport",
      { sender: true },
      ({ params }: { params: any }) => {
        if (params.error) {
          log(params.error);
          return;
        }
        log(params);

        producerTransport.current = device.createSendTransport(params);

        producerTransport.current.on(
          "connect",
          async (
            { dtlsParameters }: { dtlsParameters: any },
            callback: () => void,
            errback: (error: any) => void
          ) => {
            try {
              socket.emit("transport-connect", {
                dtlsParameters: dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        producerTransport.current.on(
          "produce",
          async (
            parameters: any,
            callback: ({ id }: { id: string }) => void,
            errback: (error: any) => void
          ) => {
            log(parameters);

            try {
              socket.emit(
                "transport-produce",
                {
                  transportId: producerTransport.current.id,
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id }: { id: string }) => {
                  callback({ id });
                }
              );
            } catch (error) {
              errback(error);
            }
          }
        );

        connectSendTransport();
      }
    );
  };

  const connectSendTransport = async () => {
    log(params);
    producer = await producerTransport.current.produce(params);

    producer.on("trackended", () => {
      log("track ended");
    });

    producer.on("transportclose", () => {
      log("transport ended");
    });
  };

  useEffect(() => {
    return () => {
      log("stopping");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      producerTransport.current.close();
      socket.disconnect();
    };
  }, []);

  return { getLocalStream };
};

export const useReceiverStream = (
  socket: Socket,
  remoteVideo: React.RefObject<HTMLVideoElement>
) => {
  let device: mediasoupTypes.Device;
  let rtpCapabilities: mediasoupTypes.RtpCapabilities;
  let consumerTransport = useRef<mediasoupTypes.Transport>();
  let consumer = useRef<mediasoupTypes.Consumer>();
  let producerId: string;

  const goConsume = (pId: string) => {
    if (consumer.current) {
      consumer.current.close();
      consumer.current = undefined;
    }
    if (consumerTransport.current) {
      consumerTransport.current.close();
      consumerTransport.current = undefined;
    }
    producerId = pId;
    getRtpCapabilities();
  };

  const createDevice = async () => {
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      log("Device RTP Capabilities: ", rtpCapabilities);
      createRecvTransport();
    } catch (err) {
      log(err);
    }
  };

  const getRtpCapabilities = () => {
    socket.emit(
      "createRoom",
      (data: { rtpCapabilities: mediasoupTypes.RtpCapabilities }) => {
        log(`rtpCapabilities: ${data.rtpCapabilities}`);
        rtpCapabilities = data.rtpCapabilities;
        createDevice();
      }
    );
  };

  const createRecvTransport = async () => {
    log("creating transport");
    socket.emit(
      "createWebRtcTransport",
      { sender: false },
      ({ params }: { params: any }) => {
        if (params.error) {
          log(params.error);
          return;
        }

        consumerTransport.current = device.createRecvTransport(params);

        consumerTransport.current.on(
          "connect",
          async (
            { dtlsParameters }: { dtlsParameters: any },
            callback: () => void,
            errback: (error: any) => void
          ) => {
            try {
              socket.emit("transport-recv-connect", {
                dtlsParameters,
              });

              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        log("transport created");
        connectRecvTransport();
      }
    );
  };

  const connectRecvTransport = async () => {
    log("device rtp capabilities: ", device.rtpCapabilities);
    socket.emit(
      "consume",
      {
        producerId,
        rtpCapabilities: device.rtpCapabilities,
      },
      async ({ params }: { params: any }) => {
        if (params.error) {
          log("Cannot Consume");
          return;
        }

        log(params);
        consumer.current = await consumerTransport.current?.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        const { track } = consumer.current as mediasoupTypes.Consumer;

        if (remoteVideo.current) {
          remoteVideo.current.srcObject = new MediaStream([track]);
          socket.emit("consumer-resume");
          remoteVideo.current
            .play()
            .then((value) => {
              log("play successful");
              log(value);
            })
            .catch((error) => {
              log("play returned an error");
              log(error);
            });
        }
      }
    );
  };

  useEffect(() => {
    return () => {
      log("stopping");
      consumerTransport.current?.close();
      socket.disconnect();
    };
  }, []);

  return { goConsume };
};
