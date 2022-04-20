/** @type {import('@types/eslint').Linter.BaseConfig} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 2022,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-explicit-any': 'off',
    'no-mixed-operators': 'off',
    'no-multiple-empty-lines': 'off',
    'no-unexpected-multiline': 'off',
    '@typescript-eslint/ban-types': 'warn',
    'no-whitespace-before-property': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  
    'sort-imports': [
      'off',
      {
        ignoreDeclarationSort: true,
      },
    ],
    'no-duplicate-imports': 'off',
  },
  env: {
    es6: true,
    node: true,
  },
}
