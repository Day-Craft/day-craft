import bcrypt from 'bcrypt';
import crypto from 'crypto';
import databaseInstance from '../lib/db';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants';
import { and, desc, eq, isNull, or } from 'drizzle-orm';
import { users as User, userTokens as UserToken, userTokenTypeEnum } from '../lib/db/schema';

const generateUsername = (name: string) => `${name.toLowerCase().replace(/\s/g, '_')}_${crypto.randomBytes(3).toString('hex')}`;

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
    .returning({ id: User.id, name: User.display_name, email: User.email, username: User.username });

  const user_auth_token = {
    access_token: jwt.sign(newUser[0], ACCESS_TOKEN_SECRET, { expiresIn: '1h' }),
    refresh_token: jwt.sign(newUser[0], REFRESH_TOKEN_SECRET, { expiresIn: '3h' }),
  };

  await databaseInstance
    .update(User)
    .set({ access_token: user_auth_token.access_token, refresh_token: user_auth_token.refresh_token })
    .where(eq(User.id, newUser[0].id));

  return newUser[0];
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

export const deleteUser = async (uuid: string, login_via: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails) throw new Error(`User not found with ${login_via}: ${uuid}!`);
  await databaseInstance.update(User).set({ deleted_at: new Date() }).where(eq(User.id, userDetails.id));
};

export const validateUserAndPassword = async (uuid: string, login_via: string, password: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails || !userDetails.encrypted_password || !bcrypt.compareSync(password, userDetails.encrypted_password))
    throw new Error(`Invalid credentials for ${login_via}: ${uuid}!`);
  return true;
};

export const retrieveUserToken = async (uuid: string, login_via: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails) throw new Error(`Invalid credentials for ${login_via}: ${uuid}!`);
  return { userAccessToken: userDetails.access_token, userRefreshToken: userDetails.refresh_token, userDetails };
};

export const renewUserToken = async (uuid: string, login_via: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails) throw new Error(`Invalid credentials for ${login_via}: ${uuid}!`);

  const access_token = jwt.sign(userDetails, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refresh_token = jwt.sign(userDetails, REFRESH_TOKEN_SECRET, { expiresIn: '6h' });

  await databaseInstance.update(User).set({ access_token: access_token, refresh_token: refresh_token }).where(eq(User.id, userDetails.id));
  return { userAccessToken: access_token, userRefreshToken: refresh_token, userDetails };
};

export const clearUserTokens = async (uuid: string, login_via: string) => {
  const userDetails = await findUserByCondition(uuid, login_via);
  if (!userDetails) throw new Error(`Invalid credentials for ${login_via}: ${uuid}!`);

  await databaseInstance.update(User).set({ access_token: null, refresh_token: null }).where(eq(User.id, userDetails.id));
};

export const updateUserPassword = async (uuid: string, current_password: string, updated_password: string) => {
  const userDetails = await validateUserAndPassword(uuid, 'email', current_password);
  if (!userDetails) throw new Error(`Invalid credentials for email: ${uuid}!`);
  await databaseInstance
    .update(User)
    .set({ encrypted_password: bcrypt.hashSync(updated_password, 10), access_token: null, refresh_token: null })
    .where(eq(User.email, uuid));
};

export const createPasswordResetCode = async (user_id: number) => {
  const reset_token = crypto.randomBytes(3).toString('hex');
  const values = {
    user_id: user_id,
    token: reset_token,
    expires_at: new Date(Date.now() + 3600000), // Expires in 1 hour
  };
  await databaseInstance.insert(UserToken).values(values);
  return reset_token;
};

export const verifyPasswordResetCode = async (user_id: number, reset_code: string, token_type: string) => {
  userTokenTypeEnum.toString();
  console.log(userTokenTypeEnum.toString());
  console.log(token_type);
  const resetData = await databaseInstance
    .select()
    .from(UserToken)
    .where(and(eq(UserToken.user_id, user_id), eq(UserToken.token_type, 'reset')))
    .orderBy(desc(UserToken.created_at))
    .limit(1);

  if (!resetData || resetData[0].token !== reset_code) throw new Error(`Invalid reset code: ${reset_code}!`);
  if (resetData[0].expires_at < new Date()) throw new Error(`Expired reset code: ${reset_code}!`);
  return true;
};
