const base = require( '../../jest.config' )

module.exports = {
  ...base,
  setupFilesAfterEnv: [ '<rootDir>/test/setup.ts' ],
}
