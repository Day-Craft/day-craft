import generateResponse from '../../../interfaces/MessageResponse';
import { asyncWrapper } from '../../../lib/asyncWrapper';
import {
  createUser,
  fetchUserToken,
  fetchUserViaCondition,
  generatePasswordResetCode,
  refreshUserToken,
  verifyUserAndPassword,
} from '../../../models/users.model';
import { COOKIE_OPTIONS } from '../../../constants';
import { sendPasswordResetEmail } from '../../../lib/mailers';

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
  if (!uuid || !password) throw new Error('Please provide all required fields!');

  await verifyUserAndPassword(uuid, 'uuid', password);

  let { access_token, refresh_token, userData } = await fetchUserToken(uuid, 'uuid');
  if (!access_token || !refresh_token) {
    ({ access_token, refresh_token, userData } = await refreshUserToken(uuid, 'uuid'));
  }
  console.log(access_token);
  res
    .status(200)
    .cookie('accessToken', access_token, COOKIE_OPTIONS)
    .cookie('refreshToken', refresh_token, COOKIE_OPTIONS)
    .json(generateResponse(true, 'User logged in successfully!', userData));
});

export const resetUserPassword = asyncWrapper(async (req, res) => {
  const { uuid } = req.body;

  if (!uuid) throw new Error('Please provide all required fields!');

  const userData = await fetchUserViaCondition(uuid, 'uuid');

  const reset_code = await generatePasswordResetCode(userData.id);
  await sendPasswordResetEmail(userData.email, reset_code);

  res.status(200).json(generateResponse(true, 'Reset mail send!', undefined));
});
