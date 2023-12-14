import Schedule from '../../src/model/spendSchedule.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[PUT] /api/schedules/adjust-money/:id', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const SCHEDULE_EXISTS = {
    _id: '6571c54cd9aed86a4fa4fda4',
    userId: '6571e073eb71f63b4b4ae6f6',
    month: 9,
    year: 2023,
    scheduleMoney: 5000000,
  };

  const DATA_TC_1 = {
    moneyAdjust: 1000,
  };

  const DATA_TC_2 = {
    moneyAdjust: -1000,
  };

  const DATA_EMPTY = {};

  const SCHEDULE_ID_NOT_EXISTS = '6571c54cd9aed86a4fa4fda1'; //! this schedule_id do not exists.

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

  beforeEach(async () => {
    await Schedule.updateOne({ _id: SCHEDULE_EXISTS._id }, { scheduleMoney: SCHEDULE_EXISTS.scheduleMoney });
  });

  afterAll(async () => {
    //* disconnect DB Test
    await clearTestData();
    await DbTest.disconnect();
  });

  //! TEST CASE 1: <ADJUSTMONEY_TC_1>
  it('<ADJUSTMONEY_TC_1> Successful adjust money in schedule with existing schedule _id (add)', async () => {
    const response = await request(app).put(`/api/schedules/adjust-money/${SCHEDULE_EXISTS._id}`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Adjust money in schedule success');
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.scheduleMoney).toBe(Number(SCHEDULE_EXISTS.scheduleMoney + DATA_TC_1.moneyAdjust));
  });

  //! TEST CASE 2: <ADJUSTMONEY_TC_2>
  it('<ADJUSTMONEY_TC_2> Successful adjust money in schedule with existing schedule _id (subtract)', async () => {
    const response = await request(app).put(`/api/schedules/adjust-money/${SCHEDULE_EXISTS._id}`).send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Adjust money in schedule success');
    expect(response.body.data).not.toBeNull();
    expect(response.body.data.scheduleMoney).toBe(Number(SCHEDULE_EXISTS.scheduleMoney + DATA_TC_2.moneyAdjust));
  });

  //! TEST CASE 3: <ADJUSTMONEY_TC_3>
  it('<ADJUSTMONEY_TC_3> Adjust money in schedule without schedule _id', async () => {
    const response = await request(app).put(`/api/schedules/adjust-money`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(404);
  });

  //! TEST CASE 4: <ADJUSTMONEY_TC_4>
  it('<ADJUSTMONEY_TC_4> Adjust money in schedule with incorrect schedule _id', async () => {
    const response = await request(app).put(`/api/schedules/adjust-money/${SCHEDULE_ID_NOT_EXISTS}`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('schedule_id not found');
  });

  //! TEST CASE 5: <ADJUSTMONEY_TC_5>
  it('<ADJUSTMONEY_TC_5> Adjust money in schedule without money', async () => {
    const response = await request(app).put(`/api/schedules/adjust-money/${SCHEDULE_ID_NOT_EXISTS}`).send(DATA_EMPTY);
    //* Expected result:
    expect(response.status).toBe(417);
    expect(response.body.message).toBe('Expected moneyAdjust field in body of request');
  });
});
