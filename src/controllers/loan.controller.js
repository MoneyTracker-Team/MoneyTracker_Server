import loanServices from '../services/loan.services.js';

export default {
  getAllLoanOfUser: async (req, res, next) => {
    try {
      //!!!
    } catch (err) {
      next(err);
    }
  },

  getLoanGroupByDebtor: async (req, res, next) => {
    try {
      //!!!
    } catch (err) {
      next(err);
    }
  },

  getLoan: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await loanServices.getLoanById(id);
      res.status(200).json({
        status: 200,
        message: 'get a loan success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  createLoan: async (req, res, next) => {
    try {
      const { userId, debtorId, dateTime, location, image, note, isDebt } = req.body;
      const newLoan = { userId, debtorId, dateTime, location, image, note, isDebt };
      const data = await loanServices.createNewLoan(newLoan);
      res.status(201).json({
        status: 201,
        message: 'create new loan success',
        data,
      });
    } catch (err) {
      next(err);
    }
  },

  checkoutLoanDebtor: async (req, res, next) => {
    try {
      //!!!
    } catch (err) {
      next(err);
    }
  },

  updateLoan: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { debtorId, dateTime, location, image, note } = req.body;
      const newLoan = { debtorId, dateTime, location, image, note };
      const data = await loanServices.updateLoan(id, newLoan);
      res.status(200).json({
        status: 200,
        message: 'updated loan success',
        data: { updated: data },
      });
    } catch (err) {
      next(err);
    }
  },

  deleteLoan: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await loanServices.deleteLoanById(id);
      res.status(200).json({
        status: 200,
        message: 'deleted loan success',
        data: { deleted: data },
      });
    } catch (err) {
      next(err);
    }
  },
};
