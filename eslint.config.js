const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],

    languageOptions: {
      sourceType: "commonjs", // Set the source type to CommonJS for Node.js environments
      ecmaVersion: 12, // Support ES2021 syntax
      globals: {
        ...globals.node, // Node.js global variables
      },
    },
  },
  {
    rules: {
      "no-console": "warn", // Warn on console statements
      semi: ["error", "always"], // Enforce semicolons at the end of statements
      "no-unused-vars": ["warn", { args: "none" }], // Warn about unused variables, but not unused function arguments
      eqeqeq: "error", // Enforce strict equality (=== and !==)
      "no-trailing-spaces": "error", // Disallow trailing whitespace at the end of lines
      // Add more custom rules as needed
    },
  },
];
