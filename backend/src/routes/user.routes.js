import express from 'express';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { createUser, getEmployeeProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', verifyToken, isAdmin, createUser); // solo admin crea
router.get('/employee', verifyToken, getEmployeeProfile); // perfil personal

export default router;
