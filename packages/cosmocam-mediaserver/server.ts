import express from "express";
import streamManagerRouter from "./src/routes/streamManager.router";
import fs from "fs";
import https from "https";
import { socketSetup } from "./src/socket/socket";
import dotenv from "dotenv";
import cors from "cors";

// get config vars
dotenv.config();

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());
app.use("/streamManager", streamManagerRouter);

/* Error handler middleware */
app.use((err: any, req: any, res: any, next: any) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

const options =
  process.env.NODE_ENV == "development"
    ? {
        key: fs.readFileSync("./ssl/key.pem", "utf-8"),
        cert: fs.readFileSync("./ssl/cert.pem", "utf-8"),
      }
    : {
        key: fs.readFileSync(
          "./packages/cosmocam-backend/ssl/key.pem",
          "utf-8"
        ),
        cert: fs.readFileSync(
          "./packages/cosmocam-backend/ssl/cert.pem",
          "utf-8"
        ),
      };

const httpsServer = https.createServer(options, app);

httpsServer.listen(port, () => {
  console.log(`Mediaserver listening at port: ${port}`);
});

socketSetup(httpsServer);
