import { streamManagerController } from "../controllers/streamManager.controller";
import express from "express";

const router = express.Router();

/* POST Register Sending Socket */
router.post(
  "/registerSendingSocket",
  streamManagerController.registerSendingSocket
);

/* POST Register Receiving Socket */
router.post(
  "/registerReceivingSocket",
  streamManagerController.registerReceivingSocket
);

/* GET Active Streams */
router.get("/activeStreams", streamManagerController.getActiveStreams);

export default router;
