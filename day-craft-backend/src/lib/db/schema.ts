import { serial, pgTable, text, timestamp, varchar, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';

//Enums
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

// Schema
export const users = pgTable('users', {
  id: serial('id').notNull().primaryKey(),
  email: text('email').notNull().unique(),
  encrypted_password: text('encrypted_password'),
  first_name: varchar('first_name', { length: 255 }),
  last_name: varchar('last_name', { length: 255 }),
  display_name: varchar('display_name', { length: 255 }),
  username: varchar('username', { length: 255 }).unique(),
  phone_number: varchar('phone_number', { length: 255 }).unique(),
  gender: genderEnum('gender'),
  location: text('location'),
  bio: text('bio'),
  verified_at: timestamp('verified_at', { mode: 'date' }),
  created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
}, (users) => {
  return {
    emailIdx: uniqueIndex("users_email_idx").on(users.email),
    usernameIndex: uniqueIndex('users_username_idx').on(users.username),
    phoneNumberIndex: uniqueIndex('users_phone_number_idx').on(users.phone_number),
    nameIndex: uniqueIndex('users_first_name_last_name_idx').on(users.first_name, users.last_name),
  }
});
