import express from 'express';
import testController from '../controllers/test.controller.js';
const router = express.Router();

router.post('/upload', testController.upLoad);

router.delete('/destroy', testController.destroy);

export default router;
