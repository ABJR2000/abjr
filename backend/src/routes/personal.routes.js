import express from "express";
import { getPersonalProfile } from "../controllers/personal.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyToken, getPersonalProfile);

export default router;
