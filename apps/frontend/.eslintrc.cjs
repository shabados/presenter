module.exports = {
  extends: [ '@shabados/eslint-config', '@shabados/eslint-config/typescript' ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ['apps/frontend/setupTests.ts'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
  ],
}
