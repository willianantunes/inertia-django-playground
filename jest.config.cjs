/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  // Coverage configuration: include all frontend source files except tests and test helpers
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    '<rootDir>/frontend/**/*.{js,jsx,ts,tsx}',
    // exclude test files and common test folders/patterns
    '!<rootDir>/frontend/**/*.test.{js,jsx,ts,tsx}',
    "!<rootDir>/frontend/**/?(*.)+(spec|test).[tj]s?(x)",
    '!<rootDir>/frontend/**/__tests__/**',
    '!<rootDir>/frontend/**/tests/**',
    // exclude generated/build outputs and type-only files
    '!<rootDir>/frontend/**/dist/**',
    '!<rootDir>/frontend/**/vite-env.d.ts',
  ],
  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', { presets: ['@babel/preset-env', ['@babel/preset-react', { runtime: 'automatic' }], '@babel/preset-typescript'] }],
  },
  transformIgnorePatterns: [
    // Transform specific ESM packages from node_modules used in tests
    '/node_modules/(?!(?:@mui|@emotion|framer-motion)/)'
  ],
  moduleNameMapper: {
    // Map inertia react to a light-weight test mock
    '^@inertiajs/react$': '<rootDir>/tests/mocks/inertia-react.tsx',
    // Handle path aliases if used (adjust as needed)
    '^@/(.*)$': '<rootDir>/frontend/js/$1',
  },
  testMatch: [
    '<rootDir>/frontend/**/*.test.ts',
    '<rootDir>/frontend/**/*.test.tsx',
    '<rootDir>/frontend/**/*.test.js',
    '<rootDir>/frontend/**/*.test.jsx',
  ],
}
