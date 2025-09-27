import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import stylistic from '@stylistic/eslint-plugin'

export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ignores: [
      'dist/**',
      'build/**',
      'node_modules/**',
      'coverage/**',
      '.cache/**',
      '.parcel-cache/**',
    ],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      '@stylistic': stylistic,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quote-props': ['error', 'as-needed'],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
