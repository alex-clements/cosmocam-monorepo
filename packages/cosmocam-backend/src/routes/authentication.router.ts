import express from "express";
import { authenticationController } from "../controllers/authentication.controller";

const router = express.Router();

/* POST Authenticate User */
router.post("/user", authenticationController.authenticateUser);

/* POST Authenticate Token */
router.post("/token", authenticationController.authenticateToken);

/* POST Log Out */
router.post("/logout", authenticationController.logout);

export default router;
