import Spend from '../model/spend.model.js';
import SpendSchedule from '../model/spendSchedule.model.js';
import User from '../model/user.model.js';
import Friend from '../model/friend.model.js';
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
  getStatisticSpend: async (userId, type) => {
    try {
      //* check type:
      if (!type) {
        throw createError.BadRequest('Expected /type in query of request');
      }

      let data = [];
      const currentDate = new Date();

      switch (type) {
        case 'week':
          const startOfWeek = new Date(); // Get the current date
          startOfWeek.setHours(0, 0, 0, 0); // Set the time to the start of the day (midnight)
          startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Calculate the start of the week (Sunday)
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(endOfWeek.getDate() + 6); // Calculate the end of the week (Saturday)
          endOfWeek.setHours(23, 59, 59, 999);

          data = await Spend.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                dateTime: {
                  $gte: startOfWeek,
                  $lte: endOfWeek,
                },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
                totalMoney: { $sum: '$moneySpend' },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ]);
          // convert format return array data
          data = data.map((item) => item.totalMoney);
          break;

        case 'month':
          const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

          data = await Spend.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                dateTime: {
                  $gte: startOfMonth,
                  $lte: endOfMonth,
                },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
                totalMoney: { $sum: '$moneySpend' },
              },
            },
            {
              $sort: {
                _id: 1,
              },
            },
          ]);
          // convert format return array data
          data = data.map((item) => item.totalMoney);
          break;

        // default type = date
        default:
          const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
          const endOfDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() + 1,
            23,
            59,
            59,
            999,
          );

          data = await Spend.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                dateTime: {
                  $gte: startOfDay,
                  $lte: endOfDay,
                },
              },
            },
            {
              $sort: {
                moneySpend: 1,
              },
            },
            {
              $project: {
                moneySpend: 1,
              },
            },
          ]);
          // convert format return array data
          data = data.map((item) => item.moneySpend);
          break;
      }

      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getSpendInDate: async (userId, day, month, year) => {
    try {
      const inputDate = new Date(Number(year), Number(month) - 1, Number(day));
      inputDate.setHours(0, 0, 0, 0);
      const endDate = new Date(inputDate.getTime() + 24 * 60 * 60 * 1000 - 1);

      //* get spends in date
      const getSpends = () =>
        new Promise(async (resolve) => {
          const data = await Spend.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                dateTime: {
                  $gte: inputDate,
                  $lte: endDate,
                },
              },
            },
            {
              $lookup: {
                from: 'typespends',
                localField: 'typeId',
                foreignField: '_id',
                as: 'types',
              },
            },
            {
              $project: {
                moneySpend: 1,
                dateTime: 1,
                note: 1,
                'types.name': 1,
                'types.image': 1,
              },
            },
          ]);
          return resolve(data);
        });

      const calcTotalMoney = () =>
        new Promise(async (resolve) => {
          const data = await Spend.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId),
                dateTime: {
                  $gte: inputDate,
                  $lte: endDate,
                },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$dateTime' } },
                totalMoney: { $sum: '$moneySpend' },
              },
            },
          ]);
          return resolve(data);
        });
      const data = await Promise.all([calcTotalMoney(), getSpends()]);
      const spendDatas = data[1].map((spend) => {
        const { types, image, ...rest } = spend;
        return { ...rest, name: types[0].name, image: types[0].image };
      });
      const returnData =
        data[0].length === 0 ? {} : { date: data[0][0]._id, totalMoney: data[0][0].totalMoney, spends: spendDatas };
      return Promise.resolve(returnData);
    } catch (err) {
      throw err;
    }
  },

  getSpendForPieChart: async (userId, month, year) => {
    try {
      if (!month || !year) {
        throw createError.ExpectationFailed('Expected /month and /year in query of request');
      }

      const data = await Spend.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            dateTime: {
              $gte: new Date(year, month - 1, 1),
              $lt: new Date(year, month, 1),
            },
          },
        },
        {
          $group: {
            _id: '$typeId',
            totalMoney: { $sum: '$moneySpend' },
          },
        },
        {
          $lookup: {
            from: 'typespends',
            let: { typeId: '$_id' },
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeId'] } } }, { $project: { _id: 0, name: 1 } }],
            as: 'type',
          },
        },
        {
          $project: {
            typeSpend: { $arrayElemAt: ['$type.name', 0] },
            totalMoney: 1,
          },
        },
      ]);

      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

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
          return resolve({
            totalSpended: data[0]?.totalMoney ? data[0].totalMoney : 0,
            fixedMoney: data[0]?.fixedMoney ? data[0].fixedMoney : 0,
          });
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
        scheduleId: schedule._id,
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
          return resolve({ minTotalMoney: data[0]?.minTotalMoney ?? 0, maxTotalMoney: data[0]?.maxTotalMoney ?? 0 });
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
          return resolve({ totalMoney: data[0]?.totalMoney ?? 0, fixedMoney: data[0]?.fixedMoney ?? 0 });
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
      const data = await Spend.aggregate([
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
      //* create many friends temporary
      const { tempFriends } = newSpend;
      let newFriendIds = [];
      if (tempFriends) {
        const listTempFriends = tempFriends.map((item) => {
          return { name: item, isTemporaty: true };
        });
        const newFriends = await Friend.insertMany(listTempFriends);
        newFriendIds = newFriends.map((item) => item._id);
      }
      // concat friend id between real fiend and temp friend
      if (Array.isArray(newSpend.friends) && newSpend.friends.length > 0)
        newSpend.friends = newSpend.friends.concat(newFriendIds);
      else newSpend.friends = newFriendIds;

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
      const { image, friends, tempFriends } = newSpend;
      //todo update image store
      if (image) {
        try {
          //* remove image
          (async () => {
            const data = await Spend.findOne({ _id: id }, { image: 1 });
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
          newSpend.image = img.url;
        } catch (err) {
          throw err;
        }
      }
      //todo update friends
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
        const getFriendIds = await Spend.findOne({ _id: id }, { friends: 1 });
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
        newSpend.friends = updateFriendIds;
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
      //* delete friend temporary:
      await Friend.deleteMany({ _id: { $in: deleteFriendIds }, isTemporaty: true });
      // .then((result) => console.log(result))
      // .catch((err) => console.log(err));
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
        if (data?.image) {
          try {
            removeImg(data.image);
          } catch (err) {
            return;
          }
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
