import { serial, pgTable, text, timestamp, varchar, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';

//Enums
export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);
export const userTokenTypeEnum = pgEnum('user_token_type', ['reset', 'verify']);
export const linkTypesEnum = pgEnum('link_type', ['github', 'linkedin', 'twitter', 'facebook', 'instagram', 'website', 'other']);
export const contentTypeEnum = pgEnum('content_type', ['html', 'text']);
export const statusEnum = pgEnum('status', ['pending', 'approved', 'rejected']);

// Schema
export const users = pgTable(
  'users',
  {
    id: serial('id').notNull().primaryKey(),
    email: text('email').notNull().unique(),
    encrypted_password: text('encrypted_password'),
    first_name: varchar('first_name', { length: 255 }),
    last_name: varchar('last_name', { length: 255 }),
    display_name: varchar('display_name', { length: 255 }),
    username: varchar('username', { length: 255 }).unique(),
    phone_number: varchar('phone_number', { length: 255 }).unique(),
    gender: genderEnum('gender'),
    location: varchar('location', { length: 255 }).unique(),
    profile_picture: text('profile_picture'),
    bio: text('bio'),
    access_token: text('access_token'),
    refresh_token: text('refresh_token'),
    verified_at: timestamp('verified_at', { mode: 'date' }),
    deleted_at: timestamp('deleted_at', { mode: 'date' }),
    created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (users) => {
    return {
      emailIdx: uniqueIndex('users_email_idx').on(users.email),
      usernameIndex: uniqueIndex('users_username_idx').on(users.username),
      phoneNumberIndex: uniqueIndex('users_phone_number_idx').on(users.phone_number),
      nameIndex: uniqueIndex('users_first_name_last_name_idx').on(users.first_name, users.last_name),
    };
  },
);

export const userTokens = pgTable(
  'user_tokens',
  {
    id: serial('id').notNull().primaryKey(),
    user_id: serial('user_id')
      .notNull()
      .references(() => users.id),
    token: text('token').notNull(),
    token_type: userTokenTypeEnum('user_token_type'),
    expires_at: timestamp('expires_at', { mode: 'date' }).notNull().defaultNow(),
    created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (user_tokens) => {
    return {
      userIdIdx: uniqueIndex('user_tokens_user_id_token_type').on(user_tokens.user_id, user_tokens.token_type),
    };
  },
);

export const userLinks = pgTable(
  'user_links',
  {
    id: serial('id').notNull().primaryKey(),
    user_id: serial('user_id')
      .notNull()
      .references(() => users.id),
    link_type: linkTypesEnum('link_type'),
    url: text('url'),
    created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (user_links) => {
    return {
      userIdIdx: uniqueIndex('user_links_user_id_link_type').on(user_links.user_id, user_links.link_type),
    };
  },
);

export const emailTemplates = pgTable(
  'email_templates',
  {
    id: serial('id').notNull().primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    subject: text('subject').notNull(),
    content: text('content').notNull(),
    content_type: contentTypeEnum('content_type').default('html'),
    status: statusEnum('status').default('pending'),
    created_at: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
  },
  (email_templates) => {
    return {
      emailTemplateSlugIdx: uniqueIndex('email_templates_slug_idx').on(email_templates.slug),
    };
  },
);
