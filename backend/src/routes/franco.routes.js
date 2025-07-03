import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import {
  getFrancosByEmployee,
  requestFranco,
  adminAssignFranco
} from '../controllers/franco.controller.js';

const router = express.Router();

// ✅ Ver francos del empleado logueado
router.get('/', verifyToken, getFrancosByEmployee);

// ✅ Empleado solicita un franco
router.post('/request', verifyToken, requestFranco);

// ✅ Admin asigna un franco a un empleado
router.post('/assign', verifyToken, isAdmin, adminAssignFranco);

export default router;
