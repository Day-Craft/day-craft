import express from 'express';
import authRouter from './v1/auth.route';
import userRoutes from './v1/users.route';
import { authenticationMiddleware } from '../lib/middlewares/authrntication';

const v1Router = express.Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', authenticationMiddleware, userRoutes);

export default v1Router;
