import bcrypt from 'bcrypt';
import databaseInstance from '../lib/db';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import { users as User } from '../lib/db/schema';

const generateUsername = (name: string) => `${name.toLowerCase().replace(/\s/g, '_')}_${crypto.randomBytes(3).toString('hex')}`;

export const fetchUserByUsername = async (username: string) => {
  const userData = await databaseInstance.select().from(User).where(eq(User.username, username)).limit(1);
  return userData[0];
};

export const fetchUserByEmail = async (email: string) => {
  const userData = await databaseInstance.select().from(User).where(eq(User.email, email)).limit(1);
  return userData[0];
};

export const createUser = async (display_name: string, email: string, password: string) => {
  const values = {
    display_name: display_name,
    username: generateUsername(display_name),
    email: email,
    encrypted_password: bcrypt.hashSync(password, 10),
  }
  const newUser = await databaseInstance.insert(User).values(values).returning({ name: User.display_name, email: User.email, username: User.username,});;
  return newUser;
};
