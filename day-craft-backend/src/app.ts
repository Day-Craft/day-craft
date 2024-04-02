import cookieParserMiddleware from 'cookie-parser';
import corsMiddleware from 'cors';
import express from 'express';
import helmetSecurity from 'helmet';
import morganLogger from 'morgan';

import generateResponse from './interfaces/MessageResponse';
import { handleError, handleNotFound } from './lib/middlewares';

const expressApp = express();
expressApp.use(morganLogger('dev'));
expressApp.use(helmetSecurity());
expressApp.use(corsMiddleware());
expressApp.use(express.json());
expressApp.use(cookieParserMiddleware());

// Define root route
expressApp.get('/', (_req, res) => {
  res.status(200).json(generateResponse(true, 'Hello Day Craft!', null, undefined));
});

// Define health check route
expressApp.get('/health', (_req, res) => {
  res.status(200).json(generateResponse(true, 'Server is running!', null, undefined));
});

// Importing API routes
import apiRoutes from './route';
expressApp.use('/api', apiRoutes);

// Use custom middlewares for handling 404 and errors
expressApp.use(handleNotFound);
expressApp.use(handleError);

export default expressApp;
