/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // Allow explicit any usage per requirements
    '@typescript-eslint/no-explicit-any': 'off',
    // React 17+ with new JSX transform doesn't require React in scope
    'react/react-in-jsx-scope': 'off',
  },
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        // Not using project config to keep setup simple and fast
      },
    },
    {
      files: ['**/*.{js,jsx}'],
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    {
      files: ['frontend/**/*.{js,jsx,ts,tsx}'],
      rules: {
        // Inertia dynamic imports often require any
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules/', 'frontend/dist/', 'dist/', 'build/', '**/*.css'],
}
