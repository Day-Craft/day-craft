import express from 'express';
import { authenticateUser, logoutUser, refreshTokens, registerNewUser, resetUserPassword } from '../../controllers/api/v1/auth.controller';

const authRouter = express.Router();

authRouter.post('/login', authenticateUser);
authRouter.post('/register', registerNewUser);
authRouter.post('/reset-password', resetUserPassword);
authRouter.get('/logout', logoutUser);
authRouter.patch('/refresh-tokens', refreshTokens);

export default authRouter;
