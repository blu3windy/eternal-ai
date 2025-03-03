module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "dist-electron/", "public/scripts/"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    // "no-unused-vars": [
    //   "warn",
    //   {
    //     vars: "all", // Warn about all unused variables
    //     args: "after-used", // Ignore unused function arguments if they are used after
    //     ignoreRestSiblings: true, // Ignore unused variables from object destructuring
    //     varsIgnorePattern: "^_" // Ignore variables that start with _
    //   }
    // ],
    // "max-len": ["error", { "code": 120, "ignoreComments": true }],
    "object-curly-spacing": ["error", "always"],
    "object-curly-newline": ["error", { "multiline": true, "consistent": true }],
    "operator-linebreak": ["error", "before"], // Place `?` and `:` on the next line
    "indent": ["error", 3], // Ensure proper indentation
    "@typescript-eslint/no-explicit-any": "off", // Allow `any` type
    "@typescript-eslint/no-unused-vars": "off", // Disable the rule that conflicts with the one above
    "no-empty": "off", // Allow empty blocks
    "no-useless-catch": "off", // Allow empty catch blocks
    "no-console": "off"
  },
};
