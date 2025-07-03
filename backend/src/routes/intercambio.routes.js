import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import {
  requestIntercambio,
  acceptIntercambio,
  getIntercambiosByEmployee,
  adminApproveIntercambio
} from '../controllers/intercambio.controller.js';

const router = express.Router();

// ✅ Empleado solicita un intercambio
router.post('/request', verifyToken, requestIntercambio);

// ✅ Empleado acepta un intercambio pendiente
router.post('/accept/:id', verifyToken, acceptIntercambio);

// ✅ Ver intercambios del empleado
router.get('/', verifyToken, getIntercambiosByEmployee);

// ✅ Admin aprueba el intercambio
router.post('/admin/approve/:id', verifyToken, isAdmin, adminApproveIntercambio);

export default router;
