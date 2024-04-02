import express from 'express';
import { authenticateUser, registerNewUser, resetUserPassword } from '../../controllers/api/v1/auth.controller';

const authRouter = express.Router();

authRouter.post('/login', authenticateUser);
authRouter.post('/register', registerNewUser);
authRouter.post('/reset-password', resetUserPassword);

export default authRouter;
