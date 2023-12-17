import User from '../../../src/model/user.model.js';
import DbTest from '../../common/DbTest.js';
import UserService from '../../../src/services/user.services.js';

describe('[FUNCTION] update User Information', () => {
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
    userId: '6571e073eb71f63b4b4ae6f6',
    name: 'Nhu Doan',
    dateOfBirth: '2002-01-07',
    gender: true,
    currentMoney: 0,
    slogan: 'Fighting!',
  };

  const DATA_TC_3 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    name: '', //! Name is empty
    dateOfBirth: '2002-01-07',
    gender: true,
    currentMoney: 0,
    slogan: 'Fighting!',
  };

  const DATA_TC_4 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    name: 'Nhu Doan',
    dateOfBirth: '17/07/2002', //! difference normal format yyyy-mm-dd
    gender: true,
    currentMoney: 0,
    slogan: 'Fighting!',
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

  afterAll(async () => {
    // disconnect DB Test
    await clearTestData();
    await DbTest.disconnect();
  });

  //! TEST CASE 1: <UTCID01>
  it('<UTCID01> update User infor success', async () => {
    const result = await UserService.updateUserInfo(USER_EXISTS._id, {
      userId: DATA_TC_1.userId,
      name: DATA_TC_1.name,
      dateOfBirth: DATA_TC_1.dateOfBirth,
      gender: DATA_TC_1.gender,
      currentMoney: DATA_TC_1.currentMoney,
      slogan: DATA_TC_1.slogan,
    });
    //* Expected result:
    expect(result).toBe(1);
  });

  //! TEST CASE 3: <UTCID03>
  it('<UTCID03> user name not allower to be empty', async () => {
    let exception = null;
    try {
      const result = await UserService.updateUserInfo(USER_EXISTS._id, {
        userId: DATA_TC_3.userId,
        name: DATA_TC_3.name,
        dateOfBirth: DATA_TC_3.dateOfBirth,
        gender: DATA_TC_3.gender,
        currentMoney: DATA_TC_3.currentMoney,
        slogan: DATA_TC_3.slogan,
      });
    } catch (err) {
      exception = err;
    }

    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('"name" is not allowed to be empty');
  });

  //! TEST CASE 4: <UTCID04>
  it('<UTCID04> User birthdate with another format', async () => {
    let exception = null;
    try {
      await UserService.updateUserInfo(USER_EXISTS._id, {
        userId: DATA_TC_4.userId,
        name: DATA_TC_4.name,
        dateOfBirth: DATA_TC_4.dateOfBirth,
        gender: DATA_TC_4.gender,
        currentMoney: DATA_TC_4.currentMoney,
        slogan: DATA_TC_4.slogan,
      });
    } catch (err) {
      exception = err;
    }
    console.log('MSG: ', exception.message);
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('Cast to date failed for value "17/07/2002" (type string) at path "dateOfBirth"');
  });
});
