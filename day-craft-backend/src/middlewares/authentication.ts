import jwt, { JwtPayload } from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET } from '../constants';
import { wrapAsync } from '../lib/wrapAsync';
import { findUserByCondition } from '../models/users.model';

export const authenticationMiddleware = wrapAsync(async (req, res, next) => {
  const { accessToken } = req.cookies || {};
  const authorization = req.header('Authorization') || '';
  const access_token = accessToken || authorization.replace('Bearer ', '');

  if (!access_token) {
    throw new Error('Invalid Access Token');
  }

  const decodedToken = jwt.verify(access_token, ACCESS_TOKEN_SECRET) as JwtPayload;
  const userDetails = await findUserByCondition(decodedToken?.email, 'email');

  if (!userDetails) {
    res.sendStatus(401);
    throw new Error('Invalid Access Token');
  }

  req.user = userDetails;
  next();
});
