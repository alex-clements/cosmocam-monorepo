import express from "express";
import userRouter from "./src/routes/user.router";
import authenticationRouter from "./src/routes/authentication.router";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import https from "https";
import { Server } from "socket.io";
import { types as mediasoupTypes } from "mediasoup";
const mediasoup = require("mediasoup");

const app = express();
const port = 3001;

app.use(express.json());
app.use("/users", userRouter);
app.use("/authenticate", authenticationRouter);

app.use(express.static("public"));
app.use(
  express.static(path.join(__dirname, "../../cosmocam-frontend", "build"))
);

/* Error handler middleware */
app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

const options = {
  key: fs.readFileSync("./ssl/key.pem", "utf-8"),
  cert: fs.readFileSync("./ssl/cert.pem", "utf-8"),
};

const httpsServer = https.createServer(options, app);

// Catch all
app.get("*", (req: Request, res: Response) => {
  res.sendFile(
    path.join(
      __dirname,
      "public",
      "../../../cosmocam-frontend/build/index.html"
    )
  );
});

httpsServer.listen(port, () => {
  console.log(`Example app listening at port: ${port}`);
});

const io = new Server(httpsServer);

let worker: mediasoupTypes.Worker;
let router: mediasoupTypes.Router;
let producer: any;
let consumer: any;
let producerTransport: mediasoupTypes.WebRtcTransport | undefined;
let consumerTransport: mediasoupTypes.WebRtcTransport | undefined;

const createWorker = async (): Promise<mediasoupTypes.Worker> => {
  worker = await mediasoup.createWorker({
    logLevel: "warn",
    rtcMinPort: 2000,
    rtcMaxPort: 2020,
  });
  console.log(`worker pid ${worker.pid}`);

  worker.on("died", (error) => {
    console.log("mediasoup worker has died");
    setTimeout(() => process.exit(1), 2000); // exit in 2 seconds
  });

  return worker;
};

createWorker().then((data) => {
  worker = data;
});

const mediaCodecs: mediasoupTypes.RtpCodecCapability[] = [
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

const peers = io.of("/mediasoup");

peers.on("connection", async (socket) => {
  console.log(`socket connected: ${socket.id}`);
  socket.emit("connection-success", {
    socketId: socket.id,
    existsProducer: producer ? true : false,
  });

  socket.on("disconnect", () => {
    //cleanup
    console.log(`socket disconnected: ${socket.id}`);
  });

  socket.on("createRoom", async (callback) => {
    if (router === undefined) {
      router = await worker.createRouter({ mediaCodecs });
      console.log(`Router ID: ${router.id}`);
    }

    getRtpCapabilities(callback);
  });

  const getRtpCapabilities = (callback: ({}) => void) => {
    const rtpCapabilities = router.rtpCapabilities;
    callback({ rtpCapabilities });
  };

  router = await worker.createRouter({ mediaCodecs });

  socket.on("getRtpCapabilities", (callback) => {
    const rtpCapabilities = router?.rtpCapabilities;
    console.log("rtpCapabilities", rtpCapabilities);
    callback({ rtpCapabilities });
  });

  socket.on("createWebRtcTransport", async ({ sender }, callback) => {
    console.log(`Is this a sender request? ${sender}`);
    if (sender) {
      producerTransport = await createWebRtcTransport(callback);
    } else {
      consumerTransport = await createWebRtcTransport(callback);
    }
  });

  socket.on("transport-connect", async ({ dtlsParameters }) => {
    console.log("DTLS PARAMS...", { dtlsParameters });
    await producerTransport?.connect({ dtlsParameters });
  });

  socket.on(
    "transport-produce",
    async ({ kind, rtpParameters, appData }, callback) => {
      producer = await producerTransport?.produce({
        kind,
        rtpParameters,
      });

      console.log("Producer ID: ", producer.id, producer.kind);

      producerTransport?.on("@producerclose", () => {
        console.log("transport for this producer is closed");
        producerTransport?.close();
      });

      callback({ id: producer.id });
    }
  );

  socket.on("transport-recv-connect", async ({ dtlsParameters }) => {
    console.log(`DTLS PARAMS: ${dtlsParameters}`);
    await consumerTransport?.connect({ dtlsParameters });
  });

  socket.on("consume", async ({ rtpCapabilities }, callback) => {
    try {
      if (router.canConsume({ producerId: producer.id, rtpCapabilities })) {
        consumer = await consumerTransport?.consume({
          producerId: producer.id,
          rtpCapabilities,
          paused: true,
        });

        consumer.on("transportclose", () => {
          console.log("transport close from consumer");
        });

        consumer.on("producerclose", () => {
          console.log("producer of consumer closed");
        });

        const params = {
          id: consumer.id,
          producerId: producer.id,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        };

        callback({ params });
      }
    } catch (error) {
      console.log(error);
      callback({
        params: {
          error: error,
        },
      });
    }
  });

  socket.on("consumer-resume", async () => {
    console.log("consumer resume");
    await consumer.resume();
  });
});

const createWebRtcTransport = async (callback: any) => {
  try {
    const webRtcTransport_options = {
      listenIps: [{ ip: "192.168.50.55" }],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    };
    let transport = await router.createWebRtcTransport(webRtcTransport_options);

    console.log(`transport id: ${transport.id}`);

    transport.on("dtlsstatechange", (dtlsState) => {
      if (dtlsState === "closed") {
        transport.close();
      }
    });

    transport.on("@close", () => {
      console.log("transport closed");
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
    console.log(error);
  }
};
