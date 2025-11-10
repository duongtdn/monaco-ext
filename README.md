# Monaco-Ext Editor

A highly customizable and extensible code editor built on top of Monaco Editor.

## Features

- **Extensible Architecture**: Easy-to-use feature system
- **Built-in feature: Read-Only Lines**: Make specific lines non-editable
- **Built-in feature: Line Selection Events**: Handle line click events
- **Built-in feature: Dynamic Highlighting**: Programmatically highlight specific lines
- **Built-in feature: Auto-Resize**: Automatically adjust editor height based on content
- **Built-in Themes**: Built-in dark and light themes
- **TextMate Syntax Highlighting**: Enhanced syntax highlighting using TextMate grammars for JavaScript, TypeScript, JSX/React, Python, JSON, and XML

## Installation

```bash
npm install monaco-ext monaco-editor
```

## Quick Start

**Important for Vite users**: You MUST add `dedupe: ['monaco-editor']` to your Vite config. See the [Integration Guide](./docs/INTEGRATION_GUIDE.md) for details.

See the [Integration Guide](./docs/INTEGRATION_GUIDE.md) for comprehensive setup instructions for Vite, Webpack, and other build tools.

### Basic Example (Vite)

```javascript
// 1. Configure vite.config.js (REQUIRED)
export default defineConfig({
  resolve: {
    dedupe: ['monaco-editor'] // ⚠️ CRITICAL for Vite
  }
});

// 2. Initialize editor
import { ExtendableCodeEditor, TextMateService, SyntaxLoader } from 'monaco-ext';
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url';

async function initEditor() {
  TextMateService.configure({ wasmPath: onigasmWasm });
  await SyntaxLoader.loadAll();
  await ExtendableCodeEditor.loadThemes();

  const editor = new ExtendableCodeEditor(container, {
    language: 'javascript',
    value: 'console.log("Hello");',
    theme: 'github-dark'
  });

  return editor;
}
```

## Examples

### Development Example
Located in `/example` - uses source code directly for development.

```bash
npm run example
```

### Integration Example
Located in `/integration-example` - demonstrates real-world integration as an npm package using Vite.

```bash
cd integration-example
npm run install-local
npm run dev
```

## ⚠️ Troubleshooting

