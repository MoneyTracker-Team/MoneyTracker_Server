import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/auth/login', () => {
  //todo: CONST DATA TO TEST:
  const USER_VALID = { email: 'test@gmail.com', password: '12345678' };
  const LOGIN_NOT_EMAIL = { email: '', password: '12345678' };
  const LOGIN_NOT_PASSWORD = { email: '', password: '' };
  const LOGIN_NOT_NAME = { email: 'test@gmail.com', password: '12345678' };
  const PASSWORD_LESS_THAN_5 = { email: '', password: '1234' };
  const PASSWORD_NOT_MATCH = { email: 'test@gmail.com', password: '123456789' };
  const EMAIL_NOT_EXISTS = { email: 'test123@gmail.com', password: '12345678' };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_VALID);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await User.deleteOne({ email: USER_VALID.email });
  };

  beforeAll(async () => {
    // connect DB Test
    await DbTest.connect();
    await createTestData();
  });

  afterAll(async () => {
    // disconnect DB Test
    await clearTestData();
    await DbTest.disconnect();
  });

  //! TEST CASE 1:
  it('Should return status 200 for valid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send(USER_VALID);
    //* Expected result:
    expect(response.status).toBe(200);
  });

  //! TEST CASE 2:
  it('Email is required', async () => {
    const response = await request(app).post('/api/auth/login').send(LOGIN_NOT_EMAIL);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE 3:
  it('Password is required', async () => {
    const response = await request(app).post('/api/auth/login').send(LOGIN_NOT_PASSWORD);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE 4:
  it('Password is not match', async () => {
    const response = await request(app).post('/api/auth/login').send(PASSWORD_NOT_MATCH);
    //* Expected result:
    expect(response.status).toBe(401);
  });

  //! TEST CASE 5:
  it('Email is not exists', async () => {
    const response = await request(app).post('/api/auth/login').send(EMAIL_NOT_EXISTS);
    //* Expected result:
    expect(response.status).toBe(401);
  });

  //! TEST CASE 6:
  it('Password min 5 chars', async () => {
    const response = await request(app).post('/api/auth/login').send(PASSWORD_LESS_THAN_5);
    //* Expected result:
    expect(response.status).toBe(400);
  });
});
