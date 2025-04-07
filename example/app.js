// Import the necessary components from monaco-ext
import { ExtendableCodeEditor } from 'monaco-ext';
import { ReadOnlyLines, LineSelection, HighLight, AutoResizeHeight } from 'monaco-ext/features';
import themes from 'monaco-ext/themes';

// Sample code for the editor
const sampleCode = `// Monaco-Ext Demo
// This is a demo of the Monaco-Ext editor
// Try selecting lines, highlighting, and other features

function factorial(n) {
  // Base case
  if (n <= 1) {
    return 1;
  }

  // Recursive case
  return n * factorial(n - 1);
}

// Calculate some factorials
console.log("Factorial of 5:", factorial(5));
console.log("Factorial of 10:", factorial(10));

// Example of a class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return \`Hello, my name is \${this.name} and I am \${this.age} years old.\`;
  }
}

const alice = new Person("Alice", 28);
console.log(alice.greet());
`;

// DOM elements
const statusElement = document.getElementById('status');
const themeSelector = document.getElementById('theme-selector');
const toggleReadonlyBtn = document.getElementById('toggle-readonly');
const toggleLineSelBtn = document.getElementById('toggle-feature-lineSel');
const toggleHighlightBtn = document.getElementById('toggle-feature-highlight');
const toggleResizeBtn = document.getElementById('toggle-feature-resize');
const lineInput = document.getElementById('line-input');
const highlightLineBtn = document.getElementById('highlight-line');
const clearHighlightsBtn = document.getElementById('clear-highlights');

// Feature state tracking
const featureState = {
  readOnlyLines: false,
  lineSelection: false,
  highlight: false,
  autoResize: false
};

// Helper function to update status
function updateStatus(message) {
  const timestamp = new Date().toLocaleTimeString();
  statusElement.innerHTML = `[${timestamp}] ${message}<br>${statusElement.innerHTML}`;
  // Limit status history
  if (statusElement.innerHTML.split('<br>').length > 10) {
    statusElement.innerHTML = statusElement.innerHTML.split('<br>').slice(0, 10).join('<br>');
  }
}

// Initialize the editor
let editor;
let readOnlyLinesFeature;
let lineSelectionFeature;
let highlightFeature;
let autoResizeFeature;

async function initEditor() {
  try {
    // Create a new editor instance
    editor = new ExtendableCodeEditor(
      document.getElementById('editor-container'),
      {
        language: 'javascript',
        value: sampleCode,
        minimap: { enabled: true },
        lineNumberOffset: 0,
        wordWrap: true,
        readOnly: false,
      }
    );

    // Load available themes - updated path to match webpack alias
    await ExtendableCodeEditor.loadThemes(() => Promise.resolve(themes));

    // Set initial theme
    ExtendableCodeEditor.changeTheme('vscode-light');

    updateStatus('Editor initialized successfully');

    // Setup event listeners
    setupEventListeners();

  } catch (error) {
    console.error('Failed to initialize editor:', error);
    updateStatus(`Error: ${error.message}`);
  }
}

