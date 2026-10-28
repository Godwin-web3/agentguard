import tseslint from "typescript-eslint";
// Async-safety lint: the storage layer is async on both SQLite and Postgres, so a missed await is a correctness bug.
const rules = {
  "@typescript-eslint/no-floating-promises": "error",
  "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
  "@typescript-eslint/await-thenable": "error",
};
export default tseslint.config({
  files: ["src/**/*.ts", "test/**/*.ts", "scripts/**/*.ts", "api/**/*.ts"],
  languageOptions: { parser: tseslint.parser, parserOptions: { project: "./tsconfig.all.json", tsconfigRootDir: import.meta.dirname } },
  plugins: { "@typescript-eslint": tseslint.plugin },
  rules: {
    "@typescript-eslint/no-floating-promises": ["error", { allowForKnownSafeCalls: [{ from: "package", package: "node:test", name: ["test", "it", "describe"] }] }],
    "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
    "@typescript-eslint/await-thenable": "error",
  },
}, {
  // Browser code (landing, console, receipt viewer): same async-safety rules, typed against the DOM.
  files: ["web/src/**/*.ts"],
  languageOptions: { parser: tseslint.parser, parserOptions: { project: "./tsconfig.web.json", tsconfigRootDir: import.meta.dirname } },
  plugins: { "@typescript-eslint": tseslint.plugin },
  rules: { ...rules, "no-restricted-syntax": ["error", { selector: "CallExpression[callee.name='eval']", message: "CSP forbids eval" }] },
});
