import ErrorResponseInterface from '../interfaces/ErrorResponse';
import { GENERIC_ERROR_MESSAGE, NOT_FOUND_MESSAGE, APPLICATION_ENVIRONMENT } from '../constants';
import { NextFunction, Request, Response } from 'express';

export function handleNotFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function handleError(err: Error, req: Request, res: Response<ErrorResponseInterface>, next: NextFunction, message?: string) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    success: false,
    message: message ? message : statusCode === 404 ? NOT_FOUND_MESSAGE : GENERIC_ERROR_MESSAGE,
    error: err.message,
    stack: APPLICATION_ENVIRONMENT ? undefined : err.stack,
  });
  next();
}

export default { handleNotFound, handleError };