**Language switching not working?** This is usually caused by Monaco Editor module duplication. See:
- [Integration Guide - Troubleshooting](./docs/INTEGRATION_GUIDE.md#troubleshooting)

**Quick fix for Vite users**: Add `dedupe: ['monaco-editor']` to your `vite.config.js`

## TextMate Integration

Monaco-Ext includes built-in TextMate syntax highlighting support for enhanced syntax highlighting capabilities:

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

## Example Demo

```bash
npm run example
```

Open your browser at `localhost:3800`

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
    ExtendableCodeEditor.changeTheme('tealwave-light');
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
editor.addListener('editor.selectLine', (lineNumber) => {
  console.log(`Line ${lineNumber} selected`);
});

// Enable auto-resize based on content
const autoResize = editor.features.add('autoResize', new AutoResizeHeight());

// Add highlighting capability
const highlight = editor.features.add('highlight', new HighLight());

// Highlight specific lines
editor.emit('editor.highlight', [5, 6, 7]);
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

#### Required CSS Styles for ReadOnlyLines Feature

You will need to add appropriate CSS classes to your application to visually indicate read-only lines:

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
editor.addListener('editor.selectLine', (lineNumber) => {
  console.log(`Line ${lineNumber} selected`);
});
```

### HighLight

Allows dynamically highlighting specific lines.

```javascript
// Add highlighting capability
const highlight = editor.features.add('highlight', new HighLight());

// Highlight lines 5, 6, and 7
editor.emit('editor.highlight', [5, 6, 7]);
```

#### Required CSS Styles for HighLight Feature

You will need to add appropriate CSS classes to your application to visually indicate highlighted lines:

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
editor.addListener('editor.height', (height) => {
  console.log(`Editor height changed to ${height}px`);
});
```

## Included Themes

- `github-light`
- `github-dark`
- `solarized-light`
- `solarized-dark`
- `tealwave-light`
- `tealwave-dark`

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
- `loadTextMateGrammars()`: Manually load all TextMate grammars
- `getSupportedLanguages()`: Get an array of supported language identifiers

#### Instance Methods

- `addListener(eventName, callback)`: Add an event listener (wrapper for `eventChannel.addListener`)
- `removeListener(eventName, callback)`: Remove a specific event listener (wrapper for `eventChannel.removeListener`)
- `removeAllListeners(eventName)`: Remove all listeners for an event (wrapper for `eventChannel.removeAllListeners`)
- `emit(eventName, ...args)`: Emit an event through the event channel (wrapper for `eventChannel.emit`)

#### Features API

- `editor.features.add(name, featureInstance)`: Add a feature
- `editor.features.remove(name)`: Remove a feature
- `editor.features.list()`: List all active feature names

### Event System

The editor uses an event channel system for communication between the editor and features:

```javascript
// Add event listener (direct access)
editor.eventChannel.addListener('eventName', callback);

// Add event listener (convenient wrapper)
editor.addListener('eventName', callback);

// Remove specific listener (direct access)
editor.eventChannel.removeListener('eventName', callback);

// Remove specific listener (convenient wrapper)
editor.removeListener('eventName', callback);

// Remove all listeners for an event (direct access)
editor.eventChannel.removeAllListeners('eventName');

// Remove all listeners for an event (convenient wrapper)
editor.removeAllListeners('eventName');

// Emit an event (direct access)
editor.eventChannel.emit('eventName', ...args);

// Emit an event (convenient wrapper)
editor.emit('eventName', ...args);
```

**Built-in Events:**
- `editor.selectLine` - Emitted when a line is clicked (requires the LineSelection feature)
- `editor.highlight` - Listen or emit to highlight specific lines (requires the HighLight feature)
- `editor.height` - Emitted when editor height changes (requires the AutoResizeHeight feature)

## Creating Custom Features

You can create custom features by extending the Feature interface. Features have access to the editor instance and event channel for communication.

### Basic Feature Structure

```javascript
import { Feature } from 'monaco-ext/features';

export default class CustomFeature extends Feature {
  activate = () => {
    // Setup your feature here
    // You have access to:
    // - this.editor: The Monaco editor instance
    // - this.eventChannel: Event communication system
  }

  deactivate = () => {
    // Clean up when feature is removed
    // Always dispose of event listeners and Monaco disposables
  }
}
```

### Communication Patterns

Features communicate with the editor and external code through the event channel. Here are common patterns used by built-in features:

#### Pattern 1: Listening to Events (Input)

Listen to events emitted from external code to trigger feature behavior:

```javascript
export default class HighLight extends Feature {
  decorators

  activate = () => {
    // Listen for highlight requests
    this.eventChannel.addListener('editor.highlight', lines => {
      this.decorators && this.decorators.clear();
      if (lines?.length && lines?.length > 0) {
        this.decorators = this.applyHighLightDecoration(lines);
      }
    })
  }

  deactivate = () => {
    this.decorators && this.decorators.clear();
    // Always clean up listeners
    this.eventChannel.removeAllListeners('editor.highlight');
  }

  applyHighLightDecoration = (lines) => {
    const lineNumberOffset = this.editor.props.lineNumberOffset;
    const highlights = lines.map(line => line - lineNumberOffset);
    return this.editor.createDecorationsCollection(
      highlights.map(index => ({
        range: { startLineNumber: index, startColumn: 1, endLineNumber: index, endColumn: 1 },
        options: {
          isWholeLine: true,
          className: 'highlight-code-line',
        }
      }))
    );
  }
}

// Usage: Emit event from external code
editor.emit('editor.highlight', [5, 6, 7]);
```

#### Pattern 2: Emitting Events (Output)

Emit events to notify external code about feature state or user interactions:

```javascript
export default class LineSelection extends Feature {
  mouseDownEvent;

  activate = () => {
    const lineNumberOffset = this.editor.props.lineNumberOffset
    // Subscribe to Monaco editor events
    this.mouseDownEvent = this.editor.onMouseDown(e => {
      if (e.target.detail.isAfterLines === true) {
        return
      }
      // Emit event to notify external code
      this.eventChannel.emit('editor.selectLine', e.target.range.startLineNumber + lineNumberOffset)
    })
  }

  deactivate = () => {
    // Dispose Monaco editor event subscriptions
    this.mouseDownEvent && this.mouseDownEvent.dispose()
  }
}

// Usage: Listen for events in external code
editor.addListener('editor.selectLine', (lineNumber) => {
  console.log(`Line ${lineNumber} was selected`);
});
```

#### Pattern 3: Immediate Emission

Emit events immediately during activation to notify about initial state:

```javascript
export default class AutoResizeHeight extends Feature {
  activate = () => {
    const height = this.calculateHeight();
    // Immediately notify about current height
    this.eventChannel.emit('editor.height', height);
  }

  deactivate = () => {
    // No cleanup needed in this case
  }

  calculateHeight = () => {
    const padding = this.editor.getOption(editor.EditorOption.padding);
    const lineHeight = this.editor.getOption(editor.EditorOption.lineHeight);
    const lineCount = this.editor.getModel()?.getLineCount() || 1;
    return this.editor.getTopForLineNumber(lineCount + 1) + lineHeight + padding.top + padding.bottom;
  }
}

// Usage: Listen for height changes
editor.addListener('editor.height', (height) => {
  document.getElementById('editor-container').style.height = `${height}px`;
});
```

#### Pattern 4: Bidirectional Communication

Combine listening and emitting for interactive features:

```javascript
export default class InteractiveFeature extends Feature {
  state = null;

  activate = () => {
    // Listen for commands
    this.eventChannel.addListener('feature.command', (command) => {
      this.handleCommand(command);
      // Emit response
      this.eventChannel.emit('feature.response', { success: true, state: this.state });
    });
  }

  deactivate = () => {
    this.eventChannel.removeAllListeners('feature.command');
    this.eventChannel.removeAllListeners('feature.response');
  }

  handleCommand = (command) => {
    // Process command and update state
    this.state = command;
  }
}
```

### Best Practices

1. **Always clean up**: Remove all event listeners and dispose of Monaco subscriptions in `deactivate()`
2. **Use descriptive event names**: Follow the pattern `target.action` (e.g., `editor.selectLine`, `editor.highlight`)
3. **Handle line number offsets**: Account for `lineNumberOffset` when working with line numbers
4. **Validate input**: Check for null/undefined values before processing event data
5. **Store disposables**: Keep references to Monaco event subscriptions so they can be disposed of properly
6. **Emit meaningful data**: Provide useful information in event payloads for listeners

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
