"use strict"

import { loadWASM } from 'onigasm'
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'
import * as monaco from 'monaco-editor'

export default class TextMateService {
  static _instance = null
  static _initialized = false
  static _config = {
    wasmPath: null,
    wasmLoader: null
  }

  _registry = null
  _grammars = new Map()

  constructor() {
    if (TextMateService._instance) {
      return TextMateService._instance
    }
    TextMateService._instance = this
  }

  static configure(config = {}) {
    TextMateService._config = {
      ...TextMateService._config,
      ...config
    }
  }

  static async initialize(config = {}) {
    if (TextMateService._initialized) {
      return TextMateService._instance
    }

    // Merge config if provided
    if (Object.keys(config).length > 0) {
      TextMateService.configure(config)
    }

    // Load the WASM for oniguruma
    try {
      if (TextMateService._config.wasmLoader) {
        // Use custom WASM loader provided by end application
        const wasmData = await TextMateService._config.wasmLoader()
        await loadWASM(wasmData)
      } else if (TextMateService._config.wasmPath) {
        // Load from custom path
        await loadWASM(TextMateService._config.wasmPath)
      } else {
        // Default: try to load from onigasm package
        const onigasmWasm = await import('onigasm/lib/onigasm.wasm')
        await loadWASM(onigasmWasm.default || onigasmWasm)
      }
    } catch (error) {
      console.error('Failed to load onigasm WASM:', error)
      throw error
    }

    const instance = new TextMateService()

    // Create registry with a grammar loader function
    instance._registry = new Registry({
      getGrammarDefinition: async (scopeName) => {
        const grammarData = instance._grammars.get(scopeName)
        if (!grammarData) {
          throw new Error(`Grammar not found for scope: ${scopeName}`)
        }

        return {
          format: 'json',
          content: grammarData
        }
      }
    })

    TextMateService._initialized = true
    return instance
  }

  static getInstance() {
    if (!TextMateService._initialized) {
      throw new Error('TextMateService must be initialized first')
    }
    return TextMateService._instance
  }

  async loadGrammar(scopeName, grammarData) {
    try {
      // Store the grammar data for the registry to use
      this._grammars.set(scopeName, grammarData)

      // Load the grammar through the registry
      const grammar = await this._registry.loadGrammar(scopeName)
      return grammar
    } catch (error) {
      console.error(`Failed to load grammar for ${scopeName}:`, error)
      throw error
    }
  }

  async registerLanguage(languageId, scopeName) {
    try {
      const grammars = new Map()
      grammars.set(languageId, scopeName)

      await wireTmGrammars(monaco, this._registry, grammars)
    } catch (error) {
      console.error(`Failed to register language ${languageId}:`, error)
      throw error
    }
  }

  getRegistry() {
    return this._registry
  }
}