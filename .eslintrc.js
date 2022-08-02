module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard',
    'plugin:jsdoc/recommended'
  ],
  plugins: [
    'jsdoc'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    semi: [
      'error',
      'always'
    ]
  }
};
