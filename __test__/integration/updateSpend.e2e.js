import TypeSpend from '../../src/model/typeSpend.model.js';
import Spend from '../../src/model/spend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[PUT] /api/spends/update/:id', () => {
  //todo: CONST DATA TO TEST:
  const MESSAGE_SUCCESS = 'updated spend success';
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const TYPE_SPEND_EXISTS = {
    _id: '64abaaedcd1b10b9e92c581b',
    name: 'Xe bus',
    userId: USER_EXISTS._id,
    isDaily: true,
    isDefault: false,
  };

  const SPEND_EXISTS = {
    _id: '65771ebab60f02f15a542715',
    userId: '6571e073eb71f63b4b4ae6f6',
    typeId: '64abaaedcd1b10b9e92c581b',
    moneySpend: 30000,
    dateTime: '2023-07-13T04:36:44.947Z',
    tempFriends: ['Long', 'Tường'],
    note: 'Mua sắm áo quần tết',
  };

  const DATA_TC_1 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    typeId: '64abaaedcd1b10b9e92c581b',
    moneySpend: 'abc',
    dateTime: '2023-07-13T04:36:44.947Z',
    location: '',
    note: '',
  };

  const DATA_TC_2 = {
    moneySpend: 50000,
    location: 'Trường UIT',
  };

  const DATA_TC_3 = {
    userId: '657271f48f8f2aa85e70ecaf',
    typeId: '657272418f8f2aa85e70eccc', //! this TypeId do not exists
    moneySpend: 20000,
    dateTime: '2023-07-13T04:36:44.947Z',
    location: '',
    note: '',
  };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
    await TypeSpend.create(TYPE_SPEND_EXISTS);
    await Spend.create(SPEND_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await Spend.deleteMany({ userId: USER_EXISTS._id });
    await TypeSpend.deleteMany({ userId: USER_EXISTS._id });
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

  //! TEST CASE: <UD_SPEND_TC_1>
  it('<UD_SPEND_TC_1> Updating with invalid money amount', async () => {
    const response = await request(app).put(`/api/spends/update/${SPEND_EXISTS._id}`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <UD_SPEND_TC_2>
  it('<UD_SPEND_TC_2> Updating with valid moneyspend', async () => {
    const response = await request(app).put(`/api/spends/update/${SPEND_EXISTS._id}`).send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(200);
    // //* Expected record effected
    expect(response.body.message).toBe(MESSAGE_SUCCESS);
    expect(response.body.data.updated).toBe(1);
  });

  //! TEST CASE: <UD_SPEND_TC_3>
  it('<UD_SPEND_TC_3> Updating with Type ID not exists', async () => {
    const response = await request(app).put(`/api/spends/update/${SPEND_EXISTS._id}`).send(DATA_TC_3);
    //* Expected result:
    expect(response.status).toBe(404);
    // //* Expected record effected
    expect(response.message).toBe('TypeSpend do not exists');
  });
});
