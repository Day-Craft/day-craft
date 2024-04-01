import express from 'express';
import userRoutes from './v1/users.route';
import authRouter from './v1/auth.route';

const authenticationMiddleware = (req: any, res: any, next: () => void) => {
  console.log('authenticationMiddleware was executed!');
  next();
};

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', authenticationMiddleware, userRoutes);

export default v1Router;
