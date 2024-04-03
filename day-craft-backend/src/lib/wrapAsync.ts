import { handleError } from './middlewares';
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import { COOKIE_SETTINGS } from '../constants';

interface UserRequest extends Request {
  user?: any;
}

// eslint-disable-next-line no-unused-vars
type ControllerFunction = (req: UserRequest, res: Response, next: NextFunction) => Promise<void>;

export const wrapAsync = (fn: ControllerFunction): ControllerFunction => {
  return async (req: UserRequest, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: Error | any) {
      if (error instanceof ZodError) {
        handleError(error, req, res, next, 'Internal Server Error');
      } else if (error instanceof jwt.TokenExpiredError) {
        res.status(401).clearCookie('accessToken', COOKIE_SETTINGS).clearCookie('refreshToken', COOKIE_SETTINGS);
        handleError(error, req, res, next, 'Refresh Token Expired');
      } else {
        handleError(error, req, res, next);
      }
    }
  };
};
