import generateResponseMessage from '../../../interfaces/MessageResponse';
import { COOKIE_SETTINGS, REFRESH_TOKEN_SECRET } from '../../../constants';
import { dispatchPasswordResetEmail } from '../../../lib/mailers';
import { createNewUser, findUserByCondition, createPasswordResetCode, validateUserAndPassword, renewUserToken } from '../../../models/users.model';
import { wrapAsync } from '../../../lib/wrapAsync';
import { authenticateUserSchema, registerNewUserSchema, resetUserPasswordSchema, userInfoSchema } from '../../../schemas/auth.schema';
import jwt, { JwtPayload } from 'jsonwebtoken';

// POST /api/v1/auth/register
export const registerNewUser = wrapAsync(async (req, res) => {
  const { display_name, email, password } = registerNewUserSchema.parse(req.body);

  const userExists = await findUserByCondition(email, 'email');
  if (userExists) throw new Error('User with that email already exists!');
  const { access_token, refresh_token, userDetails } = await createNewUser(display_name, email, password);

  const userInfo = userInfoSchema.parse(userDetails);
  res
    .status(200)
    .cookie('accessToken', access_token, COOKIE_SETTINGS)
    .cookie('refreshToken', refresh_token, COOKIE_SETTINGS)
    .json(generateResponseMessage(true, 'User data created successfully!', userInfo));
});

// POST /api/v1/auth/login
export const authenticateUser = wrapAsync(async (req, res) => {
  const { uuid, password } = authenticateUserSchema.parse(req.body);

  const { access_token, refresh_token, userDetails } = await validateUserAndPassword(uuid, 'uuid', password);

  const userInfo = userInfoSchema.parse(userDetails);
  res
    .status(200)
    .cookie('accessToken', access_token, COOKIE_SETTINGS)
    .cookie('refreshToken', refresh_token, COOKIE_SETTINGS)
    .json(generateResponseMessage(true, 'User logged in successfully!', userInfo));
});

// POST /api/v1/auth/reset-password
export const resetUserPassword = wrapAsync(async (req, res) => {
  const { uuid } = resetUserPasswordSchema.parse(req.body);

  const userDetails = await findUserByCondition(uuid, 'uuid');

  const passwordResetCode = await createPasswordResetCode(userDetails.id);
  await dispatchPasswordResetEmail(userDetails.email, passwordResetCode);

  res.status(200).json(generateResponseMessage(true, 'Reset mail send!', undefined));
});

// GET /api/v1/auth/logout
export const logoutUser = wrapAsync(async (_req, res) => {
  res
    .status(200)
    .clearCookie('accessToken', COOKIE_SETTINGS)
    .clearCookie('refreshToken', COOKIE_SETTINGS)
    .json(generateResponseMessage(true, 'User logged out successfully!', undefined));
});

// PATCH /api/v1/user/refresh-tokens
export const refreshTokens = wrapAsync(async (req, res) => {
  const { refreshToken: refreshTokenFromCookies } = req.cookies || {};
  const authorization = req.header('Authorization') || '';
  const refreshTokenFromHeader = authorization.replace('Bearer ', '');

  const actualRefreshToken = refreshTokenFromCookies || refreshTokenFromHeader;

  if (!actualRefreshToken) {
    throw new Error('Invalid Refresh Token');
  }

  const decodedToken = jwt.verify(actualRefreshToken, REFRESH_TOKEN_SECRET) as JwtPayload;

  const { userAccessToken, userRefreshToken } = await renewUserToken(decodedToken?.id, 'id');

  res
    .status(200)
    .cookie('accessToken', userAccessToken, COOKIE_SETTINGS)
    .cookie('refreshToken', userRefreshToken, COOKIE_SETTINGS)
    .json(generateResponseMessage(true, 'Token refreshed successfully!', undefined));
});
