import User from '../../../src/model/user.model.js';
import DbTest from '../../common/DbTest.js';
import UserService from '../../../src/services/user.services.js';

describe('[FUNCTION] update Password', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = {
    _id: '6571e073eb71f63b4b4ae6f6',
    name: 'Nhu',
    email: 'nhu17200@gmail.com',
    password: 'nhu17',
    dateOfBirth: '2002-01-07T00:00:00.000Z',
    gender: true,
    currentMoney: 0,
    avatar:
      'https://res.cloudinary.com/dwskvqnkc/image/upload/v1688892064/money_tracker_image_store/avt_defaut_jvtz7u.jpg',
    slogan: 'Thêm slogan của bạn',
  };
  const BAD_REQUEST_ERROR = 'BadRequestError';
  const NOT_FOUND_ERROR = 'NotFoundError';

  const DATA_TC_1 = {
    oldPassword: 'Nhu17', //! Password not match
    newPassword: 'ABCDE',
  };

  const DATA_TC_2 = {
    oldPassword: 'nhu17',
    newPassword: 'ABC', //! Password less than 5 characters
  };

  const DATA_TC_3 = {
    oldPassword: 'nhu17',
    newPassword: 'ABCDE',
  };

  const DATA_TC_4 = {
    oldPassword: 'nhu17',
    newPassword: '*****',
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
    // connect DB Test
    await DbTest.connect();
    await createTestData();
  });

  beforeEach(async () => {
    //* reset password
    await User.updateOne({ _id: USER_EXISTS._id }, { password: USER_EXISTS.password });
  });

  afterAll(async () => {
    // disconnect DB Test
    await clearTestData();
    await DbTest.disconnect();
  });

  //! TEST CASE 1: <UTCID01>
  it('<UTCID01> Password not match', async () => {
    let exception = null;
    try {
      await UserService.updatePassOfUser(USER_EXISTS._id, DATA_TC_1.oldPassword, DATA_TC_1.newPassword);
    } catch (err) {
      exception = err;
    }
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('password not match');
  });

  //! TEST CASE 2: <UTCID02>
  it('<UTCID02> Password not match', async () => {
    let exception = null;
    try {
      await UserService.updatePassOfUser(USER_EXISTS._id, DATA_TC_2.oldPassword, DATA_TC_2.newPassword);
    } catch (err) {
      exception = err;
    }

    //     //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('"newPassword" length must be at least 5 characters long');
  });

  //! TEST CASE 3: <UTCID03>
  it('<UTCID03> Update password success', async () => {
    const result = await UserService.updatePassOfUser(USER_EXISTS._id, DATA_TC_3.oldPassword, DATA_TC_3.newPassword);
    //* Expected result:
    expect(result.modifiedCount).toBe(1);
  });

  //! TEST CASE 4: <UTCID04>
  it('<UTCID04> Update with password special', async () => {
    const result = await UserService.updatePassOfUser(USER_EXISTS._id, DATA_TC_4.oldPassword, DATA_TC_4.newPassword);
    //* Expected result:
    expect(result.modifiedCount).toBe(1);
  });
});
