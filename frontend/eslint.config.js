import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'
import pluginImport from 'eslint-plugin-import'
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
      'vite.config.js',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.jest,
        test: true,
        expect: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: pluginReact,
      import: pluginImport,
      '@stylistic': stylistic,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      'import/extensions': 'off',
      'no-console': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-closing-bracket-location': 'error',
      'react/destructuring-assignment': 'error',
      'react/jsx-wrap-multilines': 'error',
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
      '@stylistic/no-multiple-empty-lines': ['error', { max: 0, maxBOF: 0, maxEOF: 0 }],
      '@stylistic/quote-props': ['error', 'as-needed'],
    },
    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        fragment: 'Fragment',
        version: 'detect',
        flowVersion: '0.53',
      },
      propWrapperFunctions: [
        'forbidExtraProps',
        { property: 'freeze', object: 'Object' },
        { property: 'myFavoriteWrapper' },
        { property: 'forbidExtraProps', exact: true },
      ],
      componentWrapperFunctions: [
        'observer',
        { property: 'styled' },
        { property: 'observer', object: 'Mobx' },
        { property: 'observer', object: 'React' },
      ],
      formComponents: [
        'CustomForm',
        { name: 'Form', formAttribute: 'endpoint' },
      ],
      linkComponents: [
        'Hyperlink',
        { name: 'Link', linkAttribute: 'to' },
      ],
    },
  },
]
