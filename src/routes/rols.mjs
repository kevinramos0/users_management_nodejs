import { Router } from 'express';
import CheckAuth from '../middlewares/auth.mjs';
import checkRole from '../middlewares/rol.mjs';
import asyncHandler from '../middlewares/tryCatch.mjs';
import RolsController from '../controllers/rolsController.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';
import { createRolSchema, updateRolSchema } from '../validators/rolSchema.mjs';

import Rols from '../utils/enumRoles.mjs';

const router = Router();
router.get('/', [CheckAuth, checkRole(Rols.adminGetRol)], asyncHandler(RolsController.findAll));
router.post(
  '/',
  [CheckAuth, checkRole(Rols.adminCreateRol), ValidateSchema(createRolSchema)],
  asyncHandler(RolsController.create),
);
router.get('/:id', [CheckAuth, checkRole(Rols.adminGetRol)], asyncHandler(RolsController.findOne));
router.put(
  '/:id',
  [CheckAuth, checkRole(Rols.adminUpdateRol), ValidateSchema(updateRolSchema)],
  asyncHandler(RolsController.update),
);
router.delete(
  '/:id',
  [CheckAuth, checkRole(Rols.adminDeleteRol)],
  asyncHandler(RolsController.delete),
);
export default router;
