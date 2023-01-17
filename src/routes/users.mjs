import { Router } from 'express';
import CheckAuth from '../middlewares/auth.mjs';
import checkRole from '../middlewares/rol.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';
import { createUserSchema, updateUserSchema } from '../validators/userSchema.mjs';
import asyncHandler from '../middlewares/tryCatch.mjs';
import UserController from '../controllers/usersController.mjs';
import changePasswordSchema from '../validators/changePasswordSchema.mjs';
import Rols from '../utils/enumRoles.mjs';

const router = Router();

router.get('/', [CheckAuth, checkRole([Rols.adminGetUser])], asyncHandler(UserController.findAll));

router.post(
  '/change/password',
  [
    CheckAuth,
    checkRole(Rols.adminUpdateUser, Rols.updateUser),
    ValidateSchema(changePasswordSchema),
  ],
  asyncHandler(UserController.changePassword)
);

router.get(
  '/:id',
  [CheckAuth, checkRole([Rols.adminGetUser, Rols.getUser])],
  asyncHandler(UserController.findOne)
);

router.post(
  '/',
  [CheckAuth, checkRole([Rols.adminCreateUser, Rols.createUser]), ValidateSchema(createUserSchema)],
  asyncHandler(UserController.createUser)
);

router.put(
  '/:id',
  [CheckAuth, checkRole([Rols.adminUpdateUser, Rols.updateUser]), ValidateSchema(updateUserSchema)],
  asyncHandler(UserController.editUser)
);

router.delete(
  '/:id',
  [CheckAuth, checkRole([Rols.adminDeleteUser])],
  asyncHandler(UserController.deleteUser)
);
export default router;
