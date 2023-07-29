module.exports = {
  transform: {
    '^.+\\.(t|j)sx?$': [ '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  setupFilesAfterEnv: [
    '<rootDir>/tests/setupTests.ts',
  ],
}
