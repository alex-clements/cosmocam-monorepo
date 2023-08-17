import express from "express";
import userRouter from "./src/routes/user.router";
import authenticationRouter from "./src/routes/authentication.router";
import streamManagerRouter from "./src/routes/streamManager.router";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import https from "https";
import { socketSetup } from "./src/socket/socket";
import dotenv from "dotenv";

// get config vars
dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use("/users", userRouter);
app.use("/authenticate", authenticationRouter);
app.use("/streamManager", streamManagerRouter);

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

socketSetup(httpsServer);
