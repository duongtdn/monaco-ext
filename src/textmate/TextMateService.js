"use strict"

import { loadWASM } from 'onigasm'
import { Registry } from 'monaco-textmate'
import { wireTmGrammars } from 'monaco-editor-textmate'
import * as monaco from 'monaco-editor'

export default class TextMateService {
  static _instance = null
  static _initialized = false

  _registry = null
  _grammars = new Map()

  constructor() {
    if (TextMateService._instance) {
      return TextMateService._instance
    }
    TextMateService._instance = this
  }

  static async initialize() {
    if (TextMateService._initialized) {
      return TextMateService._instance
    }

    // Load the WASM for oniguruma
    try {
      // Check if we're in a test environment
      if (typeof jest !== 'undefined' || process.env.NODE_ENV === 'test') {
        // In test environment, mock the WASM loading
        await loadWASM('mocked-wasm-path')
      } else {
        // In browser/webpack environment
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