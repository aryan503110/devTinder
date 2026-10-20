import express from "express";
const router = express.Router();
import { getProfile, editProfile } from "../controllers/profileControllers.js";
import authMiddleware from "../middleware/auth.js";

router.get("/profile", authMiddleware, getProfile);
router.put("/editprofile", authMiddleware, editProfile);

export default router;
