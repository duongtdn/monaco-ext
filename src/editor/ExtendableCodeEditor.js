"use strict"

import EventChannel from "../event/EventChannel"
import MonacoEditor from "./MonacoEditor"
import { SyntaxLoader } from "../textmate"

export default class ExtendableCodeEditor {

  editor = undefined
  props = undefined
  eventChannel = new EventChannel()
  _textMateInitialized = false

  constructor(element, props) {
    this.editor = new MonacoEditor(element, props)
    this.props = props

    // Initialize TextMate syntax highlighting if enabled
    if (props?.enableTextMate !== false) {
      this._initializeTextMate()
    }
  }

  async _initializeTextMate() {
    try {
      if (!this._textMateInitialized) {
        await SyntaxLoader.loadAll()
        this._textMateInitialized = true
      }
    } catch (error) {
      console.warn('Failed to initialize TextMate syntax highlighting:', error)
    }
  }

  static loadThemes = (fn) => fn().then(themes => MonacoEditor.loadThemes(themes))
  static changeTheme = (theme) => MonacoEditor.changeTheme(theme)
  static colorizeElement = (...args) => MonacoEditor.colorizeElement(...args)

  static loadTextMateGrammars = () => SyntaxLoader.loadAll()
  static getSupportedLanguages = () => SyntaxLoader.getSupportedLanguages()

  addListener = (...args) => this.eventChannel.addListener(...args)
  removeListener = (...args) => this.eventChannel.removeListener(...args)
  removeAllListeners = (...args) => this.eventChannel.removeAllListeners(...args)
  emit = (...args) => this.eventChannel.emit(...args)

  features = {

    _methods: ['_methods', 'add', 'remove', 'list'],

    add: (name, feature) => {
      if (this.features._methods.includes(name)) {
        throw new Error(`The name '${name}' is reserved. Please use another feature name`)
      }
      if (this.features[name]) {
        throw new Error(`The name '${name}' is already used. Please choose another feature name`)
      }
      this.features[name] = feature
      feature.inject(this.editor, this.eventChannel)
      return feature
    },

    remove: (name) => {
      if (this.features[name]) {
        this.features[name].deactivate(name)
        delete this.features[name]
      }
    },

    list: () => {
      return Object.keys(this.features).filter(name => this.features._methods.indexOf(name) === -1)
    },

  }

}
