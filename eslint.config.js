import eslint from '@eslint/js';
import { importX } from 'eslint-plugin-import-x';
import { configs } from 'eslint-plugin-jsdoc';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginSecurity from 'eslint-plugin-security';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  configs['flat/recommended-error'],
  pluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: ['dist/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        ...globals.browser,
      },
    },
    plugins: { importX },
    rules: {
      // Security
      'security/detect-non-literal-fs-filename': 'off',
      // Prettier
      'prettier/prettier': 'error',
      // JSDoc
      'jsdoc/require-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      // Event listeners must use named or regular functions, not arrows
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.property.name='addEventListener'] > ArrowFunctionExpression",
          message:
            'Use a named function as the event listener callback instead of an arrow function.',
        },
      ],
    },
  },
  {
    files: ['test/**/*.js', 'src/**/*.spec.js', 'src/**/*.test.js'],
    // Ignore JSDoc rules for test files
    rules: {
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-description': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/valid-types': 'off',
    },
  },
];
