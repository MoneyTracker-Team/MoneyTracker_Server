import { query } from 'express';
import spendServices from '../services/spend.services.js';

export default {
  getStatisticSpend: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { type } = req.query;
      const data = await spendServices.getStatisticSpend(userId, type);
      res.status(200).json({
        status: 200,
        message: 'get data statistic spend success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getSpendInDate: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { day, month, year } = req.query;
      const data = await spendServices.getSpendInDate(userId, day, month, year);
      res.status(200).json({
        status: 200,
        message: 'Get all spends in date success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getSpendForPieChart: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { month, year } = req.query;
      const data = await spendServices.getSpendForPieChart(userId, month, year);
      res.status(200).json({
        status: 200,
        message: 'get spend data for pie chart success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getSpendSchedule: async (req, res, next) => {
    try {
      const { month, year } = req.query;
      const { userId } = req.params;
      const data = await spendServices.getSpendSchedule(userId, month, year);
      const message =
        Object.keys(data).length === 0
          ? `in ${month}/${year} not yet schedule!`
          : `get spend schedule in ${month}/${year} success`;
      res.status(200).json({
        status: 200,
        message,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getSpendInMonth: async (req, res, next) => {
    try {
      const { month, year } = req.query;
      const { userId } = req.params;
      const data = await spendServices.getSpendInMonth(userId, month, year);
      res.status(200).json({
        status: 200,
        message: `get data in ${month}/${year} success`,
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  getAllSpendOfUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await spendServices.getAllSpendOfUser(userId);
      res.status(200).json({
        status: 200,
        message: 'get all spend of user success',
        data: { spends: data },
      });
    } catch (err) {
      next(err);
    }
  },

  getSpend: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await spendServices.getSpendById(id);
      res.status(200).json({
        status: 200,
        message: 'get a spend success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  createSpend: async (req, res, next) => {
    try {
      const { userId, typeId, moneySpend, dateTime, location, image, friends, tempFriends, note } = req.body;
      const newSpend = { userId, typeId, moneySpend, dateTime, location, image, friends, tempFriends, note };
      const data = await spendServices.createNewSpend(newSpend);
      res.status(201).json({
        status: 201,
        message: 'create new spend success',
        data: { newSpend: data },
      });
    } catch (err) {
      next(err);
    }
  },

  updateSpend: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { typeId, moneySpend, dateTime, location, image, friends, tempFriends, note } = req.body;
      const newSpend = { typeId, moneySpend, dateTime, location, image, friends, tempFriends, note };
      const data = await spendServices.updateSpendById(id, newSpend);
      res.status(200).json({
        status: 200,
        message: 'updated spend success',
        data: { updated: data },
      });
    } catch (err) {
      next(err);
    }
  },

  deleteSpend: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await spendServices.deleteSpendById(id);
      res.status(200).json({
        status: 200,
        message: 'delete spend success',
        data: { deleted: data },
      });
    } catch (err) {
      next(err);
    }
  },
};
