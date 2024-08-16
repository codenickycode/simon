module.exports = {
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
