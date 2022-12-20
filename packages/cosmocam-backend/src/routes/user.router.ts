import express from "express";
import { userController } from "../controllers/userController";

const router = express.Router();

/* POST User */
router.post("/register", userController.create);

/* PUT User */
router.put("/update", userController.update);

export default router;
