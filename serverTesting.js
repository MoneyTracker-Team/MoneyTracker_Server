import express from 'express';
import createError from 'http-errors';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import route from './src/routes/index.js';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(
  cors({
    origin: '*',
  }),
);

route(app);

// create error if current route does not exists
app.use((req, res, next) => {
  next(createError.NotFound('This route does not exists!'));
});

// handle anything error in server
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
  });
});

export default app;
