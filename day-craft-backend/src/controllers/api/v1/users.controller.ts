import generateResponse from '../../../interfaces/MessageResponse';
import { asyncWrapper } from '../../../lib/asyncWrapper';
import { createUser, fetchUserByEmail, fetchUserByUsername } from '../../../models/users.model';


export const getUserInfo = asyncWrapper(async (req, res) => {
  const username = req.params.username.toString();
  const user = await fetchUserByUsername(username);

  if (!user) throw new Error(`User with username ${username} not found!`);

  res.status(200).json(generateResponse(true, 'User data fetched successfully!', user));
});

export const registerUser = asyncWrapper(async (req, res) => {
  const { display_name, email, password } = req.body;

  if (!display_name || !email || !password) throw new Error('Please provide all required fields!');

  const existingUser = await fetchUserByEmail(email);

  if (existingUser) throw new Error('User with that email already exists!');

  const newUser = await createUser(display_name, email, password);

  res.status(200).json(generateResponse(true, 'User data created successfully!', newUser));
});
