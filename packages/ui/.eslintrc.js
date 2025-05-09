/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@hyper-gate/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
};