function setupEventListeners() {
  // Theme selector
  themeSelector.addEventListener('change', (e) => {
    const theme = e.target.value;
    ExtendableCodeEditor.changeTheme(theme);

    // Add light or dark class to editors-container based on theme
    const editorsContainer = document.querySelector('.editors-container');
    if (theme.includes('dark')) {
      editorsContainer.classList.remove('light');
      editorsContainer.classList.add('dark');
    } else {
      editorsContainer.classList.remove('dark');
      editorsContainer.classList.add('light');
    }

    updateStatus(`Theme changed to ${theme}`);
  });

  // Set initial button text based on feature state
  toggleReadonlyBtn.textContent = featureState.readOnlyLines ? 'Disable Read-only Lines' : 'Enable Read-only Lines (1-3 & 5)';
  toggleLineSelBtn.textContent = featureState.lineSelection ? 'Disable Line Selection' : 'Enable Line Selection';
  toggleHighlightBtn.textContent = featureState.highlight ? 'Disable Highlight' : 'Enable Highlight';
  toggleResizeBtn.textContent = featureState.autoResize ? 'Disable Auto Resize' : 'Enable Auto Resize';

  // Toggle read-only lines (lines 1-3)
  toggleReadonlyBtn.addEventListener('click', () => {
    if (featureState.readOnlyLines) {
      editor.features.remove('readOnlyLines');
      featureState.readOnlyLines = false;
      toggleReadonlyBtn.textContent = 'Enable Read-only Lines (1-3 & 5)';
      updateStatus('Read-only lines disabled');
    } else {
      readOnlyLinesFeature = editor.features.add('readOnlyLines', new ReadOnlyLines([1, 2, 3, 5]));
      featureState.readOnlyLines = true;
      toggleReadonlyBtn.textContent = 'Disable Read-only Lines';
      updateStatus('Lines 1-3 are now read-only');
    }
  });

  // Toggle line selection feature
  toggleLineSelBtn.addEventListener('click', () => {
    if (featureState.lineSelection) {
      editor.features.remove('lineSelection');
      featureState.lineSelection = false;
      toggleLineSelBtn.textContent = 'Enable Line Selection';
      updateStatus('Line selection disabled');
    } else {
      lineSelectionFeature = editor.features.add('lineSelection', new LineSelection());
      featureState.lineSelection = true;
      toggleLineSelBtn.textContent = 'Disable Line Selection';
      updateStatus('Line selection enabled - click on line numbers');
    }
  });

  // Toggle highlight feature
  toggleHighlightBtn.addEventListener('click', () => {
    if (featureState.highlight) {
      editor.features.remove('highlight');
      featureState.highlight = false;
      toggleHighlightBtn.textContent = 'Enable Highlight';
      updateStatus('Highlight feature disabled');
    } else {
      highlightFeature = editor.features.add('highlight', new HighLight());
      featureState.highlight = true;
      toggleHighlightBtn.textContent = 'Disable Highlight';
      updateStatus('Highlight feature enabled');
    }
  });

  // Toggle auto-resize feature
  toggleResizeBtn.addEventListener('click', () => {
    if (featureState.autoResize) {
      editor.features.remove('autoResize');
      featureState.autoResize = false;
      toggleResizeBtn.textContent = 'Enable Auto Resize';
      updateStatus('Auto-resize disabled');
      document.getElementById('editor-container').style.height = '400px';
    } else {
      autoResizeFeature = editor.features.add('autoResize', new AutoResizeHeight());
      featureState.autoResize = true;
      toggleResizeBtn.textContent = 'Disable Auto Resize';
      updateStatus('Auto-resize enabled');
    }
  });

  // Highlight line button
  highlightLineBtn.addEventListener('click', () => {
    const lineNumber = parseInt(lineInput.value, 10);
    if (isNaN(lineNumber) || lineNumber < 1) {
      updateStatus('Please enter a valid line number');
      return;
    }

    if (!featureState.highlight) {
      highlightFeature = editor.features.add('highlight', new HighLight());
      featureState.highlight = true;
      toggleHighlightBtn.textContent = 'Disable Highlight';
    }

    editor.eventChannel.emit('editor.highlight', [lineNumber]);
    updateStatus(`Highlighted line ${lineNumber}`);
  });

  // Clear highlights button
  clearHighlightsBtn.addEventListener('click', () => {
    if (featureState.highlight) {
      editor.eventChannel.emit('editor.highlight', []);
      updateStatus('Cleared all highlights');
    }
  });

  // Listen to editor events
  editor.eventChannel.addListener('editor.selectLine', (lineNumber) => {
    updateStatus(`Line ${lineNumber} selected`);
  });

  editor.eventChannel.addListener('editor.height', (height) => {
    updateStatus(`Editor height changed to ${height}px`);
  });

  // List active features
  const listFeaturesBtn = document.createElement('button');
  listFeaturesBtn.textContent = 'List Active Features';
  listFeaturesBtn.addEventListener('click', () => {
    const activeFeatures = editor.features.list();
    updateStatus(`Active features: ${activeFeatures.join(', ') || 'none'}`);
  });

  document.querySelector('.controls').appendChild(listFeaturesBtn);
}

// Initialize the editor when the DOM is ready
document.addEventListener('DOMContentLoaded', initEditor);