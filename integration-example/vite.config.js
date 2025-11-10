import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'monaco-editor': 'monaco-editor/esm/vs/editor/editor.api'
    },
    dedupe: ['monaco-editor']
  },
  
  build: {
    assetsInlineLimit: 0,
    // Disable source maps to avoid warnings about missing Monaco source maps
    sourcemap: false,
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
  
  server: {
    fs: {
      allow: ['..']
    }
  },
  
  optimizeDeps: {
    exclude: ['monaco-editor']
  }
});
