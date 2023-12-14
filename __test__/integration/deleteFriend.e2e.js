import Friend from '../../src/model/friend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[DELETE] /api/friends/delete/:id', () => {
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

  const FRIEND_ID_NOT_EXISTS = '656eccf28398405418421c26';

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

  //! TEST CASE 1: <DELETEFRIEND_TC_1>
  it('<DELETEFRIEND_TC_1> Successful delete a friend', async () => {
    const response = await request(app).delete(`/api/friends/delete/${FRIEND_EXISTS[0]._id}`);
    //* Expected result:
    expect(response.status).toBe(200);
    expect(response.body.data.deleted).not.toBeNull();
  });

  //! TEST CASE 2: <DELETEFRIEND_TC_2>
  it('<DELETEFRIEND_TC_2> Delete a friend without _id', async () => {
    const response = await request(app).delete(`/api/friends/delete`);
    //* Expected result:
    expect(response.status).toBe(404);
  });

  //! TEST CASE 3: <DELETEFRIEND_TC_3>
  it('<DELETEFRIEND_TC_3> Delete a friend with wrong _id', async () => {
    const response = await request(app).delete(`/api/friends/delete/${FRIEND_ID_NOT_EXISTS}`);
    //* Expected result:
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('The _id does not exists');
  });
});
