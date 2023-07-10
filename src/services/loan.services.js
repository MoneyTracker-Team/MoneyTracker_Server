import Loan from '../model/loan.model.js';
import Friend from '../model/friend.model.js';
import { createLoanValidate, updateLoanValidate } from '../helpers/validation.js';
import createError from 'http-errors';
import mongoose from 'mongoose';
import { storeImg, removeImg } from '../helpers/cloudinary.js';

export default {
  getListLoanOfDebtor: async (userId, debtorId) => {
    try {
      if (!userId || !debtorId) {
        throw createError.BadRequest(
          'Can not use this api without includes "userId" in params and "debtorId" in query',
        );
      }
      // get loan and debt of debtor
      const data = await Loan.find({ userId, debtorId });
      // calc chekout money
      let totalDebtMoney = 0;
      let totalLoanMoney = 0;
      if (Array.isArray(data)) {
        data.map((item) => {
          switch (item.isDebt) {
            case true:
              totalDebtMoney += Number(item.moneySpend);
              break;
            case false:
              totalLoanMoney += Number(item.moneySpend);
            default:
              break;
          }
        });
      }
      return Promise.resolve({ checkoutMoney: totalLoanMoney - totalDebtMoney, loanAndDebts: data });
    } catch (err) {
      throw err;
    }
  },

  getAllLoanOfUser: async (userId) => {
    try {
      const data = await Loan.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'friends',
            localField: 'debtorId',
            foreignField: '_id',
            as: 'debtor',
          },
        },
      ]);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  /**
   * Expected data:
   * {
   *  debtor: {
   *    ...
   *  },
   *  totaLoan: 30000,
   *  totalDebt: 40000,
   * }
   */
  getLoanGroupByDebtor: async (userId) => {
    try {
      const data = await Loan.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: '$debtorId',
            totalLoan: { $sum: { $cond: [{ $eq: ['$isDebt', false] }, '$moneySpend', 0] } },
            totalDebt: { $sum: { $cond: [{ $eq: ['$isDebt', true] }, '$moneySpend', 0] } },
          },
        },
        {
          $lookup: {
            from: 'friends',
            localField: '_id',
            foreignField: '_id',
            as: 'debtor',
          },
        },
      ]);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getLoanById: async (id) => {
    try {
      const data = await Loan.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: 'friends',
            localField: 'friends',
            foreignField: '_id',
            as: 'listFriends',
          },
        },
      ]);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewLoan: async (newLoan) => {
    try {
      //  validate  data
      const { error } = createLoanValidate(newLoan);
      if (error) {
        throw createError(error.details[0].message);
      }
      //   after pass validate
      const { image } = newLoan;
      //* store image to cloud
      if (image) {
        try {
          const img = await storeImg(image);
          newLoan.image = img.url;
        } catch (err) {
          throw err;
        }
      }
      //* create many friends temporary
      const { tempFriends } = newLoan;
      let newFriendIds = [];
      if (tempFriends) {
        const listTempFriends = tempFriends.map((item) => {
          return { name: item, isTemporaty: true };
        });
        const newFriends = await Friend.insertMany(listTempFriends);
        newFriendIds = newFriends.map((item) => item._id);
      }
      // concat friend id between real fiend and temp friend
      if (Array.isArray(newLoan.friends) && newLoan.friends.length > 0)
        newLoan.friends = newLoan.friends.concat(newFriendIds);
      else newLoan.friends = newFriendIds;
      // create
      const data = await Loan.create(newLoan);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateLoan: async (id, newLoan) => {
    try {
      // validate data
      const { error } = updateLoanValidate(newLoan);
      if (error) {
        throw createError(error.details[0].message);
      }
      //   after pass validate
      const { image, tempFriends, friends } = newLoan;
      //* update image store
      if (image) {
        try {
          //* remove image
          (async () => {
            const data = await Loan.findOne({ _id: id }, { image: 1 });
            if (data?.image) {
              try {
                removeImg(data.image);
              } catch (err) {
                return;
              }
            }
          })();
          //* store new image
          const img = await storeImg(image);
          newLoan.image = img.url;
        } catch (err) {
          throw err;
        }
      }
      //todo: update friends
      let deleteFriendIds = [];
      if (friends || tempFriends) {
        let newFriendIds = [];
        if (tempFriends) {
          const listTempFriends = tempFriends.map((item) => {
            return { name: item, isTemporaty: true };
          });
          const newFriends = await Friend.insertMany(listTempFriends);
          newFriendIds = newFriends.map((item) => item._id);
        }
        let updateFriendIds = [];
        const getFriendIds = await Loan.findOne({ _id: id }, { friends: 1 });
        // get list friends before update
        const friendBeforeUpdate = getFriendIds?.friends
          ? getFriendIds.friends.map((objectId) => objectId.toString())
          : [];
        if (friends) {
          deleteFriendIds = Array.isArray(friends) ? friendBeforeUpdate.filter((id) => !friends.includes(id)) : [];
          updateFriendIds = friends.concat(newFriendIds);
        } else {
          updateFriendIds = friendBeforeUpdate.concat(newFriendIds);
        }
        newLoan.friends = updateFriendIds;
      }

      // update
      const data = await Loan.updateOne({ _id: id }, newLoan);
      //* delete friend temporary:
      await Friend.deleteMany({ _id: { $in: deleteFriendIds }, isTemporaty: true });
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },

  checkoutLoan: async (userId, debtorId) => {
    try {
      if (!userId || !debtorId) {
        throw createError.BadRequest(
          'Can not use this api without includes "userId" in params and "debtorId" in query',
        );
      }
      const data = await Loan.deleteMany({ userId, debtorId });
      return Promise.resolve(data.deletedCount);
    } catch (err) {
      throw err;
    }
  },

  deleteLoanById: async (id) => {
    try {
      //todo: delete image in cloud
      (async () => {
        const data = await Loan.findOne({ _id: id }, { image: 1 });
        if (data?.image) {
          try {
            removeImg(data.image);
          } catch (err) {
            return;
          }
        }
      })();
      // delete
      const data = await Loan.deleteOne({ _id: id });
      return Promise.resolve(data.deletedCount);
    } catch (err) {
      throw err;
    }
  },
};
