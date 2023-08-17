import express from "express";
import { mediaserverController } from "../controllers/mediaserver.controller";

const router = express.Router();

/* POST Authenticate User */
router.post("/user", mediaserverController.getMediaServer);

export default router;
