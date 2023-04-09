import userRouter from './user.router.js';

function route(app) {
  app.use('/users', userRouter);
}

export default route;
