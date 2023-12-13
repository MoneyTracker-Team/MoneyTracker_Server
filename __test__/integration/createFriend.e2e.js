import Friend from '../../src/model/friend.model.js';
import User from '../../src/model/user.model.js';
import DbTest from '../common/DbTest.js';
import request from 'supertest';
import app from '../../serverTesting.js';

describe('[POST] /api/friends/create/:userId', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const DATA_TC_1 = {
    name: 'Bá Huy',
    friendId: '64a92c14735163d6f554b28d',
    isTemporaty: false,
    image:
      'http://res.cloudinary.com/dwskvqnkc/image/upload/v1688978142/money_tracker_image_store/e2v9jmpyzu7hjiaehbrc.jpg',
  };

  const DATA_TC_3 = {
    name: 'Quỳnh Như',
    friendId: 'invalid_friend_id',
    isTemporaty: false,
    image:
      'http://res.cloudinary.com/dwskvqnkc/image/upload/v1688978142/money_tracker_image_store/e2v9jmpyzu7hjiaehbrc.jpg',
  };

  const DATA_TC_5 = {
    name: 'Long Nguyễn',
    friendId: '64a92c14735163d6f554b28d',
    isTemporaty: 'invalid',
    image:
      'http://res.cloudinary.com/dwskvqnkc/image/upload/v1688978142/money_tracker_image_store/e2v9jmpyzu7hjiaehbrc.jpg',
  };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
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

  //! TEST CASE 1: <CREATEFRIEND_TC_1>
  it('<CREATEFRIEND_TC_1> Successful creation of a new friend', async () => {
    const response = await request(app).post(`/api/friends/create/${USER_EXISTS._id}`).send(DATA_TC_1);
    //* Expected result:
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('create new friend success');
    expect(response.body.data.newFriend).not.toBeNull();
  });

  //! TEST CASE 2: <CREATEFRIEND_TC_2>
  it('<CREATEFRIEND_TC_2> Creating a new friend with empty data', async () => {
    const response = await request(app).post(`/api/friends/create/${USER_EXISTS._id}`).send({});
    //* Expected result:
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Bad request with empty input data');
  });

  //! TEST CASE 3: <CREATEFRIEND_TC_3>
  it('<CREATEFRIEND_TC_3> Creating a new friend with an invalid friend ID', async () => {
    const response = await request(app).post(`/api/friends/create/${USER_EXISTS._id}`).send(DATA_TC_3);
    //* Expected result:
    expect(response.status).toBe(400);
  });

  //! TEST CASE 5: <CREATEFRIEND_TC_5>
  it('<CREATEFRIEND_TC_5> Creating a new friend with incorrect temporary status', async () => {
    const response = await request(app).post(`/api/friends/create/${USER_EXISTS._id}`).send(DATA_TC_5);
    //* Expected result:
    expect(response.status).toBe(400);
  });
});
