// @ts-check
/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...require("./index.js").map((config) => ({
    files: ["**/*.{ts,tsx}"],
    ...config,
  })),
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-type-assertion": "error",
    },
  },
];
