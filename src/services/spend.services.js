import Spend from '../model/spend.model.js';
import createError from 'http-errors';
import { spendValidate } from '../helpers/validation.js';
import mongoose from 'mongoose';

export default {
  getSpendInMonth: async (userId, month, year) => {
    try {
      const matchCondition = {
        userId: new mongoose.Types.ObjectId(userId),
        dateTime: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      };

      //todo: get list spend group by date
      let getSpendsByDate = () => {
        return new Promise(async (resolve) => {
          const data = await Spend.aggregate([
            {
              $match: matchCondition,
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
                totalSpend: { $sum: 1 },
              },
            },
          ]);
          return resolve(data);
        });
      };

      //todo: get min and max total money spend in date of month
      let getMinMaxMoneySpendInMonth = () => {
        return new Promise(async (resolve) => {
          const data = await Spend.aggregate([
            {
              $match: matchCondition,
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
                moneySpend: { $sum: '$moneySpend' },
              },
            },
            { $sort: { moneySpend: 1 } },
            {
              $group: {
                _id: null,
                minTotalMoney: { $first: '$moneySpend' },
                maxTotalMoney: { $last: '$moneySpend' },
              },
            },
          ]);
          return resolve({ minTotalMoney: data[0].minTotalMoney, maxTotalMoney: data[0].maxTotalMoney });
        });
      };

      //todo: get totalspend and fixed spend in month
      let getTotalSpendAndFixedSpend = () => {
        return new Promise(async (resolve) => {
          const data = await Spend.aggregate([
            {
              $lookup: {
                from: 'typespends',
                localField: 'typeId',
                foreignField: '_id',
                as: 'types',
              },
            },
            {
              $unwind: '$types',
            },
            {
              $match: matchCondition,
            },
            {
              $group: {
                _id: null,
                totalMoney: { $sum: '$moneySpend' },
                fixedMoney: { $sum: { $cond: [{ $eq: ['$types.isDaily', true] }, '$moneySpend', 0] } },
              },
            },
          ]);
          return resolve({ totalMoney: data[0].totalMoney, fixedMoney: data[0].fixedMoney });
        });
      };

      const data = await Promise.all([getMinMaxMoneySpendInMonth(), getTotalSpendAndFixedSpend(), getSpendsByDate()]);

      return Promise.resolve({ ...data[0], ...data[1], spends: data[2] });
    } catch (err) {
      throw err;
    }
  },

  getAllSpendOfUser: async (userId) => {
    try {
      const data = await Spend.find({ userId });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getSpendById: async (id) => {
    try {
      const data = await Spend.findOne({ _id: id });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewSpend: async (newSpend) => {
    try {
      // validate data
      const dataValidate = {
        userId: newSpend.userId,
        typeId: newSpend.typeId,
        moneySpend: newSpend.moneySpend,
        dateTime: newSpend.dateTime,
      };
      const { error } = spendValidate(dataValidate);
      if (error) {
        throw createError(error.details[0].message);
      }
      //  after pass validate
      const data = await Spend.create(newSpend);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateSpendById: async (id, newSpend) => {
    try {
      const data = await Spend.updateOne({ _id: id }, newSpend);
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },

  deleteSpendById: async (id) => {
    try {
      const data = await Spend.deleteOne({ _id: id });
      return Promise.resolve(data.deletedCount);
    } catch (err) {
      throw err;
    }
  },
};
