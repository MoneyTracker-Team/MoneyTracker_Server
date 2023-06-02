import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';

//* [GET] /all-user -> get all user
router.get('/all-user', userController.getAll);

//* [GET] /:id  -> get user by id
router.get('/:id', userController.getAnUser);

//* [PUT] /update/:id   -> update user infor
router.put('/update/:id', userController.updateUser);

export default router;
