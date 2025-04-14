// Ensure all timers and intervals are cleared after each test
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});

// Ensure all resources are cleaned up after all tests
afterAll(() => {
  jest.restoreAllMocks();
}); 