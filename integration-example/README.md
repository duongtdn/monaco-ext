# Monaco-Ext Integration Example

This example demonstrates how to integrate `monaco-ext` into a real-world application as an npm package dependency using Vite.

## Purpose

This is **NOT** the development example. This example:

- Installs `monaco-ext` as a package dependency (not using source directly)
- Uses Vite as the build tool (modern ES6 bundler)
- Demonstrates proper asset handling (WASM, grammars, themes)
- Shows real-world integration patterns

## Setup

### 1. Build the main package first

From the root directory:

```bash
cd ..
npm install
npm run build
```

### 2. Install dependencies

```bash
cd integration-example
npm run install-local
```

This will:
- Install `monaco-ext` from the parent directory as a local package
- Install other dependencies (monaco-editor, vite, etc.)

### 3. Run the example

```bash
npm run dev
```

Open your browser to the URL shown (typically http://localhost:5173)

## Common Issues

### Source Map Warning (Harmless - See KNOWN_ISSUES.md)

⚠️ **You will see this warning - it's expected and harmless:**

```
Failed to load source map for monaco-editor/esm/vs/base/common/marked/marked.js
Error: ENOENT: no such file or directory, open '...marked.umd.js.map'
```

**This does NOT affect functionality.** The editor works perfectly despite this warning.

**TL;DR:** Monaco Editor references source maps that aren't in the npm package. Vite warns about it. It's cosmetic only and affects many projects using Monaco + Vite.

---

## What to Check

### 1. Package Installation
- Uses `monaco-ext` as a dependency, not direct source files
- Properly configured in `package.json` with `file:..` reference

### 2. Asset Management with Vite
- WASM files loaded using Vite's `?url` import
- Vite handles asset bundling and serving
- No need to manually copy files to public folder

### 3. TextMate Configuration
```javascript
import onigasmWasm from 'onigasm/lib/onigasm.wasm?url';

TextMateService.configure({
  wasmPath: onigasmWasm
});
```

### 4. Grammar Loading
```javascript
await SyntaxLoader.loadAll();
```

### 5. Feature Usage
- Read-only lines
- Line selection
- Highlighting
- Theme switching
- Multi-language support

## File Structure

```
integration-example/
├── package.json          # Uses monaco-ext as dependency
├── vite.config.js        # Vite configuration for assets
├── index.html            # Entry HTML
└── src/
    └── main.js           # Application code
```

## Differences from Development Example

| Aspect | Development Example | Integration Example |
|--------|-------------------|-------------------|
| Usage | Direct source import | Package dependency |
| Location | `/example` | `/integration-example` |
| Purpose | Package development | Real-world integration |
| Build tool | Webpack | Vite |
| Asset handling | Webpack aliases | Vite URL imports |

## Testing Integration

This example serves as an integration test to ensure:

1. ✅ Package builds correctly
2. ✅ Exports are properly configured
3. ✅ Assets are accessible
4. ✅ WASM loading works
5. ✅ Grammars load successfully
6. ✅ Themes work
7. ✅ Features work as expected
8. ✅ Works with modern bundlers (Vite)

## Troubleshooting

### "Cannot find module 'monaco-ext'"

Make sure you've built the main package:
```bash
cd .. && npm run build
```

### Source map warnings from Monaco Editor

If you see warnings about missing source maps from monaco-editor, they're harmless. The vite.config.js is already configured to suppress them with `sourcemap: false`.

### Port already in use

If port 5173 is in use, Vite will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the actual URL.

### WASM loading fails

Check the browser console for the actual error. Common issues:
- WASM file path is incorrect
- CORS issues (if loading from different origin)
- Server not serving `.wasm` files correctly

### Grammars not loading

Ensure TextMate service is initialized before loading grammars:
```javascript
await TextMateService.initialize({ wasmPath: onigasmWasm });
await SyntaxLoader.loadAll();
```

## Building for Production

```bash
npm run build
npm run preview
```

This creates an optimized production build in `dist/` folder.

## Next Steps

To integrate monaco-ext in your own project:

1. Install the package:
   ```bash
   npm install monaco-ext monaco-editor
   ```

2. Follow the patterns shown in `src/main.js`

3. Configure your bundler (see `vite.config.js`)

4. Read the main [Integration Guide](../docs/INTEGRATION_GUIDE.md) for more details

## Notes

- This example uses a local file reference (`file:..`) for development
- In a real project, you would install from npm: `npm install monaco-ext`
- The Vite configuration here is minimal; you may need additional configuration for your specific needs
