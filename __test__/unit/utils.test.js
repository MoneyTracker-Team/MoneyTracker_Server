import getFileNameFromUrl from '../../src/helpers/getFileName.js';

test('test Fn get file name from url', () => {
  const url = 'https://res.cloudinary.com/dwskvqnkc/image/upload/v1689603619/avatar.jpg';

  expect(getFileNameFromUrl(url)).toBe('avatar');
});
