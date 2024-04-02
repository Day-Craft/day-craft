import generateResponseMessage from '../../../interfaces/MessageResponse';
import { COOKIE_SETTINGS } from '../../../constants';
import { dispatchPasswordResetEmail } from '../../../lib/mailers';
import {
  createNewUser,
  retrieveUserToken,
  findUserByCondition,
  createPasswordResetCode,
  renewUserToken,
  validateUserAndPassword,
} from '../../../models/users.model';
import { wrapAsync } from '../../../lib/wrapAsync';
import { authenticateUserSchema, registerNewUserSchema, resetUserPasswordSchema } from '../../../schemas/auth.schema';

// POST /api/v1/auth/register
export const registerNewUser = wrapAsync(async (req, res) => {
  const { display_name, email, password } = registerNewUserSchema.parse(req.body);

  const userExists = await findUserByCondition(email, 'email');
  console.log(userExists);
  if (userExists) throw new Error('User with that email already exists!');
  const createdUser = await createNewUser(display_name, email, password);

  // add token
  res.status(200).json(generateResponseMessage(true, 'User data created successfully!', createdUser));
});

// POST /api/v1/auth/login
export const authenticateUser = wrapAsync(async (req, res) => {
  const { uuid, password } = authenticateUserSchema.parse(req.body);

  await validateUserAndPassword(uuid, 'uuid', password);

  let { userAccessToken, userRefreshToken, userDetails } = await retrieveUserToken(uuid, 'uuid');
  if (!userAccessToken || !userRefreshToken) {
    ({ userAccessToken, userRefreshToken, userDetails } = await renewUserToken(uuid, 'uuid'));
  }

  res
    .status(200)
    .cookie('accessToken', userAccessToken, COOKIE_SETTINGS)
    .cookie('refreshToken', userRefreshToken, COOKIE_SETTINGS)
    .json(generateResponseMessage(true, 'User logged in successfully!', userDetails));
});

// POST /api/v1/auth/reset-password
export const resetUserPassword = wrapAsync(async (req, res) => {
  const { userUuid } = resetUserPasswordSchema.parse(req.body);

  const userDetails = await findUserByCondition(userUuid, 'uuid');

  const passwordResetCode = await createPasswordResetCode(userDetails.id);
  await dispatchPasswordResetEmail(userDetails.email, passwordResetCode);

  res.status(200).json(generateResponseMessage(true, 'Reset mail send!', undefined));
});
