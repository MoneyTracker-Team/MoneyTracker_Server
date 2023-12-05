export default {
  // path to test folder
  testMatch: ['**/__test__/**/*.+(e2e|test).js'],

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
  testTimeout: 15000,
};
