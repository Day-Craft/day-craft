import dotenv from 'dotenv';
dotenv.config();

// Environment configuration
export const APPLICATION_ENVIRONMENT = process.env.APPLICATION_ENVIRONMENT || 'development';
export const PORT = process.env.PORT;

// Messages configuration
export const NOT_FOUND_MESSAGE = 'The requested resource cannot be found.';
export const GENERIC_ERROR_MESSAGE = 'Something went wrong, please try again later. If the problem persists, contact support.';

// Security configuration
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'internal-token';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'internal-token';
export const COOKIE_SETTINGS = { httpOnly: true, secure: true };

// External services configuration
export const DATABASE_URL = process.env.DATABASE_URL || undefined;
export const REDIS_URL = process.env.REDIS_URL || '';

// BullMQ queues
export const EMAIL_TASK_QUEUE = process.env.EMAIL_TASK_QUEUE || 'email-task-queue';
