import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';

import routes from './routes';
import AppError from '../../errors/AppError';

import '../typeorm';
import '../../container';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);
app.use('/image_product', express.static(uploadConfig.tmpFolder));

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('Server started');
});
