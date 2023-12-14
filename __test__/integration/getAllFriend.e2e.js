import Friend from '../../src/model/friend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[GET] /api/friends/all-of-user/:userId', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const FRIEND_EXISTS = [
    {
      _id: '656eccf28398405418421c28',
      userId: '6571e073eb71f63b4b4ae6f6',
      name: 'PhucHV',
      isTemporaty: false,
    },
    {
      _id: '656eccf28398405418421c27',
      userId: '6571e073eb71f63b4b4ae6f6',
      name: 'LongND',
      isTemporaty: false,
    },
    {
      _id: '656eccf28398405418421c26',
      userId: '6571e073eb71f63b4b4ae6f6',
      name: 'TuongTK',
      isTemporaty: false,
    },
  ];
  const USER_ID_INVALID = '6476fc3968a**24efaac%f90fa13?=';

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

  //! TEST CASE 1: <GETFRIEND_TC_1>
  it('<GETFRIEND_TC_1> Successful get all friends of user', async () => {
    const response = await request(app).get(`/api/friends/all-of-user/${USER_EXISTS._id}`);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.data.friends).toHaveLength(3);
  });

  //! TEST CASE 2: <GETFRIEND_TC_2>
  it('<GETFRIEND_TC_2> Get all friends of user with invalid userId', async () => {
    const response = await request(app).get(`/api/friends/all-of-user/${USER_ID_INVALID}`);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE 3: <GETFRIEND_TC_3>
  it('<GETFRIEND_TC_3> Get all friends of user without userId', async () => {
    const response = await request(app).get(`/api/friends/all-of-user`);
    //* Expected result:
    expect(response.status).toBe(404);
  });
});
