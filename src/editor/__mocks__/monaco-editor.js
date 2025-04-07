// Mock for monaco-editor module

const editor = {
  create: jest.fn().mockReturnValue({
    getValue: jest.fn().mockReturnValue('test content'),
    layout: jest.fn(),
    onMouseDown: jest.fn(),
    onDidChangeModelContent: jest.fn(),
    createDecorationsCollection: jest.fn(),
    getModel: jest.fn(),
    updateOptions: jest.fn(),
    focus: jest.fn(),
    getOption: jest.fn(),
    getTopForLineNumber: jest.fn()
  }),
  defineTheme: jest.fn(),
  setTheme: jest.fn(),
  colorizeElement: jest.fn()
};

module.exports = {
  editor
};