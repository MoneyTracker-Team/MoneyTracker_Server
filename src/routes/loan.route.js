import express from 'express';
import loanController from '../controllers/loan.controller.js';
const router = express.Router();

//* [GET] /loans/checkout-debtor/:userId?debtorId=""    -> Get all loans of a debtor
router.get('/checkout-debtor/:userId', loanController.getListLoanOfDebtor);

//* [GET] /loans/all-of-user/:userId -> Get all loan of user + infor debtor
router.get('/all-of-user/:userId', loanController.getAllLoanOfUser);

//* [GET] /loans/group-by-debtor/:userId -> Get all checkout debt group by user
router.get('/group-by-debtor/:userId', loanController.getLoanGroupByDebtor);

//* [GET] /loans/:id    -> Get detail a loan
router.get('/:id', loanController.getLoan);

//* [POST] /loans/create-> create a loan
router.post('/create', loanController.createLoan);

//* [POST] /loans/checkout-loans-debtor    -> checkout loan with debtor
router.post('/checkout-loans-debtor', loanController.checkoutLoanDebtor);

//* [PUT] /loans/update/:id -> update a loan
router.put('/update/:id', loanController.updateLoan);

//* [DELETE] /loans/delete/:id -> delete a loan
router.delete('/delete/:id', loanController.deleteLoan);

export default router;
