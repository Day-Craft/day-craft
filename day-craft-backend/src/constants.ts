export const NOT_FOUND_MESSAGE = 'The requested resource cannot be found.';
export const GENERIC_ERROR_MESSAGE = 'Something went wrong, please try again later. If the problem persists, contact support.';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'internal-token';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'internal-token';
export const COOKIE_SETTINGS = { httpOnly: true, secure: true };
