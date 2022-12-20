import express from "express";
import { authenticationController } from "../controllers/authentication.controller";

const router = express.Router();

/* POST Authenticate */
router.post("/user", authenticationController.authenticateUser);

router.post("/token", authenticationController.authenticateToken);

router.post("/logout", authenticationController.logout);

export default router;
