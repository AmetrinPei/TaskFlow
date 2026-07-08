import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services/statsService';
import { successResponse } from '../utils/response';

export const statsController = {
  getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = statsService.getOverview();
      res.json(successResponse(stats));
    } catch (error) {
      next(error);
    }
  },
};
