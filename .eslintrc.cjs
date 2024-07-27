/* eslint-env node */
module.exports = {
  root: true,
  env: { es2022: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "default-case": "error",
    "@typescript-eslint/consistent-type-exports": "warn",
    "@typescript-eslint/consistent-type-imports": "warn",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-unused-expressions": "off",
  },
  settings: {
    "max-warnings": 0,
  },
  ignorePatterns: ["dist"],
};
