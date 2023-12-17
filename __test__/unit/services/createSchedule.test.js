import Schedule from '../../../src/model/spendSchedule.model.js';
import User from '../../../src/model//user.model.js';
import DbTest from '../../common/DbTest.js';
import ScheduleService from '../../../src/services/schedule.services.js';

describe('[FUNCTION] create Schedule', () => {
  //todo: CONST DATA TO TEST:
  const USER_EXISTS = { _id: '6571e073eb71f63b4b4ae6f6', password: '123456', name: 'Teen' };
  const BAD_REQUEST_ERROR = 'BadRequestError';
  const NOT_FOUND_ERROR = 'NotFoundError';

  const DATA_TC_1 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    month: 8,
    year: 2022,
    scheduleMoney: 5000000,
  };

  const DATA_TC_2 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    year: 2023,
    scheduleMoney: 5000000,
  };

  const DATA_TC_3 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    month: 8,
    scheduleMoney: 5000000,
  };

  const DATA_TC_4 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    month: 8,
    year: 2023,
  };

  const EXPECTED_TC_1 = {
    userId: '6571e073eb71f63b4b4ae6f6',
    month: 8,
    year: 2022,
    scheduleMoney: 5000000,
  };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await User.create(USER_EXISTS);
    // await Schedule.create(SCHEDULE_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await Schedule.deleteMany({ userId: USER_EXISTS._id });
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
  it('<UTCID01> create new schedule success', async () => {
    const result = await ScheduleService.createNewSchedule({
      userId: DATA_TC_1.userId,
      month: DATA_TC_1.month,
      year: DATA_TC_1.year,
      scheduleMoney: DATA_TC_1.scheduleMoney,
    });

    //* Expected result:
    expect(result.userId.toString()).toBe(EXPECTED_TC_1.userId);
    expect(result.month).toBe(EXPECTED_TC_1.month);
    expect(result.year).toBe(EXPECTED_TC_1.year);
    expect(result.scheduleMoney).toBe(EXPECTED_TC_1.scheduleMoney);
  });

  //! TEST CASE 2: <UTCID02>
  it('<UTCID02> Not include month', async () => {
    let exception = null;
    try {
      await ScheduleService.createNewSchedule({
        userId: DATA_TC_2.userId,
        month: DATA_TC_2.month,
        year: DATA_TC_2.year,
        scheduleMoney: DATA_TC_2.scheduleMoney,
      });
    } catch (err) {
      exception = err;
    }
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('"month" is required');
  });

  //! TEST CASE 3: <UTCID03>
  it('<UTCID03> Not include year', async () => {
    let exception = null;
    try {
      await ScheduleService.createNewSchedule({
        userId: DATA_TC_3.userId,
        month: DATA_TC_3.month,
        year: DATA_TC_3.year,
        scheduleMoney: DATA_TC_3.scheduleMoney,
      });
    } catch (err) {
      exception = err;
    }
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('"year" is required');
  });

  //! TEST CASE 4: <UTCID04>
  it('<UTCID04> Not include moneySpend', async () => {
    let exception = null;
    try {
      await ScheduleService.createNewSchedule({
        userId: DATA_TC_4.userId,
        month: DATA_TC_4.month,
        year: DATA_TC_4.year,
        scheduleMoney: DATA_TC_4.scheduleMoney,
      });
    } catch (err) {
      exception = err;
    }
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('"scheduleMoney" is required');
  });
});
