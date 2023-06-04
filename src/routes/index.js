import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import typeSpendRouter from './typeSpend.route.js';
import friendRouter from './friend.route.js';
import spendRouter from './spend.route.js';
import scheduleRouter from './schedule.route.js';
import adjustMoneyRouter from './adjustMoney.route.js';
import loanRouter from './loan.route.js';
import testRouter from './test.route.js';

function route(app) {
  app.use('/users', userRouter);
  app.use('/auth', authRouter);
  app.use('/type-spends', typeSpendRouter);
  app.use('/friends', friendRouter);
  app.use('/spends', spendRouter);
  app.use('/schedules', scheduleRouter);
  app.use('/adjust-moneys', adjustMoneyRouter);
  app.use('/loans', loanRouter);
  app.use('/test', testRouter);
}

export default route;
