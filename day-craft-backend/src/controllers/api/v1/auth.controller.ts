import generateResponseMessage from '../../../interfaces/MessageResponse';
import { wrapAsync } from '../../../lib/wrapAsync';
import {
  createNewUser,
  retrieveUserToken,
  findUserByCondition,
  createPasswordResetCode,
  renewUserToken,
  validateUserAndPassword,
} from '../../../models/users.model';
import { COOKIE_SETTINGS } from '../../../constants';
import { dispatchPasswordResetEmail } from '../../../lib/mailers';

export const registerNewUser = wrapAsync(async (req, res) => {
  const { displayName, userEmail, userPassword } = req.body;
  if (!displayName || !userEmail || !userPassword) throw new Error('Please provide all required fields!');

  const userExists = await findUserByCondition(userEmail, 'email');
  if (userExists) throw new Error('User with that email already exists!');

  const createdUser = await createNewUser(displayName, userEmail, userPassword);

  res.status(200).json(generateResponseMessage(true, 'User data created successfully!', createdUser));
});

export const authenticateUser = wrapAsync(async (req, res) => {
  const { userUuid, userPassword } = req.body;
  if (!userUuid || !userPassword) throw new Error('Please provide all required fields!');

  await validateUserAndPassword(userUuid, 'uuid', userPassword);

  let { userAccessToken, userRefreshToken, userDetails } = await retrieveUserToken(userUuid, 'uuid');
  if (!userAccessToken || !userRefreshToken) {
    ({ userAccessToken, userRefreshToken, userDetails } = await renewUserToken(userUuid, 'uuid'));
  }
  console.log(userAccessToken);
  res
    .status(200)
    .cookie('accessToken', userAccessToken, COOKIE_SETTINGS)
    .cookie('refreshToken', userRefreshToken, COOKIE_SETTINGS)
    .json(generateResponseMessage(true, 'User logged in successfully!', userDetails));
});

export const resetUserPassword = wrapAsync(async (req, res) => {
  const { userUuid } = req.body;

  if (!userUuid) throw new Error('Please provide all required fields!');

  const userDetails = await findUserByCondition(userUuid, 'uuid');

  const passwordResetCode = await createPasswordResetCode(userDetails.id);
  await dispatchPasswordResetEmail(userDetails.email, passwordResetCode);

  res.status(200).json(generateResponseMessage(true, 'Reset mail send!', undefined));
});
