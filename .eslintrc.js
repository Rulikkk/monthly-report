module.exports = {
  parser: "babel-eslint",
  plugins: ["prettier", "unused-imports"],
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
    "react/prop-types": "off",
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/display-name": "off",
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
  },
};
