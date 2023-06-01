import express from 'express';
import scheduleController from '../controllers/schedule.controller.js';
const router = express.Router();

//* [GET] /schedules/all-of-user/:userId    -> get all schedule of user
router.get('/all-of-user/:userId', scheduleController.getScheduleOfUser);

//* [POST] /schedules/create -> create a schedule
router.post('/create', scheduleController.createSchedule);

export default router;
