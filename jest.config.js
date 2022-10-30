/// jest.d.ts

module.exports = {
  projects: [ '<rootDir>/apps/*', '<rootDir>/packages/*' ],
  transform: {
    '^.+\\.(t|j)sx?$': [ '@swc/jest' ],
  },
  clearMocks: true,
  resetModules: true,
  resetMocks: true,
}
