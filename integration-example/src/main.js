import { ExtendableCodeEditor, TextMateService, SyntaxLoader } from 'monaco-ext';
import { ReadOnlyLines, LineSelection, HighLight } from 'monaco-ext/features';
import * as monaco from 'monaco-editor';

// Import WASM file URL (Vite will handle this)
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url';

// Sample code for different languages
const sampleCode = {
  javascript: `// Monaco-Ext Integration Example
// This editor is using monaco-ext as an npm package!

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

const greeting = \`Hello \${name}!\`;
console.log(greeting);

// Try the features:
// - Click line numbers for line selection
// - Highlight specific lines
// - Some lines can be made read-only
`,

  typescript: `// TypeScript with TextMate Highlighting
interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json();
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};
`,

  python: `# Python with TextMate Highlighting
def factorial(n: int) -> int:
    """Calculate factorial recursively."""
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Regular expressions
import re
email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# Test the pattern
test_email = "user@example.com"
is_valid = bool(re.match(email_pattern, test_email))
print(f"Email {test_email} is {'valid' if is_valid else 'invalid'}")
`,

  jsx: `// React JSX with TextMate Highlighting
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
    </div>
  );
}

export default Counter;
`,

  json: `{
  "name": "monaco-ext-example",
  "version": "1.0.0",
  "description": "Integration example",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "monaco-ext": "^0.2.0",
    "monaco-editor": "^0.52.2"
  }
}`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <appSettings>
    <add key="name" value="Monaco-Ext" />
    <add key="version" value="0.2.0" />
  </appSettings>
  <features>
    <feature name="textmate" enabled="true" />
    <feature name="line-selection" enabled="true" />
  </features>
</configuration>`
};

// Status logging
function updateStatus(message, type = 'info') {
  const statusEl = document.getElementById('status');
  const timestamp = new Date().toLocaleTimeString();
  const className = type;
  const entry = `<span class="${className}">[${timestamp}] ${message}</span><br>`;

  const lines = statusEl.innerHTML.split('<br>');
  if (lines.length > 20) {
    lines.splice(1, lines.length - 20); // Keep header
  }
  statusEl.innerHTML = entry + lines.join('<br>');
}

// Feature state
const featureState = {
  readOnly: false,
  lineSelection: false,
  highlight: false
};

let editor;

// Initialize editor
async function initEditor() {
  try {
    updateStatus('Initializing monaco-ext...', 'info');

    // Configure TextMate with WASM path
    updateStatus('Configuring TextMate service...', 'info');
    TextMateService.configure({
      wasmPath: onigasmWasm
    });

    // Load TextMate grammars - configure WASM path first
    updateStatus('Loading TextMate grammars...', 'info');

    // Configure TextMate service with WASM path
    TextMateService.configure({
      wasmPath: 'https://unpkg.com/onigasm@2.2.5/lib/onigasm.wasm'
    });

    // Now load all grammars (this will use the configured WASM path)
    await ExtendableCodeEditor.loadTextMateGrammars();

    updateStatus('TextMate grammars loaded successfully', 'success');

    // Get supported languages
    const supportedLangs = ExtendableCodeEditor.getSupportedLanguages();
    console.log('Supported languages from ExtendableCodeEditor:', supportedLangs);
    updateStatus(`Supported languages: ${supportedLangs.join(', ')}`, 'info');

    // Check what Monaco knows about
    const registeredLangs = monaco.languages.getLanguages();
    console.log('Monaco registered languages:', registeredLangs.map(l => l.id));

    // Specifically check for Python
    const hasPython = registeredLangs.some(l => l.id === 'python');
    console.log('Python registered with Monaco:', hasPython);

    // Load themes (using default theme loader from monaco-ext)
    updateStatus('Loading themes...', 'info');
    await ExtendableCodeEditor.loadThemes();
    updateStatus('Themes loaded successfully', 'success');

    // Set initial theme AFTER themes are loaded
    ExtendableCodeEditor.changeTheme('github-dark');
    updateStatus('Applied theme: github-dark', 'info');

    // Create editor instance
    updateStatus('Creating editor instance...', 'info');
    editor = new ExtendableCodeEditor(
      document.getElementById('editor-container'),
      {
        language: 'javascript',
        value: sampleCode.javascript,
        // Don't set theme here - already set above
        minimap: { enabled: true },
        lineNumbers: 'on',
        wordWrap: 'on'
      }
    );

    updateStatus('Editor initialized successfully!', 'success');
    updateStatus('This editor is using monaco-ext as a package dependency', 'success');

    // Setup event listeners
    setupEventListeners();

  } catch (error) {
    console.error('Initialization error:', error);
    updateStatus(`Error: ${error.message}`, 'error');
  }
}

// Setup UI event listeners
function setupEventListeners() {
  // Theme selector
  document.getElementById('theme-selector').addEventListener('change', (e) => {
    const theme = e.target.value;
    ExtendableCodeEditor.changeTheme(theme);
    updateStatus(`Theme changed to ${theme}`, 'info');
  });

  // Language selector
  document.getElementById('language-selector').addEventListener('change', (e) => {
    const lang = e.target.value;
    console.log('Language selector changed to:', lang);

    const languageMap = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      jsx: 'javascriptreact',
      json: 'json',
      xml: 'xml'
    };

    const monacoLang = languageMap[lang];
    console.log('Mapped to Monaco language:', monacoLang);

    const model = editor.editor.getModel();
    console.log('Got model:', model);

    if (model) {
      // Set the new code value
      console.log('Setting code for:', lang);
      model.setValue(sampleCode[lang]);

      // Change the language - TextMate is already wired so this should work
      console.log('Changing model language to:', monacoLang);
      console.log('Model language before:', model.getLanguageId());
      monaco.editor.setModelLanguage(model, monacoLang);
      console.log('Model language after:', model.getLanguageId());

      updateStatus(`Language changed to ${monacoLang}`, 'info');
      console.log('Language change complete');
    } else {
      console.error('No model found!');
    }
  });

  // Read-only lines toggle
  document.getElementById('toggle-readonly').addEventListener('click', (e) => {
    if (featureState.readOnly) {
      editor.features.remove('readOnly');
      featureState.readOnly = false;
      e.target.textContent = 'Enable Read-only Lines';
      updateStatus('Read-only lines disabled', 'info');
    } else {
      editor.features.add('readOnly', new ReadOnlyLines([1, 2, 3]));
      featureState.readOnly = true;
      e.target.textContent = 'Disable Read-only Lines';
      updateStatus('Lines 1-3 are now read-only', 'success');
    }
  });

  // Line selection toggle
  document.getElementById('toggle-linesel').addEventListener('click', (e) => {
    if (featureState.lineSelection) {
      editor.features.remove('lineSelection');
      featureState.lineSelection = false;
      e.target.textContent = 'Enable Line Selection';
      updateStatus('Line selection disabled', 'info');
    } else {
      editor.features.add('lineSelection', new LineSelection());
      featureState.lineSelection = true;
      e.target.textContent = 'Disable Line Selection';
      updateStatus('Line selection enabled - click line numbers', 'success');
    }
  });

  // Highlight toggle
  document.getElementById('toggle-highlight').addEventListener('click', (e) => {
    if (featureState.highlight) {
      editor.features.remove('highlight');
      featureState.highlight = false;
      e.target.textContent = 'Enable Highlight';
      updateStatus('Highlight disabled', 'info');
    } else {
      editor.features.add('highlight', new HighLight());
      featureState.highlight = true;
      e.target.textContent = 'Disable Highlight';
      updateStatus('Highlight enabled', 'success');
    }
  });

  // Highlight specific line
  document.getElementById('highlight-line').addEventListener('click', () => {
    const lineNum = parseInt(document.getElementById('line-input').value, 10);
    if (isNaN(lineNum) || lineNum < 1) {
      updateStatus('Invalid line number', 'error');
      return;
    }

    if (!featureState.highlight) {
      editor.features.add('highlight', new HighLight());
      featureState.highlight = true;
      document.getElementById('toggle-highlight').textContent = 'Disable Highlight';
    }

    editor.eventChannel.emit('editor.highlight', [lineNum]);
    updateStatus(`Highlighted line ${lineNum}`, 'success');
  });

  // Clear highlights
  document.getElementById('clear-highlights').addEventListener('click', () => {
    if (featureState.highlight) {
      editor.eventChannel.emit('editor.highlight', []);
      updateStatus('Cleared all highlights', 'info');
    }
  });

  // Listen to editor events
  editor.eventChannel.addListener('editor.selectLine', (line) => {
    updateStatus(`Line ${line} selected`, 'info');
  });
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEditor);
} else {
  initEditor();
}
