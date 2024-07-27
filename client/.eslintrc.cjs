module.exports = {
  extends: ["../.eslintrc.cjs", "plugin:react-hooks/recommended"],
  env: { browser: true },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
  },
};
