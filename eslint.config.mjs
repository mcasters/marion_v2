import {FlatCompat} from '@eslint/eslintrc';
import eslintConfigPrettier from "eslint-config-prettier";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})
const eslintConfig = [
  ...compat.config({
    extends: ['next', 'next/core-web-vitals', 'next/typescript'],
    rules: {
      '@typescript-eslint/no-unused-vars': ["error", { "caughtErrors": "none", "ignoreRestSiblings": true }],
      'react-hooks/exhaustive-deps': 'off',
      //  'react/no-unescaped-entities': 'off',
      //  '@next/next/no-page-custom-font': 'off',
    },
  }),
  eslintConfigPrettier,
]
export default eslintConfig
