module.exports = {
    env: {
      commonjs: true,
      es2021: true,
      node: true,
      jest: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
      ecmaVersion: 12
    },
    rules: {
      'no-unused-vars': ['warn', { 'argsIgnorePattern': 'next' }],
      'no-console': 'off',
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always']
    }
  };