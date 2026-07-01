import express from 'express';
import { getAllModules, getModuleById, createModule, updateModule, deleteModule } from '../controllers/moduleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';
import validateRequest from '../middlewares/validateRequest.js';
import { moduleValidator, moduleIdValidator } from '../validators/moduleValidator.js';

const router = express.Router();

router.get('/', authMiddleware, getAllModules);
router.get('/:id', authMiddleware, moduleIdValidator, validateRequest, getModuleById);
router.post('/', authMiddleware, adminMiddleware, moduleValidator, validateRequest, createModule);
router.put('/:id', authMiddleware, adminMiddleware, moduleIdValidator, moduleValidator, validateRequest, updateModule);
router.delete('/:id', authMiddleware, adminMiddleware, moduleIdValidator, validateRequest, deleteModule);

export default router;
