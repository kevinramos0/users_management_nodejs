import { Router } from 'express';
import authController from '../controllers/authController.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';
import CheckAuth from '../middlewares/auth.mjs';
import loginSchema from '../validators/loginSchema.mjs';
import resetPasswordSchema from '../validators/resetPasswordSchema.mjs';
import asyncHandler from '../middlewares/tryCatch.mjs';

const router = Router();

router.post('/login', [ValidateSchema(loginSchema)], asyncHandler(authController.login));
router.post('/logout', [CheckAuth], asyncHandler(authController.logout));
router.post('/reset/password', asyncHandler(authController.restorePassword));
router.post(
  '/create/password/:token',
  [ValidateSchema(resetPasswordSchema)],
  asyncHandler(authController.saveNewPassword)
);
router.post('/verify/account/:token', asyncHandler(authController.verifyUser));
router.post('/refresh/:refreshToken', asyncHandler(authController.refreshToken));

export default router;
