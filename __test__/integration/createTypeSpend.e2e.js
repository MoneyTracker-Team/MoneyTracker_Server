import TypeSpend from '../../src/model/typeSpend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/type-spends/create', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const TYPE_SPEND_EXISTS = { name: 'Học phí', userId: USER_EXISTS._id, isDaily: true, isDefault: false };
  const DATA_TC_1 = { name: 'Ăn sáng', userId: USER_EXISTS._id, isDaily: true, isDefault: false };
  const DATA_TC_2 = { name: '', userId: USER_EXISTS._id, isDaily: true, isDefault: false };
  const DATA_TC_3 = { name: 'Học phí', userId: USER_EXISTS._id, isDaily: true, isDefault: false };

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

  //! TEST CASE: <TYPE_SPEND_TC_1>
  it('<TYPE_SPEND_TC_1> Successful creation of a Type Spend - Daily', async () => {
    const response = await request(app).post(`/api/type-spends/create`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(201);
    //* Expected new data type spend created
    expect(response.body.data.newTypeSpend._id).not.toBeNull();
    expect(response.body.data.newTypeSpend.userId).toBe(USER_EXISTS._id);
    expect(response.body.data.newTypeSpend.name).toBe(DATA_TC_1.name);
    expect(response.body.data.newTypeSpend.isDaily).toBe(DATA_TC_1.isDaily);
    expect(response.body.data.newTypeSpend.isDefault).toBe(DATA_TC_1.isDefault);
  });

  //! TEST CASE: <TYPE_SPEND_TC_2>
  it('<TYPE_SPEND_TC_2> Creating a Type Spend with an empty "name" field - Daily', async () => {
    const response = await request(app).post(`/api/type-spends/create`).send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <TYPE_SPEND_TC_3>
  it('<TYPE_SPEND_TC_3> Creating a duplicate Type Spend category in the system - Daily', async () => {
    const response = await request(app).post(`/api/type-spends/create`).send(DATA_TC_3);
    //* Expected result:
    expect(response.status).toBe(409);
    expect(response.data.message).toBe('This is type spend already exists');
  });
});
