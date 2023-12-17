import TypeSpend from '../../../src/model/typeSpend.model.js';
import DbTest from '../../common/DbTest.js';
import TypeSpendService from '../../../src/services/typeSpend.services.js';

describe('[FUNCTION] create Schedule', () => {
  //todo: CONST DATA TO TEST:
  const DATA_EXISTS = { _id: '656f2645a61aa0c2700a9148', name: 'Ăn sáng' };
  const BAD_REQUEST_ERROR = 'BadRequestError';
  const NOT_FOUND_ERROR = 'NotFoundError';

  const DATA_TC_1 = {
    name: 'ăn tối',
    image: '',
  };

  const DATA_TC_4 = {
    name: '',
    image: '',
  };

  const EXPECTED_TC_1 = {
    name: 'ăn tối',
    image: '',
  };

  //todo: Method create data test:
  const createTestData = async () => {
    //* insert data test:
    await TypeSpend.create(DATA_EXISTS);
  };
  //todo: Method clear data test:
  const clearTestData = async () => {
    //* clear data test:
    await TypeSpend.deleteOne({ _id: DATA_EXISTS._id });
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
  it('<UTCID01> update TypeSpend success', async () => {
    const result = await TypeSpendService.updateTypeSpend(DATA_EXISTS._id, {
      name: DATA_TC_1.name,
      image: DATA_TC_1.image,
    });
    //* Expected result:
    expect(result).toBe(1);
  });

  //! TEST CASE 4: <UTCID04>
  it('<UTCID04> update TypeSpend success', async () => {
    let exception = null;
    try {
      await TypeSpendService.updateTypeSpend(DATA_EXISTS._id, {
        name: DATA_TC_4.name,
        image: DATA_TC_4.image,
      });
    } catch (err) {
      exception = err;
    }
    //* Expected result:
    expect(exception).not.toBeNull();
    expect(exception.name).toBe(BAD_REQUEST_ERROR);
    expect(exception.message).toBe('"name" is not allowed to be empty');
  });
});
