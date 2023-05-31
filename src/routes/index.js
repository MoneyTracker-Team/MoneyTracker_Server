import authRouter from './auth.route.js';
import userRouter from './user.route.js';

function route(app) {
  app.use('/users', userRouter);
  app.use('/auth', authRouter);
}

export default route;
