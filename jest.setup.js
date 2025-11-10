// Jest setup file to suppress console output during tests

// Save original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
  debug: console.debug
};

// Mock console methods to suppress output during tests
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
console.info = jest.fn();
console.debug = jest.fn();

// You can restore console for debugging by uncommenting the line below:
// global.console = originalConsole;