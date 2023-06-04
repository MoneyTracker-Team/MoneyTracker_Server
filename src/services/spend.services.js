import Spend from '../model/spend.model.js';
import SpendSchedule from '../model/spendSchedule.model.js';
import User from '../model/user.model.js';
import createError from 'http-errors';
import { spendValidate } from '../helpers/validation.js';
import mongoose from 'mongoose';
import { storeImg, removeImg } from '../helpers/cloudinary.js';

//? get all spend by month with schedule
const expected = {
  spends: [
    {
      date: 'dd/mm/yyyy',
      spended: '25.000',
    },
    {
      date: 'dd/mm/yyyy',
      spended: '25.000',
    },
  ],
  moneyLimit: '75.000', // = remain money / remain date
  remainingMoney: '3.000.000',
  remainingDate: 3,
  fixedMoney: '2.000.000',
  spended: '1.000.0000',
};

export default {
  getSpendSchedule: async (userId, month, year) => {
    try {
      const matchCondition = {
        userId: new mongoose.Types.ObjectId(userId),
        dateTime: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        },
      };

      //todo: Get and check having Schedule for month
      const schedule = await SpendSchedule.findOne({ month: month, year: year });
      if (!schedule) {
        return Promise.resolve({});
      }

      //todo:  Calc rest date in month
      const currentDate = new Date();
      let remainingDate =
        currentDate.getFullYear() > year
          ? 0
          : currentDate.getFullYear() < year
          ? new Date(year, month, 0).getDate()
          : currentDate.getMonth() + 1 > month
          ? 0
          : currentDate.getMonth() + 1 < month
          ? new Date(year, month, 0).getDate()
          : new Date(year, month, 0).getDate() - currentDate.getDate();

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
          return resolve({ totalSpended: data[0].totalMoney, fixedMoney: data[0].fixedMoney });
        });
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
                spended: { $sum: '$moneySpend' },
              },
            },
          ]);
          return resolve(data);
        });
      };

      const data = await Promise.all([getSpendsByDate(), getTotalSpendAndFixedSpend()]);

      const remainingMoney = schedule.scheduleMoney - data[1].totalSpended;
      const moneyLimit = remainingMoney > 0 && remainingDate > 0 ? Math.ceil(remainingMoney / remainingDate) : 0;

      return Promise.resolve({
        scheduleMoney: schedule.scheduleMoney,
        moneyLimit,
        remainingMoney,
        remainingDate,
        ...data[1],
        spends: data[0],
      });
    } catch (err) {
      throw err;
    }
  },

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
      const { image } = newSpend;
      //* store image to cloud
      if (image) {
        try {
          const img = await storeImg(image);
          newSpend.image = img.url;
        } catch (err) {
          throw err;
        }
      }
      // create
      const data = await Spend.create(newSpend)
        .then(async (result) => {
          try {
            //* update money of user
            await User.findOneAndUpdate({ _id: result.userId }, { $inc: { currentMoney: -result.moneySpend } });
            return Promise.resolve(result);
          } catch (err) {
            throw err;
          }
        })
        .catch((error) => createError(error.message));
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateSpendById: async (id, newSpend) => {
    try {
      const { image } = newSpend;
      //* update image store
      if (image) {
        try {
          //* remove image
          (async () => {
            const data = await Spend.findOne({ _id: id }, { image: 1 });
            if (data) {
              removeImg(data.image);
            }
          })();
          //* store new image
          const img = await storeImg(image);
          newSpend.image = img.url;
        } catch (err) {
          throw err;
        }
      }
      // update
      const spendBeforeUpdate = await Spend.findOne({ _id: id });
      const data = await Spend.updateOne({ _id: id }, newSpend);
      const spendAfterUpdate = await Spend.findOne({ _id: id });
      //* update money for user
      const { moneySpend } = newSpend;
      if (moneySpend) {
        const spaceMoney = spendAfterUpdate.moneySpend - spendBeforeUpdate.moneySpend;
        await User.findOneAndUpdate({ _id: spendBeforeUpdate.userId }, { $inc: { currentMoney: spaceMoney } });
      }
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },

  deleteSpendById: async (id) => {
    try {
      //todo: delete image in cloud
      (async () => {
        const data = await Spend.findOne({ _id: id }, { image: 1 });
        if (data) {
          removeImg(data.image);
        }
      })();
      // delete
      const data = await Spend.deleteOne({ _id: id });
      return Promise.resolve(data.deletedCount);
    } catch (err) {
      throw err;
    }
  },
};
