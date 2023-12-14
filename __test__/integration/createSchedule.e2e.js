import Schedule from '../../src/model/spendSchedule.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/schedules/create', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const SCHEDULE_EXISTS = {
    userId: '6571e073eb71f63b4b4ae6f6',
    month: 9,
    year: 2023,
    scheduleMoney: 5000000,
  };

  const DATA_TC_1 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    month: 10,
    year: 2023,
    scheduleMoney: 5000000,
  };

  const DATA_TC_2 = {
    userId: '6571e073eb71f63b4b4ae6f6',
  };

  const DATA_TC_3 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    scheduleMoney: 5000000,
    month: 10,
  };

  const DATA_TC_4 = {
    userId: '64aa758cec43a81576432b5a',
    month: 10,
    year: 2023,
  };

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

  //! TEST CASE 1: <CREATESCHEDULE_TC_1>
  it('<CREATESCHEDULE_TC_1> Successful create schedule', async () => {
    const response = await request(app).post(`/api/schedules/create`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('create new schedule success');
    expect(response.body.data.month).toBe(DATA_TC_1.month);
    expect(response.body.data.year).toBe(DATA_TC_1.year);
    expect(response.body.data.scheduleMoney).toBe(DATA_TC_1.scheduleMoney);
    expect(response.body.data.userId).toBe(USER_EXISTS._id);
  });

  //! TEST CASE 2: <CREATESCHEDULE_TC_2>
  it('<CREATESCHEDULE_TC_2> Create Schedule without month and year', async () => {
    const response = await request(app).post(`/api/schedules/create`).send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE 3: <CREATESCHEDULE_TC_3>
  it('<CREATESCHEDULE_TC_3> Create Schedule without year', async () => {
    const response = await request(app).post(`/api/schedules/create`).send(DATA_TC_3);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE 4: <CREATESCHEDULE_TC_4>
  it('<CREATESCHEDULE_TC_4> Creating Schedule without schedule money', async () => {
    const response = await request(app).post(`/api/schedules/create`).send(DATA_TC_4);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE 5: <CREATESCHEDULE_TC_5>
  it('<CREATESCHEDULE_TC_5> Creating new schedule conflict Schedule month year', async () => {
    const response = await request(app).post(`/api/schedules/create`).send(SCHEDULE_EXISTS);
    //* Expected result:
    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      `Schedule in month ${SCHEDULE_EXISTS.month} year ${SCHEDULE_EXISTS.year} already exists`,
    );
  });
});
