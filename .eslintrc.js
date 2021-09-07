module.exports = {
  parser: "babel-eslint",
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["plugin:prettier/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react/prop-types": "off",
  },
};
