import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService';
import { TaskQueryParams, TaskStatus } from '../types';
import { successResponse } from '../utils/response';
import { ValidationError } from '../utils/errors';

export const taskController = {
  getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const params = (req as unknown as Record<string, unknown>).validatedQuery as TaskQueryParams ?? (req.query as unknown as TaskQueryParams);
      const tasks = taskService.getAll(params);
      res.json(successResponse(tasks));
    } catch (error) {
      next(error);
    }
  },

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const task = taskService.getById(id);
      res.json(successResponse(task));
    } catch (error) {
      next(error);
    }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = taskService.create(req.body);
      res.status(201).json(successResponse(task, '任务创建成功'));
    } catch (error) {
      next(error);
    }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const task = taskService.update(id, req.body);
      res.json(successResponse(task, '任务更新成功'));
    } catch (error) {
      next(error);
    }
  },

  updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;

      const validStatuses: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];
      if (!validStatuses.includes(status)) {
        throw new ValidationError('无效的状态值');
      }

      const task = taskService.updateStatus(id, status);
      res.json(successResponse(task, '状态更新成功'));
    } catch (error) {
      next(error);
    }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      taskService.delete(id);
      res.json(successResponse(null, '任务删除成功'));
    } catch (error) {
      next(error);
    }
  },

  reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body as { ids: number[] };
      taskService.reorder(ids);
      res.json(successResponse(null, '排序更新成功'));
    } catch (error) {
      next(error);
    }
  },
};
