import express from "express";
import { getPersonalProfile } from "../controllers/personal.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getFrancosByEmployee } from "../controllers/franco.controller.js";

const router = express.Router();

router.get("/profile", verifyToken, getPersonalProfile);
router.get("/francos", verifyToken, getFrancosByEmployee);

export default router;
