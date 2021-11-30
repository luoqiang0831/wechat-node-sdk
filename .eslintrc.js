export default {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 9,
    // allowImportExportEverywhere: true,
    sourceType: 'module'
  },
  rules: {
    semi: 'warn',
    'no-unused-vars': 'off',
    'no-cond-assign': 'error',
    'no-debugger': 'warn',
    'no-dupe-args': 'error',
    'no-caller': 'error',
    'no-unmodified-loop-condition': 'error',
    'no-with': 'error',
    'no-catch-shadow': 'error',
    // '@typescript-eslint/explicit-function-return-type': 0, //{ "allowTypedFunctionExpressions": false }
    // "prettier/prettier": "warn"
    'prettier/prettier': [
      'warn',
      {
        useTabs: false,
        proseWrap: 'preserve',
        endOfLine: 'auto'
      }
    ]
  }
}
