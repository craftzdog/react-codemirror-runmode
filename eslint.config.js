import js from '@eslint/js'
import eslintTs from 'typescript-eslint'
import eslintReact from 'eslint-plugin-react'

export default eslintTs.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  eslintTs.configs.recommended,
  eslintReact.configs.flat.recommended,
  eslintReact.configs.flat['jsx-runtime'],
  {
    plugins: {
      '@typescript-eslint': eslintTs.plugin
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      // JavaScript and React rules
      'no-useless-escape': 0,
      'prefer-const': 2,
      'no-unused-vars': 0
    }
  },

  {
    settings: {
      react: {
        version: '19'
      }
    }
  }
)
