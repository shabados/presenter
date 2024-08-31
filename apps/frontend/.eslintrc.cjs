module.exports = {
  extends: [ '@shabados/eslint-config', '@shabados/eslint-config/typescript' ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  overrides: [ {
    // Targeting route files
    files: [ '**/*/app/**/*.ts?(x)' ],
    rules: {
      // Referencing the exported route leads to a use before define in components, but it's fine
      '@typescript-eslint/no-use-before-define': 'off',
    },
  } ],
}
