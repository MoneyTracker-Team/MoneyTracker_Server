import express from 'express';
import scheduleController from '../controllers/schedule.controller.js';
const router = express.Router();

//* [GET] /schedules/all-of-user/:userId    -> get all schedule of user
router.get('/all-of-user/:userId', scheduleController.getScheduleOfUser);

//* [POST] /schedules/create -> create a schedule
router.post('/create', scheduleController.createSchedule);

//* [PUT] /schedules/adjust-money
router.put('/adjust-money/:scheduleId', scheduleController.adjustMoneySchedule);

//* [PUT] /schedules/update/:id -> update a schedule
router.put('/update/:id', scheduleController.updateSchedule);

export default router;
