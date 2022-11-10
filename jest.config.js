/// jest.d.ts

module.exports = {
  projects: [ '<rootDir>/apps/*', '<rootDir>/packages/*' ],
  transform: {
    '^.+\\.(t|j)sx?$': [ '@swc/jest' ],
  },
  resetMocks: true,
}
