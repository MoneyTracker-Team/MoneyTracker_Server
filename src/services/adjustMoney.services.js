import HistoryAjustMoney from '../model/historyAjustMoney.model.js';
import User from '../model/user.model.js';
import createError from 'http-errors';

export default {
  getAllHistoryOfUser: async (userId) => {
    try {
      //* get current money of user:
      const currentMoney = await User.findById(userId).select('currentMoney');

      const histories = await HistoryAjustMoney.find({
        userId,
      }).sort({ createdAt: -1 });
      return Promise.resolve({ currentMoney, histories });
    } catch (err) {
      throw err;
    }
  },
};
