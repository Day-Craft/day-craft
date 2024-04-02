import express from 'express';
import { logoutUser } from '../../controllers/api/v1/users.controller';

const userRouter = express.Router();

userRouter.get('/logout', logoutUser);

export default userRouter;
