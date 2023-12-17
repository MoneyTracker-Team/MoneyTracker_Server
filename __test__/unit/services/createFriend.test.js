import Friend from '../../../src/model/friend.model.js';
import User from '../../../src/model//user.model.js';
import DbTest from '../../common/DbTest.js';
import FriendService from '../../../src/services/friend.services.js';

describe('[FUNCTION] create Friend', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };

  const DATA_TC_1 = {
    friendId: '64a92c14735163d6f554b28d',
    name: 'Bá Huy',
    isTemporaty: false,
    image: '',
  };

  const DATA_TC_3 = {
    friendId: 'invalid_friend_id',
    name: 'Bá Huy',
    isTemporaty: false,
    image: '',
  };

  const DATA_TC_4 = {
    friendId: 'invalid_friend_id',
    name: 'Bá Huy',
    isTemporaty: false,
    image: 'invalid_image',
  };

  const EXPECTED_TC_1 = {
    userId: USER_EXISTS._id,
    friendId: DATA_TC_1.friendId,
    name: DATA_TC_1.name,
    isTemporaty: DATA_TC_1.isTemporaty,
    image: DATA_TC_1.image,
  };

  const EXPECTED_TC_2 = 'friend not found';
  const BAD_REQUEST_ERROR = 'BadRequestError';
  const NOT_FOUND_ERROR = 'NotFoundError';

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await Friend.deleteMany({ userId: USER_EXISTS._id });
    await User.deleteOne({ _id: USER_EXISTS._id });
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

  //! TEST CASE 1: <UTCID01>
  it('<UTCID01> Create friend success', async () => {
    const result = await FriendService.createNewFriend({
      userId: USER_EXISTS._id,
      friendId: DATA_TC_1.friendId,
      name: DATA_TC_1.name,
      isTemporaty: DATA_TC_1.isTemporaty,
      image: DATA_TC_1.image,
    });

    //* Expected result:
    expect(result.userId.toString()).toBe(EXPECTED_TC_1.userId);
    expect(result.friendId.toString()).toBe(EXPECTED_TC_1.friendId);
    expect(result.name).toBe(EXPECTED_TC_1.name);
    expect(result.isTemporaty).toBe(EXPECTED_TC_1.isTemporaty);
    expect(result.image).toBe(EXPECTED_TC_1.image);
  });

  //! TEST CASE 2: <UTCID02>
  it('<UTCID02> Not exists FriendId', async () => {
    let exception = null;
    try {
      await FriendService.createNewFriend({
        userId: USER_EXISTS._id,
        friendId: DATA_TC_1.friendId,
        name: DATA_TC_1.name,
        isTemporaty: DATA_TC_1.isTemporaty,
        image: DATA_TC_1.image,
      });
    } catch (err) {
      exception = err;
    }
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(NOT_FOUND_ERROR);
    expect(exception.message).toBe(EXPECTED_TC_2);
  });

  //! TEST CASE 3: <UTCID03>
  it('<UTCID03> Invalid FriendId', async () => {
    let exception = null;
    try {
      await FriendService.createNewFriend({
        userId: USER_EXISTS._id,
        friendId: DATA_TC_3.friendId,
        name: DATA_TC_3.name,
        isTemporaty: DATA_TC_3.isTemporaty,
        image: DATA_TC_3.image,
      });
    } catch (err) {
      exception = err;
    }
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
  });

  //! TEST CASE 4: <UTCID04>
  it('<UTCID04> Invalid Image', async () => {
    let exception = null;
    try {
      await FriendService.createNewFriend({
        userId: USER_EXISTS._id,
        friendId: DATA_TC_4.friendId,
        name: DATA_TC_4.name,
        isTemporaty: DATA_TC_4.isTemporaty,
        image: DATA_TC_4.image,
      });
    } catch (err) {
      exception = err;
    }
    //* Expected result:s
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
  });
});
