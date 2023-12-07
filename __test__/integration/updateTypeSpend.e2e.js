import TypeSpend from '../../src/model/typeSpend.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/type-spends/create', () => {
  //todo: CONST DATA TO TEST:
  const DATA_EXISTS = { _id: '656f2645a61aa0c2700a9148', name: 'Ăn sáng' };
  const DATA_TC_1 = { name: 'Ăn tối', image: '' };
  const DATA_TC_2 = {
    name: 'Ăn tối',
    image:
      'https://images.immediate.co.uk/production/volatile/sites/30/2017/08/crispy-sesame-lemon-chicken-8830c24.jpg?quality=90&resize=556,505',
  };
  const DATA_TC_4 = {
    name: '',
    image:
      'https://images.immediate.co.uk/production/volatile/sites/30/2017/08/crispy-sesame-lemon-chicken-8830c24.jpg?quality=90&resize=556,505',
  };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await TypeSpend.create(DATA_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await TypeSpend.deleteOne({ _id: DATA_EXISTS._id });
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

  //! TEST CASE: <UD_TYPE_SPEND_TC_1>
  it('<UD_TYPE_SPEND_TC_1> Updating the "name" field of a Type spend - Daily', async () => {
    const response = await request(app).put(`/api/type-spends/update/${DATA_EXISTS._id}`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      updated: 1,
    });
  });

  //! TEST CASE: <UD_TYPE_SPEND_TC_2>
  it('<UD_TYPE_SPEND_TC_2> Updating the "image" field of a Type spend - Daily', async () => {
    const response = await request(app).put(`/api/type-spends/update/${DATA_EXISTS._id}`).send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      updated: 1,
    });
  });

  //! TEST CASE: <UD_TYPE_SPEND_TC_4>
  it('<UD_TYPE_SPEND_TC_4> Updating the "name" field of a Type spend with an empty value  - Daily', async () => {
    const response = await request(app).put(`/api/type-spends/update/${DATA_EXISTS._id}`).send(DATA_TC_4);
    //* Expected result:
    expect(response.status).toBe(400);
  });
});
