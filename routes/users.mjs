import { Router } from 'express';
import CheckAuth from '../app/middlewares/auth.mjs';
import checkRole from '../app/middlewares/rol.mjs';
import ValidateSchema from '../app/middlewares/ValidateSchemasAjv.mjs';
import userSchema from '../validators/profileSchema.mjs';
import changePasswordSchema from '../validators/changePasswordSchema.mjs';
import asyncHandler from '../app/middlewares/tryCatch.mjs';
import UserController from '../app/controllers/usersController.mjs';

const router = Router();

router.get(
  '/',
  [CheckAuth, checkRole(['SuperAdmin', 'Administrador', 'Usuario'])],
  asyncHandler(UserController.getUsers),
);

router.post(
  '/change/password/:id',
  [CheckAuth, checkRole(['SuperAdmin', 'Administrador', 'Usuario']), ValidateSchema(changePasswordSchema)],
  asyncHandler(UserController.changePassword),
);

router.get(
  '/verify/account/:token',
  asyncHandler(UserController.verifyAccount),
);

// enpoint para enviar correo solicitando el cambio de contraseña
router.post(
  '/restart/password',
  asyncHandler(UserController.resetPassword),
);

// crear nueva contraseña
router.post(
  '/reset/password/:token',
  asyncHandler(UserController.newPassword),
);

router.get(
  '/:id',
  [CheckAuth, checkRole(['SuperAdmin', 'Administrador', 'Usuario'])],
  asyncHandler(UserController.getOneUser),
);

router.post('/', [ValidateSchema(userSchema)], asyncHandler(UserController.createUser));

router.put(
  '/:id',
  [CheckAuth, checkRole(['SuperAdmin', 'Administrador', 'Usuario']), ValidateSchema(userSchema)],
  asyncHandler(UserController.editUser),
);

router.delete(
  '/:id',
  [CheckAuth, checkRole(['SuperAdmin', 'Administrador'])],
  asyncHandler(UserController.deleteUser),
);
export default router;
