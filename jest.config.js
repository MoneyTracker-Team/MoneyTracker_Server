export default {
  // path to test folder
  testMatch: ['**/__test__/**'],

  // jest ignore
  testPathIgnorePatterns: ['/node_modules/'],

  testEnvironment: 'node',

  // code coverage
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',

  // root folder
  rootDir: '.',

  // auto clear cache
  clearMocks: true,

  // time out
  testTimeout: 5000,
};
