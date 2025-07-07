export default {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/frontend',
  testEnvironment: 'jsdom',
  passWithNoTests: true,
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '\\.svg$': 'identity-obj-proxy',
    '\\.css$': 'identity-obj-proxy',
  },
  transformIgnorePatterns: ['node_modules/(?!(@fabaccess)/)'],
  globals: {
    'import.meta': {
      env: {},
    },
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/test-setup.ts',
    '!src/test-utils/**',
  ],
  verbose: true,
};
