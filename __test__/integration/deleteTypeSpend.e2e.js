import TypeSpend from '../../src/model/typeSpend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/type-spends/delete/:id', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const TYPE_SPEND_EXISTS = { _id: '6571d7ef8f8f2aa85e70ec92', name: 'Ăn sáng', userId: USER_EXISTS._id };
  const TYPE_SPEND_EXISTS_TC_2 = {
    _id: '6571d7ef8f8f2aa85e70ec91',
    name: 'Ăn sáng',
    userId: '65711f0ae3badbbe29893987',
  }; //! test with userId: 65711f0ae3badbbe29893987 does not exists in database

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
    await TypeSpend.create([TYPE_SPEND_EXISTS, TYPE_SPEND_EXISTS_TC_2]);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await TypeSpend.deleteMany({ userId: TYPE_SPEND_EXISTS.userId });
    await TypeSpend.deleteMany({ _id: TYPE_SPEND_EXISTS_TC_2._id });
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

  //! TEST CASE: <DEL_TYPE_SPEND_TC_1>
  it('<DEL_TYPE_SPEND_TC_1> Successful delete type spends of user', async () => {
    const response = await request(app).delete(`/api/type-spends/delete/${TYPE_SPEND_EXISTS._id}`);
    //* Expected result:
    expect(response.status).toBe(200);
    //* Expected record effected
    expect(response.body.data.typeSpendDeleted._id).toBe(TYPE_SPEND_EXISTS._id);
  });

  //! TEST CASE: <DEL_TYPE_SPEND_TC_2>
  it('<DEL_TYPE_SPEND_TC_2> Delete type spend  with invalid userId ', async () => {
    const response = await request(app).delete(`/api/type-spends/delete/${TYPE_SPEND_EXISTS_TC_2._id}`);
    //* Expected result:
    expect(response.status).toBe(404);
  });
});
