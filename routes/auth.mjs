import { Router } from 'express';
import authController from '../app/controllers/authController.mjs';
import ValidateSchema from '../app/middlewares/ValidateSchemasAjv.mjs';
import CheckAuth from '../app/middlewares/auth.mjs';
import loginSchema from '../validators/loginSchema.mjs';
import asyncHandler from '../app/middlewares/tryCatch.mjs';

const router = Router();

router.post('/login', [ValidateSchema(loginSchema)], asyncHandler(authController.login));
router.post('/logout', [CheckAuth], asyncHandler(authController.logout));
router.post('/refresh-token', asyncHandler(authController.refresh));

export default router;
