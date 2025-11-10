# Monaco-Ext Integration Guide

This guide explains how to integrate `monaco-ext` into modern web applications using various build tools (Vite, Webpack, etc.).

## Overview

`monaco-ext` extends Monaco Editor with additional features like TextMate syntax highlighting, read-only lines, line selection, and auto-resize. Due to the nature of web assets (WASM files, grammar files, themes), proper integration requires understanding how to handle these assets in your build pipeline.

## Core Concepts

### Asset Management Philosophy

**monaco-ext does NOT bundle assets** within the library. Instead, you (the end application) control how assets are loaded and served. This approach:

- ✅ Avoids bundler conflicts
- ✅ Works with any build tool (Vite, Webpack, Rollup, etc.)
- ✅ Gives you control over what assets to include
- ✅ Prevents "works in dev, breaks in prod" issues

### What Are These Assets?

1. **WASM Files**: Binary files for oniguruma regex engine (used by TextMate)
2. **Grammar Files**: `.tmLanguage.json` files that define syntax highlighting rules
3. **Theme Files**: `.json` files that define color schemes

## Installation

```bash
npm install monaco-ext monaco-editor
```

## Integration Methods

Choose the method that best suits your application architecture:

### Method 1: Simple Integration (Recommended for Most Apps)

**Best for**: Applications that want TextMate highlighting with minimal setup

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';

// Initialize with TextMate support
async function initEditor() {
  try {
    // Load built-in grammars (requires proper asset configuration)
    await ExtendableCodeEditor.loadTextMateGrammars();

    // Load themes
    await ExtendableCodeEditor.loadThemes();

    // Create editor
    const editor = new ExtendableCodeEditor(container, {
      language: 'javascript',
      value: 'console.log("Hello");',
      enableTextMate: true
    });

    return editor;
  } catch (error) {
    console.error('Editor initialization failed:', error);
  }
}
```

### Method 2: Custom Asset Loading (Advanced)

**Best for**: Applications that need full control over asset loading

```javascript
import { ExtendableCodeEditor, TextMateService } from 'monaco-ext';
import * as monaco from 'monaco-editor';

async function initEditorCustom() {
  // 1. Initialize TextMate service with custom asset paths
  const textMateService = await TextMateService.initialize({
    // Provide your own WASM loader
    wasmLoader: async () => {
      const response = await fetch('/assets/onigasm.wasm');
      return response.arrayBuffer();
    }
  });

  // 2. Load grammars manually
  const jsGrammar = await fetch('/assets/grammars/javascript.json').then(r => r.json());
  await textMateService.loadGrammar('source.js', jsGrammar);
  await textMateService.registerLanguage('javascript', 'source.js');

  // 3. Create editor
  const editor = new ExtendableCodeEditor(container, {
    language: 'javascript',
    value: 'const x = 1;'
  });

  return editor;
}
```

## Build Tool Configuration

### Vite Configuration

⚠️ **CRITICAL**: Vite configuration requires the `dedupe` option to prevent Monaco Editor module duplication. Without this, language switching and TextMate integration will fail.

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api'
    },
    
    // ⚠️ CRITICAL: Deduplicate monaco-editor
    // Without this, the package and your app will use different Monaco instances
    // causing language registration to fail
    dedupe: ['monaco-editor']
  },

  build: {
    // Ensure WASM files are properly handled
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.wasm')) {
            return 'assets/wasm/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },

  // Development server config
  server: {
    fs: {
      // Allow serving files from node_modules
      allow: ['..']
    }
  },

  optimizeDeps: {
    exclude: ['monaco-editor']
  }
});
```

**Why is `dedupe` necessary?**

Monaco-ext imports `monaco-editor` internally to register languages and grammars. Your application also imports `monaco-editor`. Without `dedupe`, Vite may bundle two separate instances of Monaco Editor, causing:

- ❌ Languages registered on one instance are not visible to the other
- ❌ Language switching fails
- ❌ Only 'plaintext' language available
- ❌ TextMate syntax highlighting breaks after language changes

The `dedupe: ['monaco-editor']` option tells Vite to ensure only ONE instance of Monaco Editor is used throughout your application.

### Webpack Configuration

