import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line no-unused-vars
type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const asyncWrapper = (fn: ControllerFunction): ControllerFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
