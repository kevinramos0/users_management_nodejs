import { Router } from 'express';
import asyncHandler from '../middlewares/tryCatch.mjs';
import RolsController from '../controllers/rolsController.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';
import { createRolSchema, updateRolSchema } from '../validators/rolSchema.mjs';

const router = Router();
router.get('/', asyncHandler(RolsController.findAll));
router.post('/', [ValidateSchema(createRolSchema)], asyncHandler(RolsController.create));
router.get('/:id', asyncHandler(RolsController.findOne));
router.put('/:id', [ValidateSchema(updateRolSchema)], asyncHandler(RolsController.update));
router.delete('/:id', asyncHandler(RolsController.delete));
export default router;
