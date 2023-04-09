import express from 'express';
const router = express.Router();
import userController from '../controllers/user.controller.js';

router.get('/all-user', userController.getAll);

router.get('/:id', userController.getAnUser);

export default router;
