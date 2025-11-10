# Monaco-Ext Editor

A highly customizable and extensible code editor built on top of Monaco Editor (the same editor that powers VS Code). This library provides a clean and simple API to enhance your editing experience with features like line selection, read-only lines, auto-resize, highlighting, and **TextMate syntax highlighting**.

## Features

✨ **TextMate Syntax Highlighting**: Enhanced syntax highlighting using TextMate grammars for JavaScript, TypeScript, JSX/React, Python, JSON, and XML
🎨 **Multiple Themes**: Built-in dark and light themes
🔧 **Extensible Architecture**: Easy-to-use feature system
📝 **Read-Only Lines**: Make specific lines non-editable
🖱️ **Line Selection Events**: Handle line click events
🎯 **Dynamic Highlighting**: Highlight specific lines
📏 **Auto-Resize**: Automatically adjust editor height based on content

## Installation

```bash
npm install monaco-ext monaco-editor --save
```

## TextMate Integration

Monaco-Ext now includes built-in TextMate syntax highlighting support for enhanced syntax highlighting capabilities:

### Supported Languages

- **JavaScript** (`javascript`, `js`) - Enhanced ES6+ syntax highlighting
- **TypeScript** (`typescript`, `ts`) - Full TypeScript syntax highlighting with types, interfaces, and generics
- **JSX/React** (`javascriptreact`, `jsx`) - Full React component highlighting
- **TypeScript React** (`typescriptreact`, `tsx`) - TypeScript JSX syntax highlighting
- **Python** (`python`, `py`) - Enhanced Python syntax highlighting
- **JSON** (`json`) - JSON syntax highlighting with proper string and value highlighting
- **JSON with Comments** (`jsonc`) - JSON with comment support
- **XML** (`xml`) - XML syntax highlighting with tags, attributes, and namespaces

### Basic Usage with TextMate

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';

const editor = new ExtendableCodeEditor(element, {
  language: 'typescript', // or 'javascript', 'jsx', 'tsx', 'python', 'json', 'xml'
  value: 'const hello: string = "world";',
  enableTextMate: true, // Default: true
});

// Get supported languages
const languages = ExtendableCodeEditor.getSupportedLanguages();
console.log(languages); // ['javascript', 'typescript', 'javascriptreact', 'typescriptreact', 'python', 'json', 'jsonc', 'xml']
```

📖 **[Read the full TextMate Integration Guide →](docs/TEXTMATE_INTEGRATION.md)**

## Installation

```bash
npm install monaco-ext monaco-editor --save
```

## Example Demo

```bash
npm start
```

Open browser at `localhost:3800`

## Usage

### Basic Setup

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';

// Create a new editor instance
const editor = new ExtendableCodeEditor(
  document.getElementById('editor-container'),
  {
    language: 'javascript',
    value: '// Your code here',
    minimap: { enabled: false },
    lineNumberOffset: 0,
    wordWrap: true,
    readOnly: false,
  }
);
```

### Loading Themes

```javascript
// Load available themes
const themes = import('monaco-ext/dist/themes')
ExtendableCodeEditor.loadThemes(() => Promise.resolve(themes))
  .then(() => {
    // Set a theme
    ExtendableCodeEditor.changeTheme('github-dark');
  });
```

### Adding Features

```javascript
import { ReadOnlyLines, LineSelection, HighLight, AutoResizeHeight } from 'monaco-ext/dist/features';

// Make specific lines read-only
const readOnlyLines = editor.features.add('readOnlyLines', new ReadOnlyLines([1, 2, 3, 10]));

// Enable line selection events
const lineSelection = editor.features.add('lineSelection', new LineSelection());

// Listen to line selection events
editor.eventChannel.addListener('editor.selectLine', (lineNumber) => {
  console.log(`Line ${lineNumber} selected`);
});

// Enable auto-resize based on content
const autoResize = editor.features.add('autoResize', new AutoResizeHeight());

// Add highlighting capability
const highlight = editor.features.add('highlight', new HighLight());

// Highlight specific lines
editor.eventChannel.emit('editor.highlight', [5, 6, 7]);
```

### Removing Features

```javascript
// Remove a feature
editor.features.remove('readOnlyLines');
```

### Listing All Active Features

```javascript
// List all active features
const activeFeatures = editor.features.list();
console.log(activeFeatures);
```

## Built-in Features

