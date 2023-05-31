import express from 'express';
import typeSpendController from '../controllers/typeSpend.controller.js';
const router = express.Router();

//* [GET]   :userID  -> Get all type spend of user
router.get('/all-of-user/:userId', typeSpendController.getAllTypeSpend);

//* [POST] /type-spends/cteate  -> create a type spend
router.post('/create', typeSpendController.createTypeSpend);

//* [PUT] /type-spends/update/:id   -> update a type spend
router.put('/update/:id', typeSpendController.updateTypeSpend);

//* [DELETE] /type-spend/delete/:id -> delete a type spend
router.delete('/delete/:id', typeSpendController.deleteTypeSpend);

export default router;
