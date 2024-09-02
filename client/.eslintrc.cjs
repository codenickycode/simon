/* eslint-env node */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  extends: ['../.eslintrc.cjs', 'plugin:react-hooks/recommended'],
  env: { browser: true },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@sentry/react',
            message: '@sentry/react should only be lazy imported',
          },
          {
            name: 'tone',
            message:
              'tone should only be imported from modules within the "services" directory',
          },
        ],
      },
    ],
  },
  overrides: [
    // allow tone only within "services" directory
    {
      files: ['**/services/**'],
      rules: {
        'no-restricted-imports': ['off', { paths: [{ name: 'tone' }] }],
      },
    },
  ],
};
