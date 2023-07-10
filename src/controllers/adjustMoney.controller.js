import adjustMoneyServices from '../services/adjustMoney.services.js';

export default {
  getAllHistory: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await adjustMoneyServices.getAllHistoryOfUser(userId);
      res.status(200).json({
        status: 200,
        message: 'get history adjust money of user success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
