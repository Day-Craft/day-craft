import dotenv from 'dotenv';
dotenv.config();

// Redis connection
export const REDIS_URL = process.env.REDIS_URL || '';

// Queue names
export const EMAIL_TASK_QUEUE = process.env.EMAIL_QUEUE || 'email-task-queue';

// Email credentials
export const EMAIL_USER = process.env.EMAIL_USER || '';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || '';
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Day Craft <support@daycraft.com>';
