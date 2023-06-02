import User from '../model/user.model.js';
import userServices from '../services/user.services.js';

export default {
  getAll: async (req, res, next) => {
    try {
      const data = await userServices.getAllUser();
      res.status(200).json({
        status: 200,
        message: 'get all user success',
        data: data,
      });
    } catch (err) {
      next(err);
    }
  },

  getAnUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await userServices.getUserById(id);
      res.status(200).json({
        status: 200,
        message: 'get user information success',
        data: data,
      });
    } catch (err) {
      next(err);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, dateOfBirth, avatar, gender, currentMoney, slogan } = req.body;
      const newInfo = { name, dateOfBirth, avatar, gender, currentMoney, slogan };
      const data = await userServices.updateUserInfo(id, newInfo);
      res.status(200).json({
        status: 200,
        message: 'update user info success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
