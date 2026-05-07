module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    RandExp: "readonly",
    Tabulator: "readonly",
    agGrid: "readonly",
    faker: "readonly",
    Papa: "readonly",
    headerAddLeftButton: "writable",
    onAddLeftButtonListener: "writable",
    onAddLeftButtonClick: "readonly",
    dom: "readonly",
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-prototype-builtins": "warn",
    "no-dupe-keys": "warn",
    "no-useless-escape": "warn",
    "no-case-declarations": "warn",
    "no-misleading-character-class": "warn",
  },
  overrides: [
    {
      files: ["tests/**/*.js", "apps/web/src/tests/jest/**/*.js"],
      env: {
        jest: true,
        node: true,
      },
    },
  ],
};
