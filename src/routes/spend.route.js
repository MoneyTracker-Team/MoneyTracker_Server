import express from 'express';
import spendController from '../controllers/spend.controller.js';
const router = express.Router();

//* [GET] /spends/in-month?month=""?year=""
router.get('/in-month/:userId', spendController.getSpendInMonth);

//* [GET] /spends/all-of-user/:userId   -> get all spend of user
router.get('/all-of-user/:userId', spendController.getAllSpendOfUser);

//* [GET] /spends/:id   -> get a spend
router.get('/:id', spendController.getSpend);

//* [POST] /spends/create   -> create a spend
router.post('/create', spendController.createSpend);

//* [PUT] /spends/update/:id    -> update a spend
router.put('/update/:id', spendController.updateSpend);

//* [DELETE] /spends/delete/:id     -> delete a spend
router.delete('/delete/:id', spendController.deleteSpend);

export default router;

/**
 * Create a spend
 * update a spend
 * delete a spend
 * get a spend
 * get all spend of user
 * get all spend in month (calc total spend, fixed spend, date spend the most, least spend date)
 */

//? get all spend by month
const expectedData = {
  dateSpend: [
    {
      date: 'dd/mm/yyyy',
      total: 5,
    },
    {
      date: 'dd/mm/yyyy',
      total: 5,
    },
  ],
  totalMoneySpend: '4.000.000',
  fixedMoney: '2.000.000',
  dateAtLeast: 'dd/mm/yyyy',
  theMostDate: 'dd/mm/yyyy',
};

//? get all spend by month with schedule
const expected = {
  spends: [
    {
      date: 'dd/mm/yyyy',
      moneyLimit: '75.000',
      spended: '25.000',
    },
    {
      date: 'dd/mm/yyyy',
      moneyLimit: '75.000',
      spended: '25.000',
    },
  ],
  remainingMoney: '3.000.000',
  remainingDate: 3,
  fixedMoney: '2.000.000',
  spended: '1.000.0000',
};
