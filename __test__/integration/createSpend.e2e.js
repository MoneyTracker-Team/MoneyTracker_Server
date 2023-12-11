import TypeSpend from '../../src/model/typeSpend.model.js';
import Spend from '../../src/model/spend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/spend/create', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const TYPE_SPEND_EXISTS = {
    _id: '64abaaedcd1b10b9e92c581b',
    name: 'Xe bus',
    userId: USER_EXISTS._id,
    isDaily: true,
    isDefault: false,
  };
  const DATA_TC_1 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    typeId: '64abaaedcd1b10b9e92c581b',
    moneySpend: 30000,
    dateTime: '2023-07-13T04:36:44.947Z',
    location: '',
    image: '',
    tempFriends: ['Tin', 'Khôi'],
    note: 'Lười đi bộ',
  };
  const DATA_TC_2 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    typeId: '',
    moneySpend: 30000,
    dateTime: '2023-07-13T04:36:44.947Z',
    location: '',
    image: '',
    tempFriends: ['Tin', 'Khôi'],
    note: 'Lười đi bộ',
  };
  const DATA_TC_3 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    typeId: '64abaaedcd1b10b9e92c581b',
    // moneySpend: 30000,
    dateTime: '2023-07-13T04:36:44.947Z',
    location: '',
    image: '',
    tempFriends: ['Tin', 'Khôi'],
    note: 'Lười đi bộ',
  };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
    await TypeSpend.create(TYPE_SPEND_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
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

  //! TEST CASE: <CREATE_SPEND_TC_1>
  it('<CREATE_SPEND_TC_1> Successful creation of a Spend', async () => {
    const response = await request(app).post(`/api/spends/create`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(201);
    //* Expected record effected
    expect(response.body.data.newSpend._id).not.toBeNull();
    expect(response.body.data.newSpend.userId).toBe(USER_EXISTS._id);
    expect(response.body.data.newSpend.typeId).toBe(TYPE_SPEND_EXISTS._id);
  });

  //! TEST CASE: <CREATE_SPEND_TC_2>
  it('<CREATE_SPEND_TC_2> Creating a spend with missing required information - missing type spend', async () => {
    const response = await request(app).post(`/api/spends/create`).send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <CREATE_SPEND_TC_3>
  it('<CREATE_SPEND_TC_3> Creating a spend with missing required information - missing Money amount ', async () => {
    const response = await request(app).post(`/api/spends/create`).send(DATA_TC_3);
    //* Expected result:
    expect(response.status).toBe(400);
  });
});
