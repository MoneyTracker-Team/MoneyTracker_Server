import express from 'express';
import friendController from '../controllers/friend.controller.js';
const router = express.Router();

//* [GET] /friends/all-of-user  -> Get all friend of user
router.get('/all-of-user/:userId', friendController.getAllFriendOfUser);

//* [POST] /friends/create/:userId  -> create new friend
router.post('/create/:userId', friendController.createNewFriend);

//* [PUT] /friends/update/:id   -> update a friend
router.put('/update/:id', friendController.updateFriend);

//* [DELETE] /friends/delete/:id    -> delete friend
router.delete('/delete/:id', friendController.deleteFriend);

export default router;
