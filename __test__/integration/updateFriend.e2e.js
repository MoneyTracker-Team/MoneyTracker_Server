import Friend from '../../src/model/friend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[PUT] /api/friends/update/:id', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const FRIEND_EXISTS = {
    _id: '656eccf28398405418421c28',
    userId: '6571e073eb71f63b4b4ae6f6',
    name: 'PhucHV',
  };

  const DATA_TC_1 = {
    name: 'Bá Huy',
    isTemporaty: false,
  };

  const DATA_TC_2 = {
    name: 'Trần + Tường @ 13',
    isTemporaty: false,
  };

  const DATA_TC_3 = {
    image: 'invalid_image_url',
    isTemporaty: false,
  };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
    await Friend.create(FRIEND_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await Friend.deleteMany({ userId: USER_EXISTS._id });
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

  //! TEST CASE 1: <UPDATEFRIEND_TC_1>
  it('<UPDATEFRIEND_TC_1> Successful update of friend', async () => {
    const response = await request(app).put(`/api/friends/update/${FRIEND_EXISTS._id}`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('updated friend success');
    expect(response.body.data.updated).toBe(1);
  });

  //! TEST CASE 2: <UPDATEFRIEND_TC_2>
  it('<UPDATEFRIEND_TC_2> Update friend with invalid name', async () => {
    const response = await request(app).put(`/api/friends/update/${FRIEND_EXISTS._id}`).send(DATA_TC_2);
    //* Expected result:
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad request, invalid name');
  });

  //! TEST CASE 2: <UPDATEFRIEND_TC_3>
  it('<UPDATEFRIEND_TC_3> Update friend with invalid image URL ', async () => {
    const response = await request(app).put(`/api/friends/update/${FRIEND_EXISTS._id}`).send(DATA_TC_3);
    //* Expected result:
    expect(response.status).toBe(500);
  });
});
