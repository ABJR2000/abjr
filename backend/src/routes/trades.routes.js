import { Router } from "express";
import {
  publicarFranco,
  obtenerFrancosPublicados,
  proponerIntercambio,
  responderIntercambio,
  listarMisTrades
} from "../controllers/trades.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/publicar", verifyToken, publicarFranco);
router.get("/publicados", verifyToken, obtenerFrancosPublicados);
router.post("/proponer", verifyToken, proponerIntercambio);
router.patch("/:id", verifyToken, responderIntercambio);
router.get("/mis-trades", verifyToken, listarMisTrades);

export default router;
