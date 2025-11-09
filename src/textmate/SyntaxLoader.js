"use strict"

import TextMateService from './TextMateService'
import * as monaco from 'monaco-editor'

// Import grammar files
import JavaScriptGrammar from './syntaxes/javascript/JavaScript.tmLanguage.json'
import JavaScriptReactGrammar from './syntaxes/javascript/JavaScriptReact.tmLanguage.json'
import PythonGrammar from './syntaxes/python/MagicPython.tmLanguage.json'

export default class SyntaxLoader {
  static grammars = {
    'source.js': {
      grammar: JavaScriptGrammar,
      languages: ['javascript']
    },
    'source.js.jsx': {
      grammar: JavaScriptReactGrammar,
      languages: ['javascriptreact']
    },
    'source.tsx': {
      grammar: JavaScriptReactGrammar, // Use same grammar for tsx
      languages: ['typescriptreact']
    },
    'source.python': {
      grammar: PythonGrammar,
      languages: ['python']
    }
  }

  static async loadAll() {
    try {
      // First ensure all required languages are registered with Monaco
      SyntaxLoader._registerLanguagesWithMonaco()

      const textMateService = await TextMateService.initialize()

      // Load base JavaScript grammar first, then others
      const loadOrder = ['source.js', 'source.python', 'source.js.jsx', 'source.tsx']

      for (const scopeName of loadOrder) {
        const config = SyntaxLoader.grammars[scopeName]
        if (config) {
          await textMateService.loadGrammar(scopeName, config.grammar)

          // Register each language variant
          for (const languageId of config.languages) {
            await textMateService.registerLanguage(languageId, scopeName)
          }
        }
      }

      return textMateService
    } catch (error) {
      console.error('Failed to load TextMate grammars:', error)
      throw error
    }
  }

  static _registerLanguagesWithMonaco() {
    // Get all currently registered languages
    const registeredLanguages = monaco.languages.getLanguages().map(lang => lang.id)

    // Define languages we need with their configurations
    const requiredLanguages = [
      {
        id: 'javascript',
        extensions: ['.js', '.mjs'],
        aliases: ['JavaScript', 'javascript', 'js']
      },
      {
        id: 'javascriptreact',
        extensions: ['.jsx'],
        aliases: ['JavaScript React', 'jsx', 'react']
      },
      {
        id: 'typescriptreact',
        extensions: ['.tsx'],
        aliases: ['TypeScript React', 'tsx']
      },
      {
        id: 'python',
        extensions: ['.py', '.pyw', '.pyc', '.pyo', '.pyd', '.pyz'],
        aliases: ['Python', 'python', 'py']
      }
    ]

    // Register any missing languages
    for (const language of requiredLanguages) {
      if (!registeredLanguages.includes(language.id)) {
        monaco.languages.register(language)
      }
    }
  }

  static async loadGrammar(scopeName, languageId) {
    try {
      // Ensure the language is registered
      SyntaxLoader._registerLanguagesWithMonaco()

      const textMateService = TextMateService.getInstance()
      const config = SyntaxLoader.grammars[scopeName]

      if (!config) {
        throw new Error(`Grammar not found for scope: ${scopeName}`)
      }

      await textMateService.loadGrammar(scopeName, config.grammar)
      await textMateService.registerLanguage(languageId, scopeName)

      return textMateService
    } catch (error) {
      console.error(`Failed to load grammar for ${scopeName}:`, error)
      throw error
    }
  }

  static getSupportedLanguages() {
    const languages = []
    for (const config of Object.values(SyntaxLoader.grammars)) {
      languages.push(...config.languages)
    }
    return languages
  }
}