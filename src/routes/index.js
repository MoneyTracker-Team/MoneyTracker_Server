import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import typeSpendRouter from './typeSpend.route.js';

function route(app) {
  app.use('/users', userRouter);
  app.use('/auth', authRouter);
  app.use('/type-spends', typeSpendRouter);
}

export default route;
