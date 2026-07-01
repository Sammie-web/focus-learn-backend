import express from 'express';
import { register, login, adminLogin, getCurrentUser, refresh } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { registerValidator, loginValidator } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.post('/admin/login', loginValidator, validateRequest, adminLogin);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/refresh', refresh);

export default router;
