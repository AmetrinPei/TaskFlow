import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/categoryService';
import { successResponse } from '../utils/response';

export const categoryController = {
  getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = categoryService.getAll();
      res.json(successResponse(categories));
    } catch (error) {
      next(error);
    }
  },

  create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = categoryService.create(req.body.name);
      res.status(201).json(successResponse(category, '分类创建成功'));
    } catch (error) {
      next(error);
    }
  },

  update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const category = categoryService.update(id, req.body.name);
      res.json(successResponse(category, '分类更新成功'));
    } catch (error) {
      next(error);
    }
  },

  delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      categoryService.delete(id);
      res.json(successResponse(null, '分类删除成功'));
    } catch (error) {
      next(error);
    }
  },
};
