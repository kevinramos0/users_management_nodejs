import { Router } from 'express';
import CheckAuth from '../middlewares/auth.mjs';
// import checkRole from '../middlewares/rol.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';
import { createUserSchema, updateUserSchema } from '../validators/userSchema.mjs';
import asyncHandler from '../middlewares/tryCatch.mjs';
import UserController from '../controllers/usersController.mjs';
import changePasswordSchema from '../validators/changePasswordSchema.mjs';

const router = Router();

router.get(
  '/',
  // [CheckAuth, checkRole(['SuperAdmin', 'Administrador', 'Usuario'])],
  asyncHandler(UserController.findAll),
);

router.post(
  '/change/password',
  [CheckAuth, ValidateSchema(changePasswordSchema)],
  asyncHandler(UserController.changePassword),
);

router.get(
  '/:id',
  // [CheckAuth, checkRole(['SuperAdmin', 'Administrador', 'Usuario'])],
  asyncHandler(UserController.findOne),
);

router.post('/', [ValidateSchema(createUserSchema)], asyncHandler(UserController.createUser));

router.put(
  '/:id',
  [ValidateSchema(updateUserSchema)],
  asyncHandler(UserController.editUser),
);

router.delete(
  '/:id',
  [CheckAuth],
  asyncHandler(UserController.deleteUser),
);
export default router;
