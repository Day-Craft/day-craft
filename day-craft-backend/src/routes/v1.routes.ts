import express from 'express';
import authRouter from './v1/auth.route';
import userRoutes from './v1/users.route';

const authenticationMiddleware = (_req: any, _res: any, next: () => void) => {
  console.log('authenticationMiddleware was executed!');
  next();
};

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', authenticationMiddleware, userRoutes);

export default v1Router;
