import User from '../model/user.model.js';

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
};