```javascript
// webpack.config.js
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/wasm/[name][ext]'
        }
      },
      {
        test: /\.tmLanguage\.json$/,
        type: 'json'
      }
    ]
  },

  plugins: [
    new MonacoWebpackPlugin({
      languages: ['javascript', 'typescript', 'python', 'json'],
      features: ['!codelens'] // Exclude features you don't need
    })
  ],

  resolve: {
    extensions: ['.js', '.json', '.wasm'],
    fallback: {
      'path': require.resolve('path-browserify'),
      'fs': false
    }
  }
};
```

## Asset Setup Options

### Option A: Copy Assets to Public Folder (Simplest)

**Recommended for most applications**

1. Copy assets from `node_modules/monaco-ext/` to your `public/` folder:

```bash
# Create directories
mkdir -p public/monaco-ext/themes
mkdir -p public/monaco-ext/syntaxes

# Copy themes
cp node_modules/monaco-ext/dist/themes/*.json public/monaco-ext/themes/

# Copy syntaxes
cp -r node_modules/monaco-ext/dist/textmate/syntaxes/* public/monaco-ext/syntaxes/

# Copy WASM (from onigasm)
cp node_modules/onigasm/lib/onigasm.wasm public/monaco-ext/
```

2. Configure asset paths in your app:

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';

// Set base paths for assets
ExtendableCodeEditor.configure({
  paths: {
    wasm: '/monaco-ext/onigasm.wasm',
    grammars: '/monaco-ext/syntaxes',
    themes: '/monaco-ext/themes'
  }
});

// Now initialize as normal
await ExtendableCodeEditor.loadTextMateGrammars();
await ExtendableCodeEditor.loadThemes();
```

### Option B: Use Build Tool to Handle Assets

Let your bundler process and copy assets automatically.

**Vite Example:**

```javascript
// src/editor-setup.js
import wasmUrl from 'onigasm/lib/onigasm.wasm?url';
import jsGrammar from 'monaco-ext/dist/textmate/syntaxes/javascript/JavaScript.tmLanguage.json';
import githubDark from 'monaco-ext/dist/themes/github-dark.json';

import { TextMateService } from 'monaco-ext';

export async function setupEditor(container) {
  // Load WASM
  const textMateService = await TextMateService.initialize({
    wasmPath: wasmUrl
  });

  // Load grammars
  await textMateService.loadGrammar('source.js', jsGrammar);
  await textMateService.registerLanguage('javascript', 'source.js');

  // Load theme
  ExtendableCodeEditor.defineTheme('github-dark', githubDark);
  ExtendableCodeEditor.changeTheme('github-dark');

  // Create editor
  const editor = new ExtendableCodeEditor(container, options);
  return editor;
}
```

### Option C: Dynamic Loading (Most Flexible)

Load assets on demand from a CDN or server:

```javascript
import { TextMateService } from 'monaco-ext';

async function loadGrammarFromCDN(language) {
  const grammarUrls = {
    javascript: 'https://cdn.example.com/grammars/javascript.json',
    python: 'https://cdn.example.com/grammars/python.json'
  };

  const url = grammarUrls[language];
  const grammar = await fetch(url).then(r => r.json());

  const service = TextMateService.getInstance();
  await service.loadGrammar(`source.${language}`, grammar);
  await service.registerLanguage(language, `source.${language}`);
}
```

## Usage Patterns

### Basic Editor with Features

```javascript
import { ExtendableCodeEditor } from 'monaco-ext';
import { ReadOnlyLines, LineSelection, HighLight } from 'monaco-ext/features';

async function createEditor(container) {
  // Initialize
  await ExtendableCodeEditor.loadTextMateGrammars();
  await ExtendableCodeEditor.loadThemes();

  // Create editor
  const editor = new ExtendableCodeEditor(container, {
    language: 'javascript',
    value: 'function hello() {\n  console.log("Hello");\n}',
    theme: 'github-dark',
    enableTextMate: true
  });

  // Add features
  editor.features.add('readOnly', new ReadOnlyLines([1])); // Line 1 is read-only
  editor.features.add('lineSelect', new LineSelection());
  editor.features.add('highlight', new HighLight());

  // Listen to events
  editor.eventChannel.addListener('editor.selectLine', (line) => {
    console.log('Line selected:', line);
  });

  return editor;
}
```

### Multi-Language Support

```javascript
const SUPPORTED_LANGUAGES = ['javascript', 'python', 'typescript', 'json'];

