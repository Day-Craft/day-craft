import express from 'express';
import morganLogger from 'morgan';
import helmetSecurity from 'helmet';
import corsMiddleware from 'cors';
import cookieParserMiddleware from 'cookie-parser';

import { handleError, handleNotFound } from './lib/middlewares';
import MessageResponseInterface from './interfaces/MessageResponse';

import dotenv from 'dotenv';
dotenv.config();

const expressApp = express();
expressApp.use(morganLogger('dev'));
expressApp.use(helmetSecurity());
expressApp.use(corsMiddleware());
expressApp.use(express.json());
expressApp.use(cookieParserMiddleware());

// Define root route
expressApp.get('/', (req, res) => {
  const apiResponse: MessageResponseInterface = {
    success: true,
    message: 'Hello Day Craft!',
    error: undefined,
  };
  res.status(200).json(apiResponse);
});

// Define health check route
expressApp.get('/health', (req, res) => {
  const apiResponse: MessageResponseInterface = {
    success: true,
    message: 'Server is running!',
    error: undefined,
  };
  res.status(200).json(apiResponse);
});

// Importing API routes
import apiRoutes from './route';
expressApp.use('/api', apiRoutes);

// Use custom middlewares for handling 404 and errors
expressApp.use(handleNotFound);
expressApp.use(handleError);

export default expressApp;
