import TypeSpend from '../../src/model/typeSpend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/type-spends/create', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const TYPE_SPEND_EXISTS = [
    { name: 'Ăn sáng', userId: USER_EXISTS._id },
    { name: 'Ăn trưa', userId: USER_EXISTS._id },
    { name: 'Ăn tối', userId: USER_EXISTS._id },
  ];
  const DATA_TC_2 = { _id: '1111111111111111111' };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
    await TypeSpend.create(TYPE_SPEND_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await User.deleteOne({ _id: USER_EXISTS._id });
    await TypeSpend.deleteMany({ userId: USER_EXISTS._id });
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

  //! TEST CASE: <GET_TYPE_SPEND_TC_1>
  it('<GET_TYPE_SPEND_TC_1> Successful get all type spends of user', async () => {
    const response = await request(app).get(`/api/type-spends/all-of-user/${USER_EXISTS._id}`);
    //* Expected result:
    expect(response.status).toBe(200);
    //* Expected length data of list type_spend result
    expect(response.body.data.typeSpends).toHaveLength(3);
  });

  //! TEST CASE: <GET_TYPE_SPEND_TC_2>
  it('<GET_TYPE_SPEND_TC_2> Get all type spend  with invalid userId ', async () => {
    const response = await request(app).get(`/api/type-spends/all-of-user/${DATA_TC_2._id}`);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <GET_TYPE_SPEND_TC_3>
  it('<GET_TYPE_SPEND_TC_3> Get all type spend of user without userId  ', async () => {
    const response = await request(app).get(`/api/type-spends/all-of-user`);
    //* Expected result:
    expect(response.status).toBe(404);
  });
});
