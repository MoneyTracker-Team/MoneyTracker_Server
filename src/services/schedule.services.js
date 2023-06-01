import SpendSchedule from '../model/spendSchedule.model.js';

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
      const data = await SpendSchedule.create(newSchedule);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },
};
