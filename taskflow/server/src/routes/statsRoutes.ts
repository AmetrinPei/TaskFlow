import { Router } from 'express';
import { statsController } from '../controllers/statsController';

const router = Router();

router.get('/', statsController.getOverview);

export default router;
