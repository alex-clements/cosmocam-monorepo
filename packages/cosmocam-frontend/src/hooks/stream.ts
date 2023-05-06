import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { types as mediasoupTypes } from "mediasoup-client";
import {
  registerSendingSocket,
  registerReceivingSocket,
} from "../services/socket";
import { useUserContext } from "../components/Context/Providers";

const mediasoupClient = require("mediasoup-client");

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

export const useProducerStream = (
  localVideo: React.RefObject<HTMLVideoElement>
) => {
  const socket = io("/mediasoup");
  const streamRef = useRef<MediaStream>();
  const { token } = useUserContext();
  let device: any;
  let rtpCapabilities: mediasoupTypes.RtpCapabilities;
  let producerTransport: any;
  let producer: any;

  socket.on("connection-success", ({ socketId }) => {
    console.log(socketId);
    registerSendingSocket({ token, socketId });
  });

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
    goConnect(true);
  };

  const getLocalStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
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
        console.log(error);
      });
  };

  const goConsume = () => {
    goConnect(false);
  };

  const goConnect = (producerOrConsumer: boolean) => {
    getRtpCapabilities();
  };

  const createDevice = async () => {
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      console.log("Device RTP Capabilities: ", rtpCapabilities);
      createSendTransport();
    } catch (err) {
      console.log(err);
    }
  };

  const getRtpCapabilities = () => {
    socket.emit(
      "createRoom",
      (data: { rtpCapabilities: mediasoupTypes.RtpCapabilities }) => {
        console.log(`rtpCapabilities: ${data.rtpCapabilities}`);
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
          console.log(params.error);
          return;
        }
        console.log(params);

        producerTransport = device.createSendTransport(params);

        producerTransport.on(
          "connect",
          async (
            { dtlsParameters }: { dtlsParameters: any },
            callback: () => void,
            errback: (error: any) => void
          ) => {
            try {
              await socket.emit("transport-connect", {
                dtlsParameters: dtlsParameters,
              });
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        producerTransport.on(
          "produce",
          async (
            parameters: any,
            callback: ({ id }: { id: string }) => void,
            errback: (error: any) => void
          ) => {
            console.log(parameters);

            try {
              await socket.emit(
                "transport-produce",
                {
                  transportId: producerTransport.id,
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
    console.log(params);
    producer = await producerTransport.produce(params);

    producer.on("trackended", () => {
      console.log("track ended");
    });

    producer.on("transportclose", () => {
      console.log("transport ended");
    });
  };

  useEffect(() => {
    return () => {
      console.log("stopping");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socket.disconnect();
      // producerTransport.close();
    };
  }, []);

  return { goConsume, getLocalStream };
};

export const useReceiverStream = (
  remoteVideo: React.RefObject<HTMLVideoElement>
) => {
  const socket = io("/mediasoup");
  const streamRef = useRef<MediaStream>();
  const { token } = useUserContext();
  let device: any;
  let rtpCapabilities: mediasoupTypes.RtpCapabilities;
  let consumerTransport: any;
  let consumer: any;
  let producerId: string;

  socket.on("connection-success", ({ socketId, existsProducer }) => {
    console.log(socketId, existsProducer);
    registerReceivingSocket({ token, socketId });
  });

  const goConsume = (pId: string) => {
    producerId = pId;
    goConnect(false);
  };

  const goConnect = (producerOrConsumer: boolean) => {
    getRtpCapabilities();
  };

  const createDevice = async () => {
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      console.log("Device RTP Capabilities: ", rtpCapabilities);
      createRecvTransport();
    } catch (err) {
      console.log(err);
    }
  };

  const getRtpCapabilities = () => {
    socket.emit(
      "createRoom",
      (data: { rtpCapabilities: mediasoupTypes.RtpCapabilities }) => {
        console.log(`rtpCapabilities: ${data.rtpCapabilities}`);
        rtpCapabilities = data.rtpCapabilities;
        createDevice();
      }
    );
  };

  const createRecvTransport = async () => {
    console.log("creating transport");
    socket.emit(
      "createWebRtcTransport",
      { sender: false },
      ({ params }: { params: any }) => {
        if (params.error) {
          console.log(params.error);
          return;
        }

        console.log(params);

        consumerTransport = device.createRecvTransport(params);

        consumerTransport.on(
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

        console.log("transport created");
        connectRecvTransport();
      }
    );
  };

  const connectRecvTransport = async () => {
    console.log("starting connect receive transport");
    console.log("device rtp capabilities: ", device.rtpCapabilities);
    socket.emit(
      "consume",
      {
        producerId,
        rtpCapabilities: device.rtpCapabilities,
      },
      async ({ params }: { params: any }) => {
        if (params.error) {
          console.log("Cannot Consume");
          return;
        }

        console.log(params);
        consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        const { track } = consumer;

        if (remoteVideo.current) {
          remoteVideo.current.srcObject = new MediaStream([track]);
          socket.emit("consumer-resume");
          remoteVideo.current
            .play()
            .then((value) => {
              console.log("play successful");
              console.log(value);
            })
            .catch((error) => {
              console.log("play returned an error");
              console.log(error);
            });
        }
      }
    );
  };

  useEffect(() => {
    return () => {
      console.log("stopping");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socket.disconnect();
    };
  }, []);

  return { goConsume };
};
