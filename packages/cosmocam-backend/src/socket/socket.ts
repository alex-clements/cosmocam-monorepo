import https from "https";
import { Server } from "socket.io";
import { types as mediasoupTypes } from "mediasoup";
import { StreamManagerSingleton } from "../models/StreamManager/StreamManagerSingleton";
import { getLocalIPAddress, mediaCodecs } from "./util";
import { createLogger } from "@cosmocam/shared";
const mediasoup = require("mediasoup");

const loggingEnabled = false;
const log = createLogger(loggingEnabled, "Socket file:");

const handleSocketDisconnect = (socket: any) => {
  log(`Socket Disconnected: ${socket.id}`);
  const streamManager = StreamManagerSingleton.getStreamManager();
  streamManager.removeSocket(socket.id);
};

export const socketSetup = (httpsServer: https.Server) => {
  const io = new Server(httpsServer);
  let streamManager = StreamManagerSingleton.getStreamManager();
  let worker: mediasoupTypes.Worker;

  const getRtpCapabilities = (socket: any, callback: ({}) => void) => {
    const user = streamManager.getUserBySocketId(socket.id);
    if (user) {
      let router = user.getRouter();
      const rtpCapabilities = router?.rtpCapabilities;
      callback({ rtpCapabilities });
    }
  };

  const createWorker = async (): Promise<mediasoupTypes.Worker> => {
    worker = await mediasoup.createWorker({
      logLevel: "warn",
      rtcMinPort: 2000,
      rtcMaxPort: 2100,
    });
    log(`worker pid ${worker.pid}`);

    worker.on("died", (error) => {
      log("mediasoup worker has died");
      setTimeout(() => process.exit(1), 2000); // exit in 2 seconds
    });

    return worker;
  };

  createWorker().then((data) => {
    worker = data;
  });

  const createWebRtcTransport = async (socket: any, callback: any) => {
    try {
      const localIPAddress: string = getLocalIPAddress();
      const webRtcTransport_options = {
        listenIps: [{ ip: localIPAddress }],
        enableUdp: true,
        enableTcp: true,
        preferUdp: true,
      };
      let router = streamManager.getUserBySocketId(socket.id)?.getRouter();
      if (!router) {
        log("Router not found in createWebRtcTransport");
        return;
      }
      let transport = await router.createWebRtcTransport(
        webRtcTransport_options
      );

      log(`transport id: ${transport.id}`);

      transport.on("dtlsstatechange", (dtlsState: any) => {
        if (dtlsState === "closed") {
          transport.close();
        }
      });

      transport.on("@close", () => {
        log("transport closed");
      });

      callback({
        params: {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        },
      });

      return transport;
    } catch (error) {
      log(error);
    }
  };

  const peers = io.of("/mediasoup");

  peers.on("connection", async (socket) => {
    log(`socket connected: ${socket.id}`);
    streamManager.registerSocket(socket);
    socket.emit("connection-success", {
      socketId: socket.id,
    });

    socket.on("startProducer", async ({ producerSocketId }, callback) => {
      const user = streamManager.getUserBySocketId(socket.id);

      if (!user) {
        return;
      }

      const sendingSocket = user.getSendingSocket(producerSocketId);
      const receivingSocket = user.getReceivingSocket(socket.id);

      if (!sendingSocket || !receivingSocket) {
        return;
      }

      receivingSocket.assignToSendingSocket(sendingSocket, callback);
    });

    socket.on("disconnect", () => handleSocketDisconnect(socket));

    socket.on("createRoom", async (callback) => {
      const user = streamManager.getUserBySocketId(socket.id);
      if (user) {
        let router = user.getRouter();
        if (router === undefined) {
          log("New Router Created");
          router = await worker.createRouter({ mediaCodecs });
          log(`Router ID: ${router.id}`);
          user.assignRouter(router);
        }
      }

      getRtpCapabilities(socket, callback);
    });

    socket.on("getRtpCapabilities", (callback) => {
      let router = streamManager.getUserBySocketId(socket.id)?.getRouter();
      if (!router) {
        log("Router not found in getRptCapabilities");
        return;
      }
      const rtpCapabilities = router.rtpCapabilities;
      log("rtpCapabilities", rtpCapabilities);
      callback({ rtpCapabilities });
    });

    socket.on("createWebRtcTransport", async ({ sender }, callback) => {
      log(`Is this a sender request? ${sender}`);
      const user = streamManager.getUserBySocketId(socket.id);
      if (!user) return;

      if (sender) {
        let sendingSocket = user.getSendingSocket(socket.id);
        let producerTransport = (await createWebRtcTransport(
          socket,
          callback
        )) as mediasoupTypes.WebRtcTransport;
        sendingSocket?.assignProducerTransport(producerTransport);
      } else {
        let receivingSocket = user.getReceivingSocket(socket.id);
        let consumerTransport = (await createWebRtcTransport(
          socket,
          callback
        )) as mediasoupTypes.WebRtcTransport;
        receivingSocket?.assignConsumerTransport(consumerTransport);
      }
    });

    socket.on("transport-connect", async ({ dtlsParameters }) => {
      log("DTLS PARAMS...", { dtlsParameters });
      let producerTransport = streamManager
        .getUserBySocketId(socket.id)
        ?.getSendingSocket(socket.id)
        ?.getProducerTransport();
      await producerTransport?.connect({ dtlsParameters });
    });

    socket.on(
      "transport-produce",
      async ({ kind, rtpParameters, appData }, callback) => {
        let producerTransport = streamManager
          .getUserBySocketId(socket.id)
          ?.getSendingSocket(socket.id)
          ?.getProducerTransport();
        let producer = (await producerTransport?.produce({
          kind,
          rtpParameters,
        })) as mediasoupTypes.Producer;
        streamManager
          .getUserBySocketId(socket.id)
          ?.getSendingSocket(socket.id)
          ?.assignProducer(producer);
        log("Producer ID: ", producer.id, producer.kind);

        producerTransport?.on("@producerclose", () => {
          log("transport for this producer is closed");
          producerTransport?.close();
        });

        callback({ id: producer.id });
      }
    );

    socket.on("transport-recv-connect", async ({ dtlsParameters }) => {
      log(`DTLS PARAMS: ${dtlsParameters}`);
      let consumerTransport = streamManager
        .getUserBySocketId(socket.id)
        ?.getReceivingSocket(socket.id)
        ?.getConsumerTransport();
      await consumerTransport?.connect({ dtlsParameters });
    });

    socket.on("consume", async ({ rtpCapabilities, producerId }, callback) => {
      try {
        log("starting consume");
        let router = streamManager.getUserBySocketId(socket.id)?.getRouter();
        if (!router) {
          log("Router not found in consume");
          return;
        }

        log(`consume producerId: ${producerId}`);

        if (router.canConsume({ producerId, rtpCapabilities })) {
          let consumerTransport = streamManager
            .getUserBySocketId(socket.id)
            ?.getReceivingSocket(socket.id)
            ?.getConsumerTransport();
          let consumer = (await consumerTransport?.consume({
            producerId,
            rtpCapabilities,
            paused: true,
          })) as mediasoupTypes.Consumer;

          if (!consumer) {
            log("consumer is undefined");
            return;
          }

          consumer.on("transportclose", () => {
            log("transport close from consumer");
          });

          consumer.on("producerclose", () => {
            log("producer of consumer closed");
          });

          const params = {
            id: consumer.id,
            producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
          };

          streamManager
            .getUserBySocketId(socket.id)
            ?.getReceivingSocket(socket.id)
            ?.assignConsumer(consumer);

          callback({ params });
        } else {
          log("router cannot consume");
        }
      } catch (error) {
        log(error);
        callback({
          params: {
            error: error,
          },
        });
      }
    });

    socket.on("consumer-resume", async () => {
      log("consumer resume");
      let consumer = streamManager
        .getUserBySocketId(socket.id)
        ?.getReceivingSocket(socket.id)
        ?.getConsumer();
      await consumer?.resume();
    });
  });
};
