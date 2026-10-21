import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.js";
import {
  getFeed,
  getConnectionsRequests,
  getConnectionsAccepted,
} from "../controllers/userControllers.js";

router.get("/feed", authMiddleware, getFeed);
router.get("/getconnectionrequests", authMiddleware, getConnectionsRequests);
router.get("/getconnectionaccepted", authMiddleware, getConnectionsAccepted);

export default router;
