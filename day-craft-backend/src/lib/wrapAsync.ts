import { NextFunction, Request, Response } from 'express';
import { handleError } from './middlewares';

// eslint-disable-next-line no-unused-vars
type ControllerFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const wrapAsync = (fn: ControllerFunction): ControllerFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: Error | any) {
      handleError(error, req, res, next, 'Internal Server Error');
    }
  };
};
