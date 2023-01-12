import { Router } from 'express';
import asyncHandler from '../middlewares/tryCatch.mjs';
import ValidateSchema from '../middlewares/ValidateSchemasAjv.mjs';
import ModulesController from '../controllers/modulesController.mjs';
import { createModuleSchema, updateModuleSchema } from '../validators/moduleSchema.mjs';

const router = Router();
router.get('/', asyncHandler(ModulesController.findAll));
router.post('/', [ValidateSchema(createModuleSchema)], asyncHandler(ModulesController.create));
router.get('/:id', asyncHandler(ModulesController.findOne));
router.put('/:id', [ValidateSchema(updateModuleSchema)], asyncHandler(ModulesController.update));
router.delete('/:id', asyncHandler(ModulesController.delete));
export default router;
