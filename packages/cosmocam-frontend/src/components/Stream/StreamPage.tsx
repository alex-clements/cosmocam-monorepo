import { Button } from "@mui/material";
import { useRef } from "react";
import { io } from "socket.io-client";
import { types as mediasoupTypes } from "mediasoup-client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
const mediasoupClient = require("mediasoup-client");

export const StreamPage = () => {
  const socket = io("/mediasoup");
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  socket.on("connection-success", (socketId) => {
    console.log(socketId);
  });

  let device: any;
  let rtpCapabilities: mediasoupTypes.RtpCapabilities;
  let producerTransport: any;
  let producer: any;
  let consumerTransport: any;
  let consumer: any;

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

  const streamSuccess = async (stream: MediaStream) => {
    if (localVideo.current) {
      localVideo.current.srcObject = stream;
      await localVideo.current.play();
    }
    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];
    params = {
      track: videoTrack,
      ...params,
    };
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

  const createDevice = async () => {
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      console.log("RTP Capabilities: ", rtpCapabilities);
    } catch (err) {
      console.log(err);
    }
  };

  const getRtpCapabilities = () => {
    socket.emit(
      "getRtpCapabilities",
      (data: { rtpCapabilities: mediasoupTypes.RtpCapabilities }) => {
        console.log(`rtpCapabilities: ${data.rtpCapabilities}`);
        rtpCapabilities = data.rtpCapabilities;
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
                // transportId: producerTransport.id,
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
      }
    );
  };

  const connectSendTransport = async () => {
    producer = await producerTransport.produce(params);

    producer.on("trackended", () => {
      console.log("track ended");
    });

    producer.on("transportclose", () => {
      console.log("transport ended");
    });
  };

  const createRecvTransport = async () => {
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
      }
    );
  };

  const connectRecvTransport = async () => {
    await socket.emit(
      "consume",
      {
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1} sx={{ marginTop: 1 }}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={getLocalStream}>
            1. Get Video
          </Button>
          <Button variant="contained" onClick={getRtpCapabilities}>
            2. Get RTP Capabilities
          </Button>
          <Button variant="contained" onClick={createDevice}>
            3. Create Device
          </Button>
          <Button variant="contained" onClick={createSendTransport}>
            4. Create Send Transport
          </Button>
          <Button variant="contained" onClick={connectSendTransport}>
            5. Connect Send Transport
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={createRecvTransport}>
            6. Create Receive Transport
          </Button>
          <Button variant="contained" onClick={connectRecvTransport}>
            7. Connect Receive Transport
          </Button>
        </Grid>
        <Grid item xs={12}>
          <video
            autoPlay
            loop
            controls
            playsInline
            muted
            ref={localVideo}
          ></video>
        </Grid>
        <Grid item xs={12}>
          <video
            autoPlay
            loop
            controls
            playsInline
            muted
            ref={remoteVideo}
          ></video>
        </Grid>
      </Grid>
    </Box>
  );
};
