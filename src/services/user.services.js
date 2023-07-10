import User from '../model/user.model.js';
import Friend from '../model/friend.model.js';
import HistoryAjustMoney from '../model/historyAjustMoney.model.js';
import { changePasswordValidate, displaceValidate } from '../helpers/validation.js';
import createError from 'http-errors';
import { storeImg, removeImg } from '../helpers/cloudinary.js';
import getFileNameFromURL from '../helpers/getFileName.js';

export default {
  getAccountNotFriend: async (userId) => {
    //* get all userId is friend
    const friendData = await Friend.find({ userId, friendId: { $exists: true, $ne: null } }).select('friendId');
    const ids = friendData.map((item) => item.friendId);
    ids.push(userId);
    // get account not a friend
    const data = await User.find({ _id: { $nin: ids } });
    return Promise.resolve(data);
  },

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
      const { avatar } = newInfo;
      if (avatar) {
        try {
          //* remove avatar in cloud
          (async () => {
            const data = await User.findOne({ _id: id }, { avatar: 1 });
            if (data?.avatar) {
              const fileName = getFileNameFromURL(data.avatar);
              if (fileName !== 'avt_defaut_jvtz7u') {
                try {
                  removeImg(data.avatar);
                } catch (err) {
                  return;
                }
              }
            }
          })();
          //* store new avatar
          const img = await storeImg(avatar);
          newInfo.avatar = img.url;
        } catch (err) {
          throw err;
        }
      }
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

  updateCurrMoney: async (id, displace) => {
    try {
      const userData = await User.findOne({ _id: id });
      // validate displace
      const { error } = displaceValidate({ displace });
      if (error) {
        throw createError(error.details[0].message);
      }
      // after pass validate
      const newMoney = userData.currentMoney + Number(displace);
      let historyAdjustMoney = {};
      const data = await User.updateOne({ _id: id }, { currentMoney: newMoney }).then(async (data) => {
        historyAdjustMoney = await HistoryAjustMoney.create({ userId: id, ajustMoney: displace });
        return Promise.resolve(data);
      });
      return Promise.resolve({ userUpdated: data.modifiedCount, historyAdjustMoney });
    } catch (err) {
      throw err;
    }
  },
};
