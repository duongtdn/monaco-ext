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

const languages = {
  getLanguages: jest.fn().mockReturnValue([
    { id: 'javascript', aliases: ['JavaScript', 'javascript', 'js'] },
    { id: 'python', aliases: ['Python', 'python', 'py'] },
    { id: 'html', aliases: ['HTML', 'html'] },
    { id: 'css', aliases: ['CSS', 'css'] }
  ]),
  register: jest.fn(),
  setTokensProvider: jest.fn(),
  setMonarchTokensProvider: jest.fn(),
  setLanguageConfiguration: jest.fn()
};

module.exports = {
  editor,
  languages
};