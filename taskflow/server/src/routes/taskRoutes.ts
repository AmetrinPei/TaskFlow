import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { validate } from '../middleware/validate';
import { createTaskSchema, updateTaskSchema, taskQuerySchema, reorderTaskSchema } from '../schemas/taskSchema';

const router = Router();

router.get('/', validate(taskQuerySchema, 'query'), taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/reorder', validate(reorderTaskSchema), taskController.reorder);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/status', taskController.updateStatus);
router.delete('/:id', taskController.delete);

export default router;
