import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { validate } from '../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../schemas/categorySchema';

const router = Router();

router.get('/', categoryController.getAll);
router.post('/', validate(createCategorySchema), categoryController.create);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
