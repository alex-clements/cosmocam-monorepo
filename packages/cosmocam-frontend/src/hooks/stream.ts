import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { types as mediasoupTypes } from "mediasoup-client";
import { SocketData, createLogger, loggingFiles } from "@cosmocam/shared";
import { fetchActiveStreams } from "../services/socket";
import { useUserContext } from "../components/Context/Providers";
const mediasoupClient = require("mediasoup-client");

const log = createLogger(
  !!loggingFiles.FRONTEND_STREAM,
  "Frontend Stream File:"
);

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
  stopTracks: false,
};

export const useProducerStream = ({
  socket,
  streamRef,
  activeDevice,
}: {
  socket: Socket;
  streamRef: React.MutableRefObject<MediaStream | undefined>;
  activeDevice: string;
}) => {
  let device: any;
  let rtpCapabilities: mediasoupTypes.RtpCapabilities;
  let producerTransport = useRef<any>();
  let producer: any;

  useEffect(() => {
    if (producerTransport.current) {
      producerTransport.current.close();
      producerTransport.current = undefined;
    }
  }, [activeDevice]);

  const startStream = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];
    params = {
      ...params,
      track: videoTrack,
    };
    getRtpCapabilities();
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

  const endStream = () => {
    producer?.close();
    producer = undefined;
    producerTransport.current?.close();
    producerTransport.current = undefined;
  };

  useEffect(() => {
    return () => {
      log("stopping");
      producerTransport.current?.close();
      socket?.disconnect();
    };
  }, []);

  return { startStream, endStream };
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

  const fetchProducerId = (socketId: string) => {
    log("fetching producer Id");
    socket.emit(
      "startProducer",
      { producerSocketId: socketId },
      ({ producerId }) => {
        log("producer id received: ", producerId);
        goConsume(producerId);
      }
    );
  };

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
      socket?.disconnect();
    };
  }, []);

  return { goConsume, fetchProducerId };
};

export const useFetchActiveStreams = () => {
  const [activeStreams, setActiveStreams] = useState<SocketData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useUserContext();

  useEffect(() => {
    fetchActiveStreams({ token }).then((response) => {
      setActiveStreams(response.data.socketData);
      setIsLoading(false);
    });
  }, [token]);

  return { activeStreams, isLoading };
};

export const useGetMediaDevices = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);

  navigator.mediaDevices.enumerateDevices().then((devices) => {
    let newDeviceList: any[] = [];
    for (let device of devices) {
      if (device.kind === "videoinput") newDeviceList.push(device);
    }
    setMediaDevices(newDeviceList);
    setIsLoading(false);
  });

  return { isLoading, mediaDevices };
};
