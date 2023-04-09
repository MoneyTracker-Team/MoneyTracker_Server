import User from '../model/user.model.js';

export default {
  getAll: async (req, res, next) => {
    try {
      const data = await User.find({});
      res.status(200).json({
        status: 200,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  },

  getAnUser: async (req, res, next) => {
    try {
      const data = await User.findOne({
        nickName: 'Tomas',
      });

      res.status(200).json({
        status: 200,
        data: data,
      });
    } catch (err) {
      next(err);
    }
  },
};
