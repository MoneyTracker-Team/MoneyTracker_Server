import HistoryAjustMoney from '../model/historyAjustMoney.model.js';
import createError from 'http-errors';

export default {
  getAllHistoryOfUser: async (userId, month, year) => {
    try {
      if (!month || !year) {
        throw createError.ExpectationFailed('Expected "month" and "year" in api request');
      }
      const data = await HistoryAjustMoney.find({
        userId,
        createdAt: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      }).sort({ createdAt: -1 });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
