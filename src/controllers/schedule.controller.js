import scheduleService from '../services/schedule.services.js';
import createError from 'http-errors';

export default {
  adjustMoneySchedule: async (req, res, next) => {
    try {
      const { moneyAdjust } = req.body;
      const { scheduleId } = req.params;
      if (!moneyAdjust) throw createError.ExpectationFailed('Expected moneyAdjust field in body of request');
      const data = await scheduleService.adjustMoneySchedule(scheduleId, moneyAdjust);
      res.status(200).json({
        status: 200,
        message: 'Adjust money in schedule success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getScheduleOfUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await scheduleService.getScheduleOfUser(userId);
      res.status(200).json({
        status: 200,
        message: 'get all schedule of user success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  createSchedule: async (req, res, next) => {
    try {
      const { userId, month, year, scheduleMoney } = req.body;
      const newSchedule = { userId, month, year, scheduleMoney };
      const data = await scheduleService.createNewSchedule(newSchedule);
      res.status(201).json({
        status: 201,
        message: 'create new schedule success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  updateSchedule: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { scheduleMoney } = req.body;
      const newSchedule = { scheduleMoney };
      const data = await scheduleService.updateScheduleById(id, newSchedule);
      res.status(200).json({
        status: 200,
        message: 'update schedule success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
