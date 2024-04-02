const REDIS_SERVER_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_SERVER_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_SERVER_USERNAME = process.env.REDIS_USERNAME || 'username';
const REDIS_SERVER_PASSWORD = process.env.REDIS_PASSWORD || 'password';

export const REDIS_SERVER_CONFIG = { 
    host: REDIS_SERVER_HOST,
    port: REDIS_SERVER_PORT,
    username: REDIS_SERVER_USERNAME,
    password: REDIS_SERVER_PASSWORD,
};

export const WORKER_RATE_LIMITER = {
    max: parseInt(process.env.WORKER_LIMITER_MAX || '10'),
    duration: parseInt(process.env.WORKER_LIMITER_DURATION || '1000'),
};

export const EMAIL_TASK_QUEUE = process.env.EMAIL_QUEUE || 'email-queue';
