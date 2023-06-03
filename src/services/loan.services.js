import Loan from '../model/loan.model.js';
import { createLoanValidate, updateLoanValidate } from '../helpers/validation.js';
import createError from 'http-errors';
import mongoose from 'mongoose';

export default {
  getAllLoanOfUser: async (userId) => {
    try {
      const data = await Loan.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'friends',
            localField: 'debtorId',
            foreignField: '_id',
            as: 'debtor',
          },
        },
      ]);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  getLoanById: async (id) => {
    try {
      const data = await Loan.findOne({ _id: id });
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  createNewLoan: async (newLoan) => {
    try {
      //  validate  data
      const { error } = createLoanValidate(newLoan);
      if (error) {
        throw createError(error.details[0].message);
      }
      //   after pass validate
      const data = await Loan.create(newLoan);
      return Promise.resolve(data);
    } catch (err) {
      throw err;
    }
  },

  updateLoan: async (id, newLoan) => {
    try {
      // validate data
      const { error } = updateLoanValidate(newLoan);
      if (error) {
        throw createError(error.details[0].message);
      }
      //   after pass validate
      const data = await Loan.updateOne({ _id: id }, newLoan);
      return Promise.resolve(data.modifiedCount);
    } catch (err) {
      throw err;
    }
  },

  deleteLoanById: async (id) => {
    try {
      const data = await Loan.deleteOne({ _id: id });
      return Promise.resolve(data.deletedCount);
    } catch (err) {
      throw err;
    }
  },
};
