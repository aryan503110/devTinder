import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.js";
import {
  sendConnection,
  reviewConnection,
} from "../controllers/connectionControllers.js";

router.post("/send/:status/:touser", authMiddleware, sendConnection);
router.post("/review/:status/:requestId", authMiddleware, reviewConnection);

export default router;
