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
        {
          $project: {
            moneySpend: 1,
            dateTime: 1,
            location: 1,
            image: 1,
            note: 1,
            isDebt: 1,
            'debtor.name': 1,
            'debtor.image': 1,
          },
        },
      ]);
      // flat data:
      // data[0].debtor = data[0]?.debtor[0];
      const returnData = data.map((item) => {
        const { debtor, ...rest } = item;
        return { ...rest, debtor: debtor[0] };
      });

      return Promise.resolve(returnData);
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
      //  validate data
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
      // after pass validate
      const { image } = newLoan;
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
      // update
      const data = await Loan.updateOne({ _id: id }, newLoan);
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
