import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema, source: 'body' | 'query' = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(source === 'body' ? req.body : req.query);
    if (!result.success) {
      const message = result.error.issues.map((e: { message: string }) => e.message).join('; ');
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message },
      });
    }
    // Express 5 中 req.query 为只读，将校验后的数据存入 req.body 或自定义属性
    if (source === 'body') {
      req.body = result.data;
    } else {
      (req as unknown as Record<string, unknown>).validatedQuery = result.data;
    }
    next();
  };
}
