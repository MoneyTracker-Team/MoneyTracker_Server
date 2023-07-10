import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';

//* [GET] /user-not-friend/:userId   -> get all account not a friend
router.get('/user-not-friend/:userId', userController.getAccountNotFriend);

//* [GET] /all-user -> get all user
router.get('/all-user', userController.getAll);

//* [GET] /:id  -> get user by id
router.get('/:id', userController.getAnUser);

//* [PUT] /update/:id   -> update user infor
router.put('/update/:id', userController.updateUser);

//* [PUT] /update-pass/:id  -> update password of user
router.put('/update-pass/:id', userController.updatePassword);

//* [PUT] /update-current-money/:id -> update current money of user
router.put('/update-current-money/:id', userController.updateCurrMoneyOfUser);

export default router;
