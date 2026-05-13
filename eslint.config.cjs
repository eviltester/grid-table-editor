const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");
const globals = require("globals");

module.exports = [
  {
    ignores: [
      "build/**",
      "coverage/**",
      "docs/**",
      "docs-src/build/**",
      "node_modules/**",
      "js/libs/**",
      "packages/core/js/libs/**",
      "apps/web/libs/**",
      "apps/web/dist/**",
      "js/gui_components/data-grid-editor/tabulator/customHeader-tabulator.js",
    ],
  },
  js.configs.recommended,
  prettier,
  {
    files: ["apps/**/*.js", "packages/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
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
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-prototype-builtins": "warn",
      "no-dupe-keys": "warn",
      "no-useless-escape": "warn",
      "no-case-declarations": "warn",
      "no-misleading-character-class": "warn",
      "no-useless-assignment": "off",
      "preserve-caught-error": "off",
    },
  },
  {
    files: [
      "tests/**/*.js",
      "apps/**/*.test.js",
      "apps/web/src/tests/jest/**/*.js",
      "packages/*/src/tests/**/*.js",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },
  },
];
