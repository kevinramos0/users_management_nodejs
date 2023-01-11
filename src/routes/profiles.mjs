import { Router } from 'express';
import asyncHandler from '../middlewares/tryCatch.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';

import ProfileController from '../controllers/profilesController.mjs';
import { profileSchema, updateProfileSchema } from '../validators/profileSchema.mjs';

const router = Router();
router.get('/', asyncHandler(ProfileController.findAll));
router.post('/', [ValidateSchema(profileSchema)], asyncHandler(ProfileController.create));
router.get('/:id', asyncHandler(ProfileController.findOne));
router.put('/:id', [ValidateSchema(updateProfileSchema)], asyncHandler(ProfileController.update));
router.delete('/:id', asyncHandler(ProfileController.delete));
export default router;
