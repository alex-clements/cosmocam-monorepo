import express from "express";
import { mediaserverController } from "../controllers/mediaserver.controller";
import { tokenAuthenticationMiddleware } from "../middlewares/tokenAuthentication";

const router = express.Router();

router.use(tokenAuthenticationMiddleware.authenticateAccessToken);

/* GET User Media Server */
router.get("/user", mediaserverController.getMediaServer);

export default router;
