import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/auth/register', () => {
  //todo: CONST DATA TO TEST:
  const USER_DATA = { email: 'test@gmail.com', password: '12345678' };
  const DATA_TC_1 = { email: 'test3@gmail.com', password: '12345', name: 'Teen' };
  const DATA_TC_2 = { email: 'test@gmail.com', password: '12345', name: 'Teen' };
  const DATA_TC_3 = { email: 'nhu.com', password: '123456', name: 'quynhnhu' };
  const DATA_TC_4 = { email: 'long@mail.com', password: 'eo1', name: 'DLong' };
  const DATA_TC_5 = { email: '', password: '123456', name: 'DLong' };
  const DATA_TC_6 = { email: 'tuong@gmail.com', password: '', name: 'KTuong' };
  const DATA_TC_7 = { email: 'nhu172002@gmail.com', password: 'nhu17', name: 'Nhu' };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_DATA);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await User.deleteMany({ email: { $in: [USER_DATA.email, DATA_TC_1.email, DATA_TC_7.email] } });
  };

  beforeAll(async () => {
    //* connect DB Test
    await DbTest.connect();
    await createTestData();
  });

  afterAll(async () => {
    //* disconnect DB Test
    await clearTestData();
    await User.deleteOne({ email: USER_DATA.email });
    await DbTest.disconnect();
  });

  //! TEST CASE: <SIGNUP_TC_1>
  it('<SIGNUP_TC_1> Should return status 200 for valid user', async () => {
    const response = await request(app).post('/api/auth/register').send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(200);
  });

  //! TEST CASE: <SIGNUP_TC_2>
  it('<SIGNUP_TC_2> Create new account with dupplicate email', async () => {
    const response = await request(app).post('/api/auth/register').send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(409);
  });

  //! TEST CASE: <SIGNUP_TC_3>
  it('<SIGNUP_TC_3> Account creation with an invalid email', async () => {
    const response = await request(app).post('/api/auth/register').send(DATA_TC_3);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <SIGNUP_TC_4>
  it('<SIGNUP_TC_4> Account creation with an invalid password', async () => {
    const response = await request(app).post('/api/auth/register').send(DATA_TC_4);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <SIGNUP_TC_5>
  it('<SIGNUP_TC_5> Account creation with an empty email address', async () => {
    const response = await request(app).post('/api/auth/register').send(DATA_TC_5);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <SIGNUP_TC_6>
  it('<SIGNUP_TC_6> Account creation with an empty password', async () => {
    const response = await request(app).post('/api/auth/register').send(DATA_TC_6);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE: <SIGNUP_TC_7>
  it('<SIGNUP_TC_7> Account creation with a weak password', async () => {
    const response = await request(app).post('/api/auth/register').send(DATA_TC_7);
    //* Expected result:
    expect(response.status).toBe(400);
  });
});
