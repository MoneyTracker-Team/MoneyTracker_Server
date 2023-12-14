import Schedule from '../../src/model/spendSchedule.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[GET] /api/schedules/all-of-user/:userId', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const SCHEDULE_EXISTS = [
    {
      userId: '6571e073eb71f63b4b4ae6f6',
      month: 9,
      year: 2023,
      scheduleMoney: 5000000,
    },
    {
      userId: '6571e073eb71f63b4b4ae6f6',
      month: 10,
      year: 2023,
      scheduleMoney: 5000000,
    },
    {
      userId: '6571e073eb71f63b4b4ae6f6',
      month: 11,
      year: 2023,
      scheduleMoney: 5000000,
    },
  ];

  const INCORRECT_USER_ID = '6571e073eb71f63b4b%#$##4ae6f6';

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
    await Schedule.create(SCHEDULE_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await Schedule.deleteMany({ userId: USER_EXISTS._id });
    await User.deleteOne({ _id: USER_EXISTS._id });
  };

  beforeAll(async () => {
    //* connect DB Test
    await DbTest.connect();
    await createTestData();
  });

  afterAll(async () => {
    //* disconnect DB Test
    await clearTestData();
    await DbTest.disconnect();
  });

  //! TEST CASE 1: <GETSCHEDULE_TC_1>
  it('<GETSCHEDULE_TC_1> Successful get schedule with valid UserID', async () => {
    const response = await request(app).get(`/api/schedules/all-of-user/${USER_EXISTS._id}`);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('get all schedule of user success');
    expect(response.body.data).toHaveLength(3);
  });

  //! TEST CASE 2: <GETSCHEDULE_TC_2>
  it('<GETSCHEDULE_TC_2> Get Schedule without User ID', async () => {
    const response = await request(app).get(`/api/schedules/all-of-user`);
    //* Expected result:
    expect(response.status).toBe(404);
  });

  //! TEST CASE 3: <GETSCHEDULE_TC_3>
  it('<GETSCHEDULE_TC_3> Get Schedule with incorrect User ID', async () => {
    const response = await request(app).get(`/api/schedules/all-of-user/${INCORRECT_USER_ID}`);
    //* Expected result:
    expect(response.status).toBe(400);
  });
});
