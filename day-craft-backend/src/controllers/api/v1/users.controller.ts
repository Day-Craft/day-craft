import { COOKIE_OPTIONS } from '../../../constants';
import generateResponse from '../../../interfaces/MessageResponse';
import { asyncWrapper } from '../../../lib/asyncWrapper';
import { clearUserTokens, createUser, fetchUserToken, fetchUserViaCondition, verifyUserPassword } from '../../../models/users.model';

export const getUserInfo = asyncWrapper(async (req, res) => {
  const username = req.params.username.toString();
  const user = await fetchUserViaCondition(username, 'username');

  if (!user) throw new Error(`User with username ${username} not found!`);

  res.status(200).json(generateResponse(true, 'User data fetched successfully!', user));
});

export const registerUser = asyncWrapper(async (req, res) => {
  const { display_name, email, password } = req.body;

  if (!display_name || !email || !password) throw new Error('Please provide all required fields!');

  const existingUser = await fetchUserViaCondition(email, 'email');

  if (existingUser) throw new Error('User with that email already exists!');

  const newUser = await createUser(display_name, email, password);

  res.status(200).json(generateResponse(true, 'User data created successfully!', newUser));
});

export const loginUser = asyncWrapper(async (req, res) => {
  const { uuid, password } = req.body;

  if (uuid || !password) throw new Error('Please provide all required fields!');

  await verifyUserPassword(uuid, 'uuid', password);

  const { access_token, refresh_token, userData } = await fetchUserToken(uuid, 'uuid');

  res
    .status(200)
    .cookie('accessToken', access_token, COOKIE_OPTIONS)
    .cookie('refreshToken', refresh_token, COOKIE_OPTIONS)
    .json(generateResponse(true, 'User logged in successfully!', userData));
});

export const logoutUser = asyncWrapper(async (req, res) => {
  const username = req.params.username.toString();

  if (!username) throw new Error('Please provide a username!');

  await clearUserTokens(username, 'username');

  res
    .status(200)
    .clearCookie('accessToken', COOKIE_OPTIONS)
    .clearCookie('refreshToken', COOKIE_OPTIONS)
    .json(generateResponse(true, 'User logged out successfully!', undefined));
});

//TODO: Reset Password, Update User Profile, Delete User, Resend Verification Email

export const updateUserPassword = asyncWrapper(async (req, res) => {
  const { uuid, current_password, updated_password } = req.body;

  if (uuid || !current_password || !updated_password) throw new Error('Please provide all required fields!');

  res
    .status(200)
    .clearCookie('accessToken', COOKIE_OPTIONS)
    .clearCookie('refreshToken', COOKIE_OPTIONS)
    .json(generateResponse(true, 'User logged out successfully!', undefined));
});

// export const updateUserProfile = asyncWrapper(async (req, res) => {
//   //TODO: Implement this
// });

// export const deleteUser = asyncWrapper(async (req, res) => {
//   //TODO: Implement this
// });

// export const resendVeificationMail = asyncWrapper(async (req, res) => {
//   //TODO: Implement this
// });

// export const resetPassword = asyncWrapper(async (req, res) => {
//   //TODO: Implement this
// });
