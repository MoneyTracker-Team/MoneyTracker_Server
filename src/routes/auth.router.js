import express from 'express';
import authController from '../controllers/auth.controller.js';
const router = express.Router();

//* [POST] /auth/register   -> register new account
router.post('/register', authController.register);

//* [POST] /auth/login  -> user login
router.post('/login', authController.login);

export default router;
