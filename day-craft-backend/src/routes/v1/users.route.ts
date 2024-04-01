import express from 'express';
import { getUserInfo, registerUser } from '../../controllers/api/v1/users.controller';

const userRouter = express.Router();

userRouter.get('/:username', getUserInfo);
userRouter.post('/:register', registerUser);

export default userRouter;
