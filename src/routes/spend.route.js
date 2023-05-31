import express from 'express';
import spendController from '../controllers/spend.controller.js';
const router = express.Router();

//* [GET] /spends/in-month?month=""
router.get('/in-month', spendController.getSpendInMonth);

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
