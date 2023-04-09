import express from 'express';
import createError from 'http-errors';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import * as db from './src/config/db/index.js';
import route from './src/routes/index.js';

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
  }),
);

db.connect();

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

// get port in .env file
const PORT = process.env.PORT || 5000;

// app listening in port
app.listen(PORT, () => {
  console.log(`MoneyTracker Server App listening on port ${PORT}`);
});