async function setupMultiLanguageEditor() {
  await ExtendableCodeEditor.loadTextMateGrammars(SUPPORTED_LANGUAGES);

  const editors = {};
  for (const lang of SUPPORTED_LANGUAGES) {
    editors[lang] = new ExtendableCodeEditor(containers[lang], {
      language: lang,
      value: sampleCode[lang]
    });
  }

  return editors;
}
```

## Troubleshooting

### Language Switching Doesn't Work (Most Common Issue)

**Symptoms**:
- Initial editor loads with syntax highlighting
- Changing language removes all colors or shows only plaintext highlighting
- Console shows: "Monaco registered languages: ['plaintext']"
- Language switching worked in development but fails in production/integrated apps

**Root Cause**: Monaco Editor module duplication

**Solution** (Vite):
```javascript
// vite.config.js
export default defineConfig({
  resolve: {
    dedupe: ['monaco-editor'] // ⚠️ CRITICAL: Must have this
  }
});
```

**Solution** (Webpack):
```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      'monaco-editor': path.resolve(__dirname, 'node_modules/monaco-editor')
    }
  }
};
```

**Why this happens**: 
- `monaco-ext` imports Monaco Editor to register languages
- Your app also imports Monaco Editor 
- Bundlers may create two separate instances
- Languages are registered on one instance, but your app uses the other
- Result: Only 'plaintext' available, language switching broken

**How to verify the fix**:
```javascript
import * as monaco from 'monaco-editor';

// After loading grammars, check:
const langs = monaco.languages.getLanguages();
console.log('Available languages:', langs.map(l => l.id));

// Should see: javascript, typescript, python, json, xml, etc.
// NOT just: plaintext
```

### WASM Loading Fails

**Symptom**: Error: "Failed to load onigasm WASM"

**Solutions**:
1. Verify WASM file is accessible at the configured path
2. Check browser console for 404 errors
3. Ensure your server serves `.wasm` files with correct MIME type: `application/wasm`
4. Check CORS headers if loading from a different origin

```javascript
// Debug WASM loading
try {
  await TextMateService.initialize();
} catch (error) {
  console.error('WASM loading failed:', error);
  // Fallback to basic Monaco highlighting
}
```

### Grammar Not Found

**Symptom**: "Grammar not found for scope: source.js"

**Solutions**:
1. Verify grammar files are copied to the correct location
2. Check that file paths match your configuration
3. Ensure JSON files are valid

```javascript
// Verify grammar loading
const supportedLangs = ExtendableCodeEditor.getSupportedLanguages();
console.log('Available languages:', supportedLangs);
```

### Syntax Highlighting Not Working

**Symptom**: Code appears but without colors or with basic colors

**Solutions**:
1. Verify TextMate grammars loaded: `await ExtendableCodeEditor.loadTextMateGrammars()`
2. Check that `enableTextMate: true` is set in editor options
3. Verify theme is loaded and applied
4. Check browser console for errors

```javascript
// Debug highlighting
const model = editor.editor.getModel();
const tokens = monaco.editor.tokenize(model.getLineContent(1), 'javascript');
console.log('Tokens:', tokens);
```

### Build Size Too Large

**Problem**: Bundle size is too big

**Solutions**:
1. Only load grammars for languages you actually use
2. Use code splitting to load grammars on demand
3. Exclude unused Monaco features in your webpack/vite config
4. Consider loading assets from CDN instead of bundling

```javascript
// Lazy load grammars
async function loadLanguageSupport(language) {
  const grammars = {
    javascript: () => import('./grammars/javascript.json'),
    python: () => import('./grammars/python.json')
  };

  const grammar = await grammars[language]();
  await textMateService.loadGrammar(`source.${language}`, grammar.default);
}
```

## Production Deployment Checklist

- [ ] WASM files are served with correct MIME type
- [ ] All required grammar files are accessible
- [ ] Theme files are accessible
- [ ] Asset paths are correct for production URLs
- [ ] CORS configured if loading from CDN
- [ ] Gzip/Brotli compression enabled for JSON/WASM files
- [ ] Cache headers set appropriately
- [ ] Error handling in place for asset loading failures
- [ ] Tested in target browsers

## Best Practices

1. **Lazy Load Assets**: Only load grammars for languages actually used
2. **Cache Assets**: Use service workers or HTTP caching for grammar files
3. **Error Handling**: Always wrap initialization in try-catch
4. **Progressive Enhancement**: Provide fallback to basic Monaco if TextMate fails
5. **Bundle Optimization**: Exclude unused Monaco features
6. **Asset Versioning**: Use hashed filenames for cache busting
7. **⚠️ ALWAYS dedupe monaco-editor**: This prevents module duplication issues

## Common Pitfalls

### ❌ Pitfall 1: Forgetting to dedupe monaco-editor (Vite)

```javascript
// ❌ WRONG - will cause language switching to fail
export default defineConfig({
  resolve: {
    alias: { 'monaco-editor': '...' }
    // Missing dedupe!
  }
});

