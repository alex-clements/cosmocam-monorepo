import { streamManagerController } from "../controllers/streamManager.controller";
import express from "express";
import { tokenAuthenticationMiddleware } from "../middlewares/tokenAuthentication.mid";

const router = express.Router();

router.use(tokenAuthenticationMiddleware.authenticateAccessToken);

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
