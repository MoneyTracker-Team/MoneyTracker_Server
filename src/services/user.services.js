import User from '../model/user.model.js';
import { changePasswordValidate } from '../helpers/validation.js';
import createError from 'http-errors';

export default {
  getAllUser: async () => {
    try {
      const data = await User.find();
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getUserById: async (id) => {
    try {
      const data = await User.findOne({ _id: id });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateUserInfo: async (id, newInfo) => {
    try {
      const data = await User.updateOne({ _id: id }, newInfo);
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },

  updatePassOfUser: async (id, oldPassword, newPassword) => {
    try {
      // validate Password
      const { error } = changePasswordValidate({ oldPassword, newPassword });
      if (error) {
        throw createError(error.details[0].message);
      }
      const userData = await User.findOne({ _id: id });
      if (!(userData.password === oldPassword)) {
        throw createError.BadRequest('password not match');
      }
      //   after pass validate
      const data = await User.updateOne({ _id: id }, { password: newPassword });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
