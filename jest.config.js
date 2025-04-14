module.exports = {
  testEnvironment: 'node',
  maxWorkers: 1, // Run tests serially to avoid race conditions
  testTimeout: 10000, // Reduce timeout since we're running serially
  setupFilesAfterEnv: ['./jest.setup.js'],
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}; 