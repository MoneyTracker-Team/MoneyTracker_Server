import spendServices from '../services/spend.services.js';

export default {
  getSpendInMonth: async (req, res, next) => {
    try {
      //
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
      const { userId, typeId, moneySpend, dateTime, location, image, friends, note } = req.body;
      const newSpend = { userId, typeId, moneySpend, dateTime, location, image, friends, note };
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
      const { typeId, moneySpend, dateTime, location, image, friends, note } = req.body;
      const newSpend = { typeId, moneySpend, dateTime, location, image, friends, note };
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