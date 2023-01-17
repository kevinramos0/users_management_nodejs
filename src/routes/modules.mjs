import { Router } from 'express';
import CheckAuth from '../middlewares/auth.mjs';
import checkRole from '../middlewares/rol.mjs';
import asyncHandler from '../middlewares/tryCatch.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';
import ModulesController from '../controllers/modulesController.mjs';
import { createModuleSchema, updateModuleSchema } from '../validators/moduleSchema.mjs';
import Rols from '../utils/enumRoles.mjs';

const router = Router();
router.get(
  '/',
  [CheckAuth, checkRole(Rols.adminGetModule)],
  asyncHandler(ModulesController.findAll)
);
router.post(
  '/',
  [CheckAuth, checkRole(Rols.adminCreateModule), ValidateSchema(createModuleSchema)],
  asyncHandler(ModulesController.create)
);
router.get(
  '/:id',
  [CheckAuth, checkRole(Rols.adminGetModule)],
  asyncHandler(ModulesController.findOne)
);
router.put(
  '/:id',
  [CheckAuth, checkRole(Rols.adminUpdateModule), ValidateSchema(updateModuleSchema)],
  asyncHandler(ModulesController.update)
);
router.delete(
  '/:id',
  [CheckAuth, checkRole(Rols.adminDeleteModule)],
  asyncHandler(ModulesController.delete)
);
export default router;
