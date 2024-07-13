module.exports = {
  root: true,
  env: { es2020: true },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: ["dist", ".eslintrc.js"],
  parser: "@typescript-eslint/parser",
  rules: {
    "default-case": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      { allowShortCircuit: true },
    ],
  },
  settings: {
    "max-warnings": 0,
  },
};
