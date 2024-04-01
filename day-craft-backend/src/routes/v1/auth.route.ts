import express from 'express';
import { loginUser, registerUser, resetUserPassword } from '../../controllers/api/v1/auth.controller';

const authRouter = express.Router();

authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.post('/reset_password', resetUserPassword);

export default authRouter;
