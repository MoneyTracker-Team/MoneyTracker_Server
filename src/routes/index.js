import authRouter from './auth.router.js';
import userRouter from './user.router.js';

function route(app) {
  app.use('/users', userRouter);
  app.use('/auth', authRouter);
}

export default route;
