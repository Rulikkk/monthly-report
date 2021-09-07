module.exports = {
  parser: "babel-eslint",
  plugins: ["@typescript-eslint", "prettier", "unused-imports"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
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
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
  },
};
