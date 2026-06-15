import reactConfig from "./tooling/eslint-config/react.js";
import typescriptConfig from "./tooling/eslint-config/typescript.js";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "eslint.config.js",
    ],
  },
  ...typescriptConfig,
  ...reactConfig,
];
