import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ignores: [
      "dist/**",
      "build/**", 
      "node_modules/**",
      "coverage/**",
      ".cache/**",
      ".parcel-cache/**",
      "*.config.js",
      "vite.config.js"
    ],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      "react/prop-types": "off", // Отключаем проверку prop-types
      "react/react-in-jsx-scope": "off", // Не требуем импорт React в каждом файле (React 17+)
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }], // Игнорируем переменные начинающиеся с _
    },
    settings: {
      react: {
        version: "detect", // Автоматически определяем версию React
      },
    },
  },
];
