const base = require('../../jest.config')

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/apps/frontend/setupTests.ts',
    // '<rootDir>/setupTests.ts',
  ],
}
