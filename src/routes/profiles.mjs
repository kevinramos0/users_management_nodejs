import { Router } from 'express';
import CheckAuth from '../middlewares/auth.mjs';
import checkRole from '../middlewares/rol.mjs';
import asyncHandler from '../middlewares/tryCatch.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';

import ProfileController from '../controllers/profilesController.mjs';
import { profileSchema, updateProfileSchema } from '../validators/profileSchema.mjs';
import Rols from '../utils/enumRoles.mjs';

const router = Router();
router.get(
  '/',
  [CheckAuth, checkRole(Rols.adminGetProfile)],
  asyncHandler(ProfileController.findAll)
);
router.post(
  '/',
  [CheckAuth, checkRole(Rols.admincreateProfile), ValidateSchema(profileSchema)],
  asyncHandler(ProfileController.create)
);
router.get(
  '/:id',
  [CheckAuth, checkRole(Rols.adminGetProfile, Rols.getProfile)],
  asyncHandler(ProfileController.findOne)
);
router.put(
  '/:id',
  [CheckAuth, checkRole(Rols.adminUpdateProfile), ValidateSchema(updateProfileSchema)],
  asyncHandler(ProfileController.update)
);
router.delete(
  '/:id',
  [CheckAuth, checkRole(Rols.adminDeleteProfile)],
  asyncHandler(ProfileController.delete)
);
export default router;