### ReadOnlyLines

Makes specific lines in the editor read-only and visually indicates them with a style.

```javascript
// Make lines 1, 2, and 3 read-only
const readOnlyLines = editor.features.add('readOnlyLines', new ReadOnlyLines([1, 2, 3]));

// Change which lines are read-only
readOnlyLines.activate([4, 5, 6]);

// Remove read-only for all lines
readOnlyLines.deactivate();
```

#### Required CSS Styles for ReadOnlyLines Features

You'll need to add appropriate CSS classes to your application to visually indicate read-only lines:

```css
/* Basic styles for read-only lines */
.read-only-code-line {
  cursor: pointer !important;
  opacity: .8;
}

/* Theme-specific styles for read-only lines */
.light .read-only-code-line {
  background: #f1f1f1;
}

.dark .read-only-code-line {
  background: #414141;
}

/* Style for read-only text */
.read-only-code-text {
  cursor: pointer;
}
```

**Note about selection behavior**: When a selection overlaps with any read-only line, the edit operation is prevented entirely. This means if a user selects a range of lines that includes both editable and read-only lines, no changes will be applied to preserve the integrity of the read-only content.

### LineSelection

Adds line selection events that fire when a user clicks on a line.

```javascript
// Add line selection capability
const lineSelection = editor.features.add('lineSelection', new LineSelection());

// Listen to line selection events
editor.eventChannel.addListener('editor.selectLine', (lineNumber) => {
  console.log(`Line ${lineNumber} selected`);
});
```

### HighLight

Allows dynamically highlighting specific lines.

```javascript
// Add highlighting capability
const highlight = editor.features.add('highlight', new HighLight());

// Highlight lines 5, 6, and 7
editor.eventChannel.emit('editor.highlight', [5, 6, 7]);
```

#### Required CSS Styles for HighLight Features

You'll need to add appropriate CSS classes to your application to visually indicate highlighted lines:

```css
/* Theme-specific styles for highlighted lines */
.light .highlight-code-line {
  background: #ffeb3b !important;
}

.dark .highlight-code-line {
  background: #f44336 !important;
}
```

### AutoResizeHeight

Automatically adjusts the editor's height based on content.

```javascript
// Enable auto-resize
const autoResize = editor.features.add('autoResize', new AutoResizeHeight());

// Listen to height changes
editor.eventChannel.addListener('editor.height', (height) => {
  console.log(`Editor height changed to ${height}px`);
});
```

## Included Themes

- `github-light`
- `github-dark`
- `solarized-light`
- `solarized-dark`

## API Reference

### ExtendableCodeEditor

#### Constructor

```javascript
new ExtendableCodeEditor(element, options)
```

- `element`: DOM element where the editor will be mounted
- `options`: Editor options including:
  - `language`: Programming language for syntax highlighting
  - `value`: Initial text content
  - `minimap`: Configuration for code minimap
  - `padding`: Editor padding
  - `lineNumberOffset`: Starting line number
  - `scrollBeyondLastLine`: Allow scrolling beyond the last line
  - `tabSize`: Number of spaces for a tab
  - `wordWrap`: Enable/disable word wrapping
  - `contextmenu`: Enable/disable context menu
  - `readOnly`: Make entire editor read-only

#### Static Methods

- `loadThemes(Promise)`: Load a set of themes
- `changeTheme(themeName)`: Change the current theme
- `colorizeElement(...)`: Colorize a DOM element with code

#### Features API

- `editor.features.add(name, featureInstance)`: Add a feature
- `editor.features.remove(name)`: Remove a feature
- `editor.features.list()`: List all active feature names

### Event System

The editor uses an event channel system for communication:

```javascript
// Add event listener
editor.eventChannel.addListener('eventName', callback);

// Remove specific listener
editor.eventChannel.removeListener('eventName', callback);

// Remove all listeners for an event
editor.eventChannel.removeAllListeners('eventName');

// Emit an event
editor.eventChannel.emit('eventName', ...args);
```

## Creating Custom Features

You can create custom features by extending the Feature interface:

```javascript
import { Feature } from 'monaco-ext/features';

export default class CustomFeature extends Feature {
  activate = () => {
    // Setup your feature here
    // You have access to:
    // - this.editor: The editor instance
    // - this.eventChannel: Event communication system
  }

  deactivate = () => {
    // Clean up when feature is removed
  }
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
