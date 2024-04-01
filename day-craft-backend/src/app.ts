import express from 'express';
import morganLogger from 'morgan';
import helmetSecurity from 'helmet';
import corsMiddleware from 'cors';
import cookieParserMiddleware from 'cookie-parser';

import { handleError, handleNotFound } from './lib/middlewares';
import generateResponse from './interfaces/MessageResponse';

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
  res.status(200).json(generateResponse(true, 'Hello Day Craft!', null, undefined));
});

// Define health check route
expressApp.get('/health', (req, res) => {
  res.status(200).json(generateResponse(true, 'Server is running!', null, undefined));
});

// Importing API routes
import apiRoutes from './route';
expressApp.use('/api', apiRoutes);

// Use custom middlewares for handling 404 and errors
expressApp.use(handleNotFound);
expressApp.use(handleError);

export default expressApp;
