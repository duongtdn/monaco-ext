"use strict"

import TextMateService from './TextMateService'
import * as monaco from 'monaco-editor'

// Import grammar files (these will be bundled by default)
// End applications can choose not to use these and provide their own
import JavaScriptGrammar from './syntaxes/javascript/JavaScript.tmLanguage.json'
import JavaScriptReactGrammar from './syntaxes/javascript/JavaScriptReact.tmLanguage.json'
import PythonGrammar from './syntaxes/python/MagicPython.tmLanguage.json'
import TypeScriptGrammar from './syntaxes/typescript/TypeScript.tmLanguage.json'
import JSONGrammar from './syntaxes/json/JSON.tmLanguage.json'
import XMLGrammar from './syntaxes/xml/XML.tmLanguage.json'

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
      grammar: JavaScriptReactGrammar,
      languages: ['typescriptreact']
    },
    'source.ts': {
      grammar: TypeScriptGrammar,
      languages: ['typescript']
    },
    'source.python': {
      grammar: PythonGrammar,
      languages: ['python']
    },
    'source.json': {
      grammar: JSONGrammar,
      languages: ['json', 'jsonc']
    },
    'text.xml': {
      grammar: XMLGrammar,
      languages: ['xml']
    }
  }

  static _customGrammars = {}

  /**
   * Register a custom grammar that can be loaded
   * @param {string} scopeName - The TextMate scope name (e.g., 'source.js')
   * @param {object} grammar - The grammar data object or a loader function
   * @param {string[]} languages - Array of Monaco language IDs to associate with this grammar
   */
  static registerGrammar(scopeName, grammar, languages) {
    SyntaxLoader._customGrammars[scopeName] = {
      grammar,
      languages
    }
  }

  /**
   * Load all built-in grammars
   * @param {string[]} languages - Optional array of specific languages to load. If not provided, loads all.
   */
  static async loadAll(languages = null) {
    try {
      // First ensure all required languages are registered with Monaco
      SyntaxLoader._registerLanguagesWithMonaco()

      const textMateService = await TextMateService.initialize()

      // Determine which grammars to load
      const allGrammars = { ...SyntaxLoader.grammars, ...SyntaxLoader._customGrammars }
      const grammarEntries = Object.entries(allGrammars)

      // Filter if specific languages requested
      const grammarsToLoad = languages
        ? grammarEntries.filter(([_, config]) =>
            config.languages.some(lang => languages.includes(lang))
          )
        : grammarEntries

      // Load in dependency order (JS first for JSX/TSX)
      const loadOrder = ['source.js', 'source.python', 'source.js.jsx', 'source.tsx', 'source.ts', 'source.json', 'text.xml']

      for (const scopeName of loadOrder) {
        const entry = grammarsToLoad.find(([scope]) => scope === scopeName)
        if (entry) {
          const [scope, config] = entry
          const grammarData = typeof config.grammar === 'function'
            ? await config.grammar()
            : config.grammar

          await textMateService.loadGrammar(scope, grammarData)

          // Register each language variant
          for (const languageId of config.languages) {
            await textMateService.registerLanguage(languageId, scope)
          }
        }
      }

      // Load remaining custom grammars not in loadOrder
      for (const [scopeName, config] of grammarsToLoad) {
        if (!loadOrder.includes(scopeName)) {
          const grammarData = typeof config.grammar === 'function'
            ? await config.grammar()
            : config.grammar

          await textMateService.loadGrammar(scopeName, grammarData)

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
        id: 'typescript',
        extensions: ['.ts'],
        aliases: ['TypeScript', 'typescript', 'ts']
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
      },
      {
        id: 'json',
        extensions: ['.json'],
        aliases: ['JSON', 'json']
      },
      {
        id: 'jsonc',
        extensions: ['.jsonc'],
        aliases: ['JSON with Comments', 'jsonc']
      },
      {
        id: 'xml',
        extensions: ['.xml', '.xsd', '.xsl', '.xslt', '.wsdl'],
        aliases: ['XML', 'xml']
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