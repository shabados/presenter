module.exports = {
  extends: [ '@shabados/eslint-config', '@shabados/eslint-config/typescript' ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
}
