// @ts-check
/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...require("./index.js").map((config) => ({
    files: ["**/*.{jsx,tsx}"],
    ...config,
  })),
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
