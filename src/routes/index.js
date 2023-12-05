import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import typeSpendRouter from './typeSpend.route.js';
import friendRouter from './friend.route.js';
import spendRouter from './spend.route.js';
import scheduleRouter from './schedule.route.js';
import adjustMoneyRouter from './adjustMoney.route.js';
import loanRouter from './loan.route.js';

function route(app) {
  app.use('/api/users', userRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/type-spends', typeSpendRouter);
  app.use('/api/friends', friendRouter);
  app.use('/api/spends', spendRouter);
  app.use('/api/schedules', scheduleRouter);
  app.use('/api/adjust-moneys', adjustMoneyRouter);
  app.use('/api/loans', loanRouter);
}

export default route;
