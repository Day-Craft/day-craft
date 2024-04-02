import generateResponse from '../../../interfaces/MessageResponse';
import { COOKIE_SETTINGS } from '../../../constants';
import { clearUserTokens, findUserByCondition, verifyPasswordResetCode } from '../../../models/users.model';
import { wrapAsync } from '../../../lib/wrapAsync';

export const getUserInfo = wrapAsync(async (req, res) => {
  const username = req.params.username.toString();
  const user = await findUserByCondition(username, 'username');

  if (!user) throw new Error(`User with username ${username} not found!`);

  res.status(200).json(generateResponse(true, 'User data fetched successfully!', user));
});

export const logoutUser = wrapAsync(async (req, res) => {
  const username = req.params.username.toString();

  if (!username) throw new Error('Please provide a username!');

  await clearUserTokens(username, 'username');

  res
    .status(200)
    .clearCookie('accessToken', COOKIE_SETTINGS)
    .clearCookie('refreshToken', COOKIE_SETTINGS)
    .json(generateResponse(true, 'User logged out successfully!', undefined));
});

//TODO: Reset Password, Update User Profile, Delete User, Resend Verification Email

export const updateUserPassword = wrapAsync(async (req, res) => {
  const { uuid, current_password, updated_password } = req.body;

  if (uuid || !current_password || !updated_password) throw new Error('Please provide all required fields!');

  res
    .status(200)
    .clearCookie('accessToken', COOKIE_SETTINGS)
    .clearCookie('refreshToken', COOKIE_SETTINGS)
    .json(generateResponse(true, 'User logged out successfully!', undefined));
});

// export const updateUserProfile = wrapAsync(async (req, res) => {
//   //TODO: Implement this
// });

// export const deleteUser = wrapAsync(async (req, res) => {
//   //TODO: Implement this
// });

export const verifyUserToken = wrapAsync(async (req, res) => {
  const { uuid, reset_code } = req.body;

  if (uuid) throw new Error('Please provide all required fields!');

  const userData = await findUserByCondition(uuid, 'uuid');

  await verifyPasswordResetCode(userData.id, reset_code, 'reset');

  res.status(200);
});
