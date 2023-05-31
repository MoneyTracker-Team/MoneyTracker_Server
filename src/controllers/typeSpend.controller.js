import typeSpendServices from '../services/typeSpend.services.js';

export default {
  getAllTypeSpend: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await typeSpendServices.getAllTypeSpendByUser(userId);
      res.status(200).json({
        status: 200,
        message: 'get all type spend of user success',
        data: { typeSpends: data },
      });
    } catch (err) {
      next(err);
    }
  },

  createTypeSpend: async (req, res, next) => {
    try {
      const { userId, name, image, isDaily, isDefault } = req.body;
      const newType = { userId, name, image, isDaily, isDefault };
      const data = await typeSpendServices.createNewTypeSpend(newType);
      res.status(201).json({
        status: 201,
        message: 'create new type spend success',
        data: { newTypeSpend: data },
      });
    } catch (err) {
      next(err);
    }
  },

  updateTypeSpend: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, image } = req.body;
      const newType = { name, image };
      const data = await typeSpendServices.updateTypeSpend(id, newType);
      res.status(200).json({
        status: 200,
        message: 'updated type spend success',
        data: { updated: data },
      });
    } catch (err) {
      next(err);
    }
  },

  deleteTypeSpend: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await typeSpendServices.deleteTypeSpendById(id);
      res.status(200).json({
        status: 200,
        message: 'delete type spend success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },
};
