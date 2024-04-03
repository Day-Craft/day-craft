import bcrypt from 'bcrypt';
import crypto from 'crypto';
import databaseInstance from '../lib/db';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, RESET_TOKEN_SECRET } from '../constants';
import { and, eq, isNull, or } from 'drizzle-orm';
import { users as User, userTokens as UserToken } from '../lib/db/schema';

const generateUsername = (name: string) => `${name.toLowerCase().replace(/\s/g, '_')}_${crypto.randomBytes(3).toString('hex')}`;

const updateUserTokens = async (user: any) => {
  const access_token = jwt.sign({ id: user.id, display_name: user.display_name, email: user.email, username: user.username }, ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });

  const refresh_token = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: '6h' });

  await databaseInstance.update(User).set({ access_token: access_token, refresh_token: refresh_token }).where(eq(User.id, user.id));

  return { access_token, refresh_token };
};

export const createNewUser = async (display_name: string, email: string, password: string) => {
  const values = {
    display_name: display_name,
    username: generateUsername(display_name),
    email: email,
    encrypted_password: bcrypt.hashSync(password, 10),
  };

  const newUser = await databaseInstance
    .insert(User)
    .values(values)
    .returning({ id: User.id, display_name: User.display_name, email: User.email, username: User.username });

  const { access_token, refresh_token } = await updateUserTokens(newUser[0]);
  return { access_token, refresh_token, userDetails: newUser[0] };
};

export const findUserByCondition = async (uuid: string, find_by: string) => {
  let where_condition;
  if (find_by === 'id') {
    where_condition = eq(User.id, parseInt(uuid));
  } else if (find_by === 'email') {
    where_condition = eq(User.email, uuid);
  } else if (find_by === 'username') {
    where_condition = eq(User.username, uuid);
  } else if (find_by === 'phone_number') {
    where_condition = eq(User.phone_number, uuid);
  } else if (find_by === 'uuid') {
    where_condition = or(eq(User.username, uuid), eq(User.email, uuid), eq(User.phone_number, uuid));
  } else throw new Error(`Invalid find_by parameter: ${find_by}!`);

  const userDetails = await databaseInstance
    .select()
    .from(User)
    .where(and(where_condition, isNull(User.deleted_at)))
    .limit(1);
  return userDetails[0];
};

export const validateUserAndPassword = async (uuid: string, login_via: string, password: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails || !userDetails.encrypted_password || !bcrypt.compareSync(password, userDetails.encrypted_password))
    throw new Error(`Invalid credentials for ${login_via}: ${uuid}!`);

  const { access_token, refresh_token } = await updateUserTokens(userDetails);
  return { access_token, refresh_token, userDetails };
};

export const createPasswordResetCode = async (user_id: number) => {
  const reset_token = jwt.sign({ user_id: user_id }, RESET_TOKEN_SECRET, { expiresIn: '1h' });
  const values = {
    user_id: user_id,
    token: reset_token,
    expires_at: new Date(Date.now() + 3600000),
  };
  await databaseInstance.insert(UserToken).values(values);
  return reset_token;
};

export const renewUserToken = async (uuid: string, login_via: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails) throw new Error(`Invalid credentials for ${login_via}: ${uuid}!`);

  const { access_token, refresh_token } = await updateUserTokens(userDetails);

  return { userAccessToken: access_token, userRefreshToken: refresh_token, userDetails };
};

export const retrieveUserToken = async (uuid: string, login_via: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails) throw new Error(`Invalid credentials for ${login_via}: ${uuid}!`);
  return { userAccessToken: userDetails.access_token, userRefreshToken: userDetails.refresh_token, userDetails };
};
