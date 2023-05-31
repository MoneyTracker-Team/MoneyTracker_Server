import Spend from '../model/spend.model.js';
import createError from 'http-errors';
import { spendValidate } from '../helpers/validation.js';

export default {
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
