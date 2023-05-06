import { tokenAuthenticationMiddleware } from "../middlewares/tokenAuthentication";
import { streamManagerController } from "../controllers/streamManager.controller";
import express from "express";

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

router.get("/activeStreams", streamManagerController.getActiveStreams);

export default router;
