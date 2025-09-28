import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import stylistic from '@stylistic/eslint-plugin'

export default [
  // Глобальные игнорируемые файлы
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
  },

  // Базовая конфигурация для всех JS/JSX файлов
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@stylistic': stylistic,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2024,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React специфичные правила
      'react/react-in-jsx-scope': 'off', // Не нужно в React 17+
      'react/prop-types': 'off', // Отключаем проверку PropTypes

      // Основные правила качества кода
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unneeded-ternary': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-object-spread': 'error',

      // Стилистические правила
      'brace-style': ['error', 'stroustrup'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/arrow-parens': ['error', 'as-needed'], // Убирает ненужные скобки в стрелочных функциях

      // Правила для лучших практик
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
    },
  },
]
