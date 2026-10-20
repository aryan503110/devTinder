import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.js";
import { connection } from "../controllers/connectionControllers.js";

router.post("/:status/:touser", authMiddleware, connection);

export default router;
