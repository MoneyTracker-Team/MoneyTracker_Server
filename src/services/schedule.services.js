import SpendSchedule from '../model/spendSchedule.model.js';
import { scheduleValidate } from '../helpers/validation.js';
import createError from 'http-errors';

export default {
  getScheduleOfUser: async (userId) => {
    try {
      const data = await SpendSchedule.find({ userId });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewSchedule: async (newSchedule) => {
    try {
      //* validate data
      const { error } = scheduleValidate(newSchedule);
      if (error) {
        throw createError(error.details[0].message);
      }
      //* after pass validate
      const data = await SpendSchedule.create(newSchedule);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateScheduleById: async (id, newSchedule) => {
    try {
      const data = await SpendSchedule.updateOne({ _id: id }, newSchedule);
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },
};
