import bcrypt from 'bcrypt';
import databaseInstance from '../lib/db';
import crypto from 'crypto';
import { and, desc, eq, or } from 'drizzle-orm';
import { users as User, userTokens as UserToken, userTokenTypeEnum } from '../lib/db/schema';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from '../constants';

const generateUsername = (name: string) => `${name.toLowerCase().replace(/\s/g, '_')}_${crypto.randomBytes(3).toString('hex')}`;

export const createUser = async (display_name: string, email: string, password: string) => {
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

  const user_token = {
    access_token: jwt.sign(newUser[0], ACCESS_TOKEN_SECRET, { expiresIn: '1h' }),
    refresh_token: jwt.sign(newUser[0], REFRESH_TOKEN_SECRET, { expiresIn: '3h' }),
  };

  await databaseInstance
    .update(User)
    .set({ access_token: user_token.access_token, refresh_token: user_token.refresh_token })
    .where(eq(User.id, newUser[0].id));

  return newUser[0];
};

export const fetchUserViaCondition = async (uuid: string, find_by: string) => {
  let where_condition;
  if (find_by === 'email') {
    where_condition = eq(User.username, uuid);
  } else if (find_by === 'username') {
    where_condition = eq(User.email, uuid);
  } else if (find_by === 'phone_number') {
    where_condition = eq(User.phone_number, uuid);
  } else if (find_by === 'uuid') {
    where_condition = or(eq(User.username, uuid), eq(User.email, uuid));
  } else throw new Error('Invalid find_by parameter!');

  const userData = await databaseInstance.select().from(User).where(where_condition).limit(1);
  if (!userData) throw new Error(`Invalid Credentials!`);
  return userData[0];
};

export const verifyUserAndPassword = async (uuid: string, login_via: string, password: string) => {
  const userData = await fetchUserViaCondition(uuid, login_via);
  const encrypted_password = userData.encrypted_password;
  if (!userData || !encrypted_password || !bcrypt.compareSync(password, encrypted_password)) throw new Error('Invalid Credentials!');
  return true;
};

export const fetchUserToken = async (uuid: string, login_via: string) => {
  const userData = await fetchUserViaCondition(uuid, login_via);
  return { access_token: userData.access_token, refresh_token: userData.refresh_token, userData };
};

export const refreshUserToken = async (uuid: string, login_via: string) => {
  const userData = await fetchUserViaCondition(uuid, login_via);

  const access_token = jwt.sign(userData, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  const refresh_token = jwt.sign(userData, REFRESH_TOKEN_SECRET, { expiresIn: '6h' });

  await databaseInstance.update(User).set({ access_token: access_token, refresh_token: refresh_token }).where(eq(User.id, userData.id));
  return { access_token: access_token, refresh_token: refresh_token, userData };
};

export const clearUserTokens = async (uuid: string, login_via: string) => {
  const userData = await fetchUserViaCondition(uuid, login_via);
  await databaseInstance.update(User).set({ access_token: null, refresh_token: null }).where(eq(User.id, userData.id));
};

export const updateUserPassword = async (uuid: string, current_password: string, updated_password: string) => {
  const userData = await verifyUserAndPassword(uuid, 'email', current_password);
  if (!userData) throw new Error('Invalid Credentials!');
  await databaseInstance
    .update(User)
    .set({ encrypted_password: bcrypt.hashSync(updated_password, 10), access_token: null, refresh_token: null })
    .where(eq(User.email, uuid));
};

export const generatePasswordResetCode = async (user_id: number) => {
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

  if (!resetData || resetData[0].token !== reset_code) throw new Error('Invalid reset code!');
  if (resetData[0].expires_at < new Date()) throw new Error('Expired reset code!');

  if (!resetData) throw new Error('Invalid or expired reset code!');
  return true;
};
