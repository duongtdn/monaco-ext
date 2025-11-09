# TextMate Integration Guide

This guide explains how to use TextMate syntax highlighting with `monaco-ext`.

## Overview

`monaco-ext` now includes built-in support for TextMate grammars using `monaco-textmate` and `onigasm`. This provides enhanced syntax highlighting capabilities beyond Monaco Editor's basic language support.

## Installation

The required dependencies are already included when you install `monaco-ext`:

- `monaco-textmate`: Provides TextMate grammar integration for Monaco Editor
- `onigasm`: WebAssembly port of the Oniguruma regex engine used by TextMate

## Built-in Language Support

The following languages are supported out of the box:

### JavaScript
- **Languages**: `javascript`, `js`
- **Scope**: `source.js`
- **Features**: Enhanced JavaScript syntax highlighting with better detection of modern syntax

### JavaScript React (JSX)
- **Languages**: `javascriptreact`, `jsx`
- **Scope**: `source.js.jsx`
- **Features**: Full JSX/React syntax highlighting with component detection

### Python
- **Languages**: `python`, `py`
- **Scope**: `source.python`
- **Features**: Enhanced Python syntax highlighting with better string and comment detection

## Usage

### Basic Usage

TextMate syntax highlighting is automatically enabled when you create an ExtendableCodeEditor:

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';

const editor = new ExtendableCodeEditor(element, {
  language: 'javascript',
  value: 'const hello = "world";',
  enableTextMate: true, // Default: true
});
```

### Explicit Grammar Loading

You can manually load all TextMate grammars:

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';

// Load all grammars explicitly
await ExtendableCodeEditor.loadTextMateGrammars();

// Get list of supported languages
const supportedLanguages = ExtendableCodeEditor.getSupportedLanguages();
console.log(supportedLanguages); // ['javascript', 'js', 'javascriptreact', 'jsx', 'python', 'py']
```

### Using Individual Services

For advanced use cases, you can use the TextMate services directly:

```javascript
import { TextMateService, SyntaxLoader } from 'monaco-ext';

// Initialize the TextMate service
const service = await TextMateService.initialize();

// Load a specific grammar
await SyntaxLoader.loadGrammar('source.js', 'javascript');

// Get supported languages
const languages = SyntaxLoader.getSupportedLanguages();
```

## Configuration

### Webpack Configuration

If you're using webpack, make sure to include the necessary fallbacks for Node.js modules:

```javascript
module.exports = {
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
      "util": false
    }
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'asset/resource'
      },
      {
        test: /\.tmLanguage(\.json)?$/,
        type: 'asset/resource'
      }
    ]
  }
};
```

### Dependencies

Add these to your `package.json` devDependencies for webpack:

```json
{
  "devDependencies": {
    "path-browserify": "^1.0.1"
  }
}
```

## Example: Language Switching

Here's a complete example showing how to switch between different languages:

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';
import * as monaco from 'monaco-editor';

// Sample code for different languages
const sampleCode = {
  javascript: `function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  }`,

  python: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,

  jsx: `function Counter({ initialValue = 0 }) {
    const [count, setCount] = useState(initialValue);
    return <div>Count: {count}</div>;
  }`
};

// Initialize editor
const editor = new ExtendableCodeEditor(element, {
  language: 'javascript',
  value: sampleCode.javascript,
  enableTextMate: true,
});

// Switch language
function changeLanguage(newLang) {
  const model = editor.editor.getModel();
  if (model) {
    model.setValue(sampleCode[newLang]);
    monaco.editor.setModelLanguage(model, newLang);
  }
}
```

## Advanced Features

### Custom Grammar Loading

You can extend the system with custom grammars:

```javascript
import { TextMateService } from 'monaco-ext';

const service = await TextMateService.initialize();

// Load a custom grammar
const customGrammar = {
  scopeName: 'source.custom',
  name: 'Custom Language',
  patterns: [
    // Your TextMate grammar patterns here
  ]
};

await service.loadGrammar('source.custom', customGrammar);
await service.registerLanguage('custom', 'source.custom');
```

### Error Handling

The TextMate integration includes graceful error handling:

```javascript
const editor = new ExtendableCodeEditor(element, {
  language: 'javascript',
  value: 'code here',
  enableTextMate: true, // If this fails, editor falls back to basic highlighting
});

// Check if TextMate is available
try {
  await ExtendableCodeEditor.loadTextMateGrammars();
  console.log('TextMate grammars loaded successfully');
} catch (error) {
  console.warn('TextMate grammars failed to load, using basic highlighting');
}
```

## Troubleshooting

### Common Issues

1. **WASM Loading Errors**: Ensure your webpack configuration includes proper fallbacks for Node.js modules.

2. **Grammar Not Found**: Make sure the language identifier matches one of the supported languages.

3. **Performance Issues**: TextMate grammars are loaded lazily. Large files may take longer to highlight initially.

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (requires modern version for WebAssembly)
- **IE**: Not supported (requires WebAssembly)

## API Reference

### ExtendableCodeEditor

- `ExtendableCodeEditor.loadTextMateGrammars()`: Load all available grammars
- `ExtendableCodeEditor.getSupportedLanguages()`: Get list of supported language identifiers

### TextMateService

- `TextMateService.initialize()`: Initialize the singleton TextMate service
- `TextMateService.getInstance()`: Get the initialized service instance
- `service.loadGrammar(scopeName, grammarData)`: Load a specific grammar
- `service.registerLanguage(languageId, scopeName)`: Register a language with Monaco

### SyntaxLoader

- `SyntaxLoader.loadAll()`: Load all built-in grammars
- `SyntaxLoader.loadGrammar(scopeName, languageId)`: Load a specific grammar
- `SyntaxLoader.getSupportedLanguages()`: Get all supported languages

## File Structure

The TextMate integration includes these files:

```
src/textmate/
├── index.js                 # Main exports
├── TextMateService.js       # Core TextMate service
├── SyntaxLoader.js          # Grammar loading utilities
└── __tests__/
    ├── TextMateService.unit.test.js
    └── SyntaxLoader.unit.test.js
```

Grammar files are located in:

```
src/syntaxes/
├── javascript/
│   ├── JavaScript.tmLanguage.json
│   └── JavaScriptReact.tmLanguage.json
└── python/
    └── MagicPython.tmLanguage.json
```