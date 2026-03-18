// .eslintrc.js
module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }, // ensure .tsx JSX is parsed
  },
  settings: {
    react: { version: 'detect' },
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended', // <-- adds rules-of-hooks & exhaustive-deps
  ],
  rules: {
    // New JSX transform (React 17+): React import not required in scope
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',

    // TS ergonomics
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // React + TS
    'react/prop-types': 'off', // using TypeScript instead of PropTypes

    // Console/debug prefs
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
