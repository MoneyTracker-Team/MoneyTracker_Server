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
      const { name, dateOfBirth, avatar, gender, slogan } = req.body;
      const newInfo = { name, dateOfBirth, avatar, gender, slogan };
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

  updatePassword: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;
      const data = await userServices.updatePassOfUser(id, oldPassword, newPassword);
      res.status(200).json({
        status: 200,
        messaage: 'update pass word for user success',
        data: { updated: data.modifiedCount },
      });
    } catch (err) {
      next(err);
    }
  },

  updateCurrMoneyOfUser: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { displace } = req.body;
      const data = await userServices.updateCurrMoney(id, displace);
      res.status(200).json({
        status: 200,
        message: 'update current money success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
