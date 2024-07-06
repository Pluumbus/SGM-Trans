// eslint.config.js

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "eslint.config.js",
      ".next/**",
      "**/ts",
      "**/tsx",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      react: require("eslint-plugin-react"),
      prettier: require("eslint-plugin-prettier"),
      import: require("eslint-plugin-import"),
    },
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-typos": "off",
      "@next/next/no-assign-module-variable": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "react/prop-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-console": "warn", // Включить предупреждение для console.log и других консольных методов
      "no-debugger": "error", // Запретить использование debugger
      "react/jsx-key": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-var": "error", // Запретить использование var
      "import/no-unresolved": "off",
      "import/no-extraneous-dependencies": "off",
      "import/no-named-as-default": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
