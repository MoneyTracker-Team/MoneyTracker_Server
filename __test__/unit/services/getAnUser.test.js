import User from '../../../src/model/user.model.js';
import DbTest from '../../common/DbTest.js';
import UserService from '../../../src/services/user.services.js';

describe('[FUNCTION] update User Information', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = {
    _id: '6571e073eb71f63b4b4ae6f6',
    name: 'Phuc',
    email: 'phuc@gmail.com',
    password: '12345',
    gender: true,
    currentMoney: 0,
    avatar:
      'https://res.cloudinary.com/dwskvqnkc/image/upload/v1688892064/money_tracker_image_store/avt_defaut_jvtz7u.jpg',
    slogan: 'Thêm slogan của bạn',
  };
  const USER_ID_NOT_EXIST = '6571e073eb71f63b4b4ae7f8';

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
  it('<UTCID01> Get user existed', async () => {
    const result = await UserService.getUserById(USER_EXISTS._id);
    //* Expected result:
    expect(result._id.toString()).toBe(USER_EXISTS._id);
    expect(result.name).toBe(USER_EXISTS.name);
    expect(result.email).toBe(USER_EXISTS.email);
    expect(result.password).toBe(USER_EXISTS.password);
    expect(result.gender).toBe(USER_EXISTS.gender);
    expect(result.currentMoney).toBe(USER_EXISTS.currentMoney);
    expect(result.avatar).toBe(USER_EXISTS.avatar);
    expect(result.slogan).toBe(USER_EXISTS.slogan);
  });

  //! TEST CASE 2: <UTCID02>
  it('<UTCID02> Get user not exists', async () => {
    const result = await UserService.getUserById(USER_ID_NOT_EXIST);
    //* Expected result:
    expect(result).toBeNull();
  });
});