// ✅ CORRECT
export default defineConfig({
  resolve: {
    alias: { 'monaco-editor': '...' },
    dedupe: ['monaco-editor'] // Must have this
  }
});
```

### ❌ Pitfall 2: Changing theme before loading themes

```javascript
// ❌ WRONG - theme not loaded yet
ExtendableCodeEditor.changeTheme('github-dark');
await ExtendableCodeEditor.loadThemes();

// ✅ CORRECT - load first, then change
await ExtendableCodeEditor.loadThemes();
ExtendableCodeEditor.changeTheme('github-dark');
```

### ❌ Pitfall 3: Not configuring WASM path (Vite)

```javascript
// ❌ WRONG - WASM won't load
import onigasmWasm from 'onigasm/lib/onigasm.wasm';
TextMateService.configure({ wasmPath: onigasmWasm });

// ✅ CORRECT - use ?url suffix for Vite
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url';
TextMateService.configure({ wasmPath: onigasmWasm });
```

### ❌ Pitfall 4: Testing only in dev mode

```javascript
// Always test production builds:
npm run build
npm run preview

// Different bundling behavior may reveal issues
```

## Example Projects

See the `/integration-example` folder for a complete working example using this package as a dependency.

## API Reference

### ExtendableCodeEditor

Main editor class that extends Monaco Editor.

```typescript
class ExtendableCodeEditor {
  constructor(container: HTMLElement, options: EditorOptions);

  // Static methods
  static loadTextMateGrammars(languages?: string[]): Promise<void>;
  static loadThemes(themesLoader?: ThemeLoader): Promise<void>;
  static changeTheme(themeName: string): void;
  static defineTheme(themeName: string, themeData: any): void;
  static configure(config: EditorConfig): void;
  static getSupportedLanguages(): string[];

  // Instance properties
  editor: monaco.editor.IStandaloneCodeEditor;
  features: FeatureManager;
  eventChannel: EventChannel;
}
```

### TextMateService

Service for managing TextMate grammars.

```typescript
class TextMateService {
  static initialize(options?: TextMateOptions): Promise<TextMateService>;
  static getInstance(): TextMateService;

  loadGrammar(scopeName: string, grammarData: any): Promise<void>;
  registerLanguage(languageId: string, scopeName: string): Promise<void>;
}
```

### Features

Additional editor features:

- **ReadOnlyLines**: Make specific lines read-only
- **LineSelection**: Enable line selection by clicking line numbers
- **HighLight**: Highlight specific lines
- **AutoResizeHeight**: Auto-resize editor based on content

```javascript
import { ReadOnlyLines, LineSelection, HighLight, AutoResizeHeight } from 'monaco-ext/features';

// Usage
editor.features.add('readonly', new ReadOnlyLines([1, 2, 3]));
editor.features.add('select', new LineSelection());
editor.features.add('highlight', new HighLight());
editor.features.add('resize', new AutoResizeHeight());

// Remove features
editor.features.remove('readonly');

// List active features
const active = editor.features.list();
```

## Support

For issues, questions, or contributions, visit:
- GitHub: https://github.com/duongtdn/monaco-ext
- Issues: https://github.com/duongtdn/monaco-ext/issues

## License

MIT
