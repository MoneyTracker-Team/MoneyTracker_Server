import express from 'express';
import adjustMoneyController from '../controllers/adjustMoney.controller.js';
const router = express.Router();

//* [GET] /adjust-moneys/all-of-user/:userId -> Get all history adjust money of user
router.get('/all-of-user/:userId', adjustMoneyController.getAllHistory);

export default router;
