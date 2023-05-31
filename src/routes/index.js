import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import typeSpendRouter from './typeSpend.route.js';
import friendRouter from './friend.route.js';
import spendRouter from './spend.route.js';

function route(app) {
  app.use('/users', userRouter);
  app.use('/auth', authRouter);
  app.use('/type-spends', typeSpendRouter);
  app.use('/friends', friendRouter);
  app.use('/spends', spendRouter);
}

export default route;
